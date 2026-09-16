import db from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import heroSmsConfig from "../config/heroSms.js";
import { UnauthorizedError, BadRequestError, ConflictError, NotFoundError } from "../errors/AppError.js";
import { getBalance, getActiveActivations, getServicesList, getServiceNumbersCount } from "./hero-sms.service.js";
import { getSetting, setSetting, SETTING_KEYS } from "./settings.service.js";

const SALT_ROUNDS = 12;

export async function getHeroKeyStatus() {
  const dbKey = await getSetting(SETTING_KEYS.HERO_SMS_API_KEY);
  const active = dbKey || env.HERO_SMS_API_KEY || "";
  const provider = active ? await verifyKey(active) : { ok: false, balance: null, message: "Not verified yet" };
  return {
    configured: Boolean(active),
    source: dbKey ? "database" : env.HERO_SMS_API_KEY ? "env" : "none",
    maskedKey: maskKey(active),
    updatedAt: null,
    provider: { reachable: provider.ok, balance: provider.balance, message: provider.message },
  };
}

export async function updateHeroKey(apiKey) {
  await setSetting(SETTING_KEYS.HERO_SMS_API_KEY, apiKey);
  await db.query(
    "INSERT INTO audit_log (user_id, action, details) VALUES (NULL, 'hero_key_updated', JSON_OBJECT('masked', ?))",
    [maskKey(apiKey)]
  );
  return {
    configured: true,
    source: "database",
    maskedKey: maskKey(apiKey),
    updatedAt: new Date(),
    provider: { reachable: false, balance: null, message: "Key saved locally" },
  };
}

export async function getHeroProfile() {
  const status = await getHeroKeyStatus();
  const accountInfo = await getHeroAccountInfo();
  let activeCount = null;
  let providerMessage = status.provider.message;
  if (status.configured) {
    try {
      const act = await getActiveActivations();
      activeCount = Array.isArray(act) ? act.length : typeof act === "number" ? act : null;
    } catch (err) {
      providerMessage = providerMessage ? `${providerMessage}; active activations: unavailable` : "Provider unreachable";
    }
  }
  return {
    configured: status.configured,
    source: status.source,
    maskedKey: status.maskedKey,
    accountId: accountInfo.accountId,
    email: accountInfo.email,
    username: accountInfo.username,
    provider: { reachable: status.provider.reachable, balance: status.provider.balance, message: providerMessage },
    activeActivations: activeCount,
    lastChecked: new Date(),
  };
}

export async function getMyAccount() {
  const balance = await getBalance();
  const active = await getActiveActivations();
  let balanceValue = null;
  if (typeof balance === "string") {
    const m = balance.match(/ACCESS_BALANCE:(d+.?d*)/);
    if (m) balanceValue = parseFloat(m[1]);
  } else if (balance && typeof balance === "object" && balance.balance !== undefined) {
    balanceValue = balance.balance;
  }
  const activeCount = Array.isArray(active) ? active.length : typeof active === "number" ? active : null;
  return { balance: balanceValue, activeActivations: activeCount };
}export async function adminLogin(username, password) {
  const [rows] = await db.query("SELECT id, username, password_hash, role, is_active FROM admin_users WHERE username = ?", [username]);
  if (rows.length === 0) throw new UnauthorizedError("Invalid credentials");
  const admin = rows[0];
  if (!admin.is_active) throw new UnauthorizedError("Admin account is disabled");
  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) throw new UnauthorizedError("Invalid credentials");
  const token = jwt.sign({ id: admin.id, role: admin.role }, env.JWT_SECRET, { expiresIn: "12h" });
  return { admin: { id: admin.id, username: admin.username, role: admin.role }, token };
}

export async function createAdmin(username, password, role = "admin") {
  const [existing] = await db.query("SELECT id FROM admin_users WHERE username = ?", [username]);
  if (existing.length > 0) throw new ConflictError("Username already exists");
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const [result] = await db.query("INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?)", [username, passwordHash, role]);
  return { id: result.insertId, username, role };
}

export async function getDashboardStats() {
  const [users] = await db.query("SELECT COUNT(*) as total FROM users");
  const [activeUsers] = await db.query("SELECT COUNT(*) as total FROM users WHERE status = 'active'");
  const [activations] = await db.query("SELECT COUNT(*) as total FROM activations");
  const [pendingActivations] = await db.query("SELECT COUNT(*) as total FROM activations WHERE status = 'pending'");
  const [totalBalance] = await db.query("SELECT COALESCE(SUM(balance), 0) as total FROM users");
  const [totalDeposits] = await db.query("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'deposit'");
  return {
    totalUsers: users[0].total, activeUsers: activeUsers[0].total, totalActivations: activations[0].total,
    pendingActivations: pendingActivations[0].total, totalBalance: totalBalance[0].total, totalDeposits: totalDeposits[0].total,
  };
}

export async function getUsers(page = 1, limit = 20, search = "") {
  const offset = (page - 1) * limit;
  let query = "SELECT id, username, email, balance, status, created_at FROM users";
  let countQuery = "SELECT COUNT(*) as total FROM users";
  const params = [];
  if (search) { const where = " WHERE username LIKE ? OR email LIKE ?"; query += where; countQuery += where; params.push(`%${search}%`, `%${search}%`); }
  query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
  const countParams = [...params];
  params.push(limit, offset);
  const [rows] = await db.query(query, params);
  const [countResult] = await db.query(countQuery, countParams);
  return { data: rows, total: countResult[0].total, page, limit };
}

export async function getUserById(userId) {
  const [rows] = await db.query("SELECT id, username, email, balance, status, created_at FROM users WHERE id = ?", [userId]);
  if (rows.length === 0) throw new NotFoundError("User not found");
  return rows[0];
}

