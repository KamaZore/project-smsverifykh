import { Router } from "express";
import userController from "../controllers/user.controller.js";
import validate from "../middleware/validation.js";
import { authenticate } from "../middleware/auth.js";
import * as userSchema from "../validators/user.validator.js";

const router = Router();

// All /api/user routes require a valid access token
router.use(authenticate);

// ─── Profile ────────────────────────────────────────────
router.get("/profile", userController.getProfile);
router.put("/profile", validate(userSchema.updateProfile, "body"), userController.updateProfile);
router.post("/change-password", validate(userSchema.changePassword, "body"), userController.changePassword);

// ─── Dashboard ─────────────────────────────────────────
router.get("/dashboard", userController.getDashboard);

// ─── Activations ───────────────────────────────────────
router.post("/rent-number", validate(userSchema.rentNumber, "body"), userController.rentNumber);
router.get("/activations", userController.getMyActivations);
router.get("/activations/:id", userController.getActivationStatus);
router.post("/activations/:id/cancel", userController.cancelActivation);

// ─── Wallet ────────────────────────────────────────────
router.get("/balance", userController.getBalance);
router.get("/transactions", userController.getTransactions);

export default router;