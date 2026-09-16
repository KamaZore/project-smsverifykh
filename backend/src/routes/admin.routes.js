import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import validate from "../middleware/validation.js";
import { adminAuthenticate } from "../middleware/admin-auth.js";
import * as adminSchema from "../validators/admin.validator.js";

const router = Router();

router.post(
  "/login",
  validate(adminSchema.adminLogin, "body"),
  adminController.adminLogin,
);

router.use(adminAuthenticate);

// Dashboard
router.get("/dashboard/stats", adminController.getDashboardStats);

// Users
router.get("/users", adminController.getUsers);
router.get("/users/:id", adminController.getUserById);
router.patch(
  "/users/:id/status",
  validate(adminSchema.updateStatus, "body"),
  adminController.updateUserStatus,
);
router.post(
  "/users/:id/balance",
  validate(adminSchema.adjustBalance, "body"),
  adminController.adjustBalance,
);

// Activations / Transactions
router.get("/activations", adminController.getActivations);
router.get("/transactions", adminController.getTransactions);

// API Key management (HERO SMS)
router.get("/settings/hero-key", adminController.getHeroKeyStatus);
router.put(
  "/settings/hero-key",
  validate(adminSchema.updateHeroKey, "body"),
  adminController.updateHeroKey,
);

// Alias: /settings/api-keys (admin UI preference) — mirrors /settings/hero-key
router.get("/settings/api-keys", adminController.getHeroKeyStatus);
router.put(
  "/settings/api-keys",
  validate(adminSchema.updateHeroKey, "body"),
  adminController.updateHeroKey,
);

// Hero SMS profile card data (sidebar)
router.get("/settings/hero-profile", adminController.getHeroProfile);

// Hero SMS account info (locally stored email/username)
router.get("/settings/hero-account", adminController.getHeroAccountInfo);
router.put(
  "/settings/hero-account",
  validate(adminSchema.updateHeroAccount, "body"),
  adminController.updateHeroAccountInfo,
);

// My HeroSMS account info
router.get("/herosms/me", adminController.getMyAccount);

// Stock (services & number counts)
router.get("/stock/services", adminController.getStockServices);
router.get(
  "/stock/count",
  validate(adminSchema.stockCount, "query"),
  adminController.getStockCount,
);

export default router;
