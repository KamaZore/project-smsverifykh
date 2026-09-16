import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import adminRoutes from "./admin.routes.js";
import v1Routes from "./v1.routes.js";
import v2Routes from "./v2.routes.js";
import v3Routes from "./v3.routes.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// ─── Public routes ─────────────────────────────────────
router.use("/api/auth", authRoutes);
router.use("/api/admin", adminRoutes);

// ─── Protected routes (valid access token required) ────
router.use("/api/user", userRoutes);
router.use("/api/v1", authenticate, v1Routes);
router.use("/api/v2", authenticate, v2Routes);
router.use("/api/v3", authenticate, v3Routes);

router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
