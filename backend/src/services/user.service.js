import db from "../config/database.js";
import bcrypt from "bcryptjs";
import { generateTokens, verifyRefreshToken } from "../middleware/auth.js";
import { UnauthorizedError, BadRequestError, ConflictError } from "../errors/AppError.js";

const SALT_ROUNDS = 12;

export async function register(username, email, password) {
  const [existing] = await db.query(
    "SELECT id FROM users WHERE email = ? OR username = ?",
    [email, username]
  );
  if (existing.length > 0) {
    throw new ConflictError("Email or username already exists");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const [result] = await db.query(
    "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
    [username, email, passwordHash]
  );

  const tokens = generateTokens(result.insertId);
  return { userId: result.insertId, ...tokens };
}

export async function login(email, password) {
  const [rows] = await db.query(
    "SELECT id, username, email, password_hash, balance, status FROM users WHERE email = ?",
    [email]
  );
  if (rows.length === 0) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const user = rows[0];
  if (user.status !== "active") {
    throw new UnauthorizedError("Account is suspended");
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const tokens = generateTokens(user.id);
  return {
    user: { id: user.id, username: user.username, email: user.email, balance: user.balance },
    ...tokens,
  };
}

export async function refreshToken(refreshToken) {
  const decoded = verifyRefreshToken(refreshToken);
  const [rows] = await db.query("SELECT id FROM users WHERE id = ?", [decoded.id]);
  if (rows.length === 0) {
    throw new UnauthorizedError("User not found");
  }
  return generateTokens(decoded.id);
}

export async function getProfile(userId) {
  const [rows] = await db.query(
    "SELECT id, username, email, balance, status, created_at FROM users WHERE id = ?",
    [userId]
  );
  if (rows.length === 0) {
    throw new BadRequestError("User not found");
  }
  return rows[0];
}

export async function updateProfile(userId, data) {
  const fields = [];
  const values = [];

  if (data.username) {
    fields.push("username = ?");
    values.push(data.username);
  }
  if (data.email) {
    fields.push("email = ?");
    values.push(data.email);
  }

  if (fields.length === 0) return getProfile(userId);

  values.push(userId);
  await db.query(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values);
  return getProfile(userId);
}

export async function changePassword(userId, oldPassword, newPassword) {
  const [rows] = await db.query("SELECT password_hash FROM users WHERE id = ?", [userId]);
  if (rows.length === 0) throw new BadRequestError("User not found");

  const valid = await bcrypt.compare(oldPassword, rows[0].password_hash);
  if (!valid) throw new UnauthorizedError("Current password is incorrect");

  const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await db.query("UPDATE users SET password_hash = ? WHERE id = ?", [hash, userId]);
  return { message: "Password updated" };
}
