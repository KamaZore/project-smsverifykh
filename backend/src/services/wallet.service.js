import db from "../config/database.js";
import { BadRequestError } from "../errors/AppError.js";

export async function getBalance(userId) {
  const [rows] = await db.query("SELECT balance FROM users WHERE id = ?", [userId]);
  if (rows.length === 0) throw new BadRequestError("User not found");
  return { balance: rows[0].balance };
}

export async function getTransactions(userId, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const [rows] = await db.query(
    "SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
    [userId, limit, offset]
  );
  const [countResult] = await db.query(
    "SELECT COUNT(*) as total FROM transactions WHERE user_id = ?",
    [userId]
  );
  return { data: rows, total: countResult[0].total, page, limit };
}

export async function getTransactionSummary(userId) {
  const [deposits] = await db.query(
    "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = ? AND type = 'deposit'",
    [userId]
  );
  const [purchases] = await db.query(
    "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = ? AND type = 'activation_purchase'",
    [userId]
  );
  const [refunds] = await db.query(
    "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = ? AND type = 'refund'",
    [userId]
  );

  return {
    totalDeposits: deposits[0].total,
    totalPurchases: purchases[0].total,
    totalRefunds: refunds[0].total,
  };
}

export async function addBalance(userId, amount, description = "Manual top-up") {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query(
      "SELECT balance FROM users WHERE id = ? FOR UPDATE",
      [userId]
    );
    if (rows.length === 0) throw new BadRequestError("User not found");

    const newBalance = parseFloat(rows[0].balance) + parseFloat(amount);
    await conn.query("UPDATE users SET balance = ? WHERE id = ?", [newBalance, userId]);

    await conn.query(
      "INSERT INTO transactions (user_id, type, amount, balance_after, description) VALUES (?, 'deposit', ?, ?, ?)",
      [userId, amount, newBalance, description]
    );

    await conn.commit();
    return { balance: newBalance };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
