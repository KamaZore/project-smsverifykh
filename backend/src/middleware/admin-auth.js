import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { UnauthorizedError } from "../errors/AppError.js";
import asyncWrapper from "./async-wrapper.js";
import db from "../config/database.js";

// Verifies an admin JWT (issued by admin.service.adminLogin) and
// attaches the admin record to req.admin. Separate from the
// end-user `authenticate` middleware which queries the users table.
export const adminAuthenticate = asyncWrapper(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }

  const token = header.split(" ")[1];
  const decoded = jwt.verify(token, env.JWT_SECRET);

  const [rows] = await db.query(
    "SELECT id, username, role FROM admin_users WHERE id = ? AND is_active = 1",
    [decoded.id]
  );

  if (rows.length === 0) {
    throw new UnauthorizedError("Admin not found or disabled");
  }

  req.admin = rows[0];
  next();
});