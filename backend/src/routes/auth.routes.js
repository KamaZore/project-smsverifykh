import { Router } from "express";
import userController from "../controllers/user.controller.js";
import validate from "../middleware/validation.js";
import { authenticate } from "../middleware/auth.js";
import * as authSchema from "../validators/auth.validator.js";

const router = Router();

// ─── Public auth endpoints ──────────────────────────────
router.post("/register", validate(authSchema.register, "body"), userController.register);
router.post("/login", validate(authSchema.login, "body"), userController.login);
router.post("/refresh", validate(authSchema.refresh, "body"), userController.refreshToken);

// ─── Protected ──────────────────────────────────────────
router.get("/me", authenticate, userController.getProfile);

export default router;