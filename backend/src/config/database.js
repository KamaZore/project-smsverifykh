import mysql from "mysql2/promise";
import env from "./env.js";

const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  namedPlaceholders: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("Database connected successfully.");
    conn.release();
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
}

export default pool;
