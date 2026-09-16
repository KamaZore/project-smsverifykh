import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { UnauthorizedError } from "../errors/AppError.js";
import asyncWrapper from "./async-wrapper.js";
import db from "../config/database.js";

export const authenticate = asyncWrapper(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }

  const token = header.split(" ")[1];
  const decoded = jwt.verify(token, env.JWT_SECRET);

  const [rows] = await db.query(
    "SELECT id, username, email, balance, status FROM users WHERE id = ? AND status = 'active'",
    [decoded.id]
  );

  if (rows.length === 0) {
    throw new UnauthorizedError("User not found or suspended");
  }

  req.user = rows[0];
  next();
});

export function generateTokens(userId) {
  const accessToken = jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}