export async function updateUserStatus(userId, status) {
  const [rows] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);
  if (rows.length === 0) throw new NotFoundError("User not found");
  await db.query("UPDATE users SET status = ? WHERE id = ?", [status, userId]);
  return { message: `User ${status}` };
}

export async function adjustBalance(userId, amount, description = "Admin adjustment") {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query("SELECT balance FROM users WHERE id = ? FOR UPDATE", [userId]);
    if (rows.length === 0) throw new NotFoundError("User not found");
    const newBalance = parseFloat(rows[0].balance) + parseFloat(amount);
    if (newBalance < 0) throw new BadRequestError("Insufficient balance");
    await conn.query("UPDATE users SET balance = ? WHERE id = ?", [newBalance, userId]);
    await conn.query("INSERT INTO transactions (user_id, type, amount, balance_after, description) VALUES (?, 'deposit', ?, ?, ?)", [userId, amount, newBalance, description]);
    await conn.commit();
    return { balance: newBalance };
  } catch (err) { await conn.rollback(); throw err; } finally { conn.release(); }
}

export async function getAllActivations(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const [rows] = await db.query(`SELECT a.*, u.username, u.email FROM activations a JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC LIMIT ? OFFSET ?`, [limit, offset]);
  const [countResult] = await db.query("SELECT COUNT(*) as total FROM activations");
  return { data: rows, total: countResult[0].total, page, limit };
}

export async function getAllTransactions(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const [rows] = await db.query(`SELECT t.*, u.username, u.email FROM transactions t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC LIMIT ? OFFSET ?`, [limit, offset]);
  const [countResult] = await db.query("SELECT COUNT(*) as total FROM transactions");
  return { data: rows, total: countResult[0].total, page, limit };
}

const maskKey = (key) => {
  if (!key) return "";
  if (key.length <= 8) return "*".repeat(key.length);
  return `${key.slice(0, 4)}${"*".repeat(Math.max(key.length - 8, 4))}${key.slice(-4)}`;
};

async function verifyKey(key) {
  try {
    const raw = await getBalance(key);
    let balance = null;
    if (typeof raw === "string") { balance = parseFloat(raw.split(":")[1]); }
    else if (raw && typeof raw === "object") { const entry = Object.entries(raw).find(([k]) => k.toLowerCase().includes("balance")); balance = parseFloat(entry?.[1]); }
    if (Number.isFinite(balance)) return { ok: true, balance, message: "Key is valid" };
    const detail = raw && typeof raw === "object" && raw.details ? raw.details : "Provider did not return a balance";
    return { ok: false, balance: null, message: String(detail) };
  } catch (err) {
    const label = err && err.constructor && err.constructor.name ? err.constructor.name : "Error";
    const providerMessage = err && typeof err.message === "string" ? err.message : "Key rejected by HERO SMS";
    return { ok: false, balance: null, message: `${label}: ${providerMessage}` };
  }
}

// ─── Hero SMS Account Info (locally stored) ───────────────

export async function getHeroAccountInfo() {
  const accountId = await getSetting(SETTING_KEYS.HERO_SMS_ACCOUNT_ID) || heroSmsConfig.accountId;
  const email = await getSetting(SETTING_KEYS.HERO_SMS_EMAIL) || heroSmsConfig.email;
  const username = await getSetting(SETTING_KEYS.HERO_SMS_USERNAME) || heroSmsConfig.username;
  const password = await getSetting(SETTING_KEYS.HERO_SMS_PASSWORD) || heroSmsConfig.password;
  return { accountId: accountId || null, email: email || null, username: username || null, password: password ? "********" : null };
}

export async function updateHeroAccountInfo({ accountId, email, username, password }) {
  if (accountId !== undefined) await setSetting(SETTING_KEYS.HERO_SMS_ACCOUNT_ID, accountId);
  if (email !== undefined) await setSetting(SETTING_KEYS.HERO_SMS_EMAIL, email);
  if (username !== undefined) await setSetting(SETTING_KEYS.HERO_SMS_USERNAME, username);
  if (password !== undefined) await setSetting(SETTING_KEYS.HERO_SMS_PASSWORD, password);
  return getHeroAccountInfo();
}

// ─── Stock ───────────────────────────────────────────────

export async function getStockServices() {
  const raw = await getServicesList();
  // Hero SMS API may return: string "gn,fb,ig" OR JSON { status, services: "gn,fb,ig" }
  let list = raw;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    list = raw.services || raw.data || null;
    if (!list) return [];
  }
  if (typeof list === "string") {
    return list.split(",").map((s) => s.trim()).filter(Boolean).map((code) => ({ code, name: "" }));
  }
  if (Array.isArray(list)) {
    return list.map((item) => {
      if (typeof item === "string") return { code: item, name: "" };
      if (item && typeof item === "object") return { code: String(item.service || item.code || item.id || ""), name: String(item.name || item.description || "") };
      return { code: String(item), name: "" };
    });
  }
  return [];
}

export async function getStockCount(service) {
  const raw = await getServiceNumbersCount(service);
  let count = null;
  if (typeof raw === "string") {
    const num = parseInt(raw.replace(/\D/g, ""), 10);
    if (Number.isFinite(num)) count = num;
  } else if (typeof raw === "number") {
    count = raw;
  } else if (raw && typeof raw === "object") {
    const entry = Object.entries(raw).find(([k]) => /count|qty|total|numbers/i.test(k));
    if (entry) count = parseInt(entry[1], 10);
  }
  return { service, count: Number.isFinite(count) ? count : 0 };
}