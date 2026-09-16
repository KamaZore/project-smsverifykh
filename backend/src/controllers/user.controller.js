import * as userService from "../services/user.service.js";
import * as activationService from "../services/activation.service.js";
import * as walletService from "../services/wallet.service.js";
import asyncWrapper from "../middleware/async-wrapper.js";

// ─── Auth ──────────────────────────────────────────────
export const register = asyncWrapper(async (req, res) => {
  const { username, email, password } = req.validated.body;
  const result = await userService.register(username, email, password);
  res.status(201).json({ success: true, data: result });
});

export const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.validated.body;
  const result = await userService.login(email, password);
  res.json({ success: true, data: result });
});

export const refreshToken = asyncWrapper(async (req, res) => {
  const { refreshToken } = req.validated.body;
  const tokens = await userService.refreshToken(refreshToken);
  res.json({ success: true, data: tokens });
});

// ─── Profile ───────────────────────────────────────────
export const getProfile = asyncWrapper(async (req, res) => {
  const profile = await userService.getProfile(req.user.id);
  res.json({ success: true, data: profile });
});

export const updateProfile = asyncWrapper(async (req, res) => {
  const profile = await userService.updateProfile(req.user.id, req.validated.body);
  res.json({ success: true, data: profile });
});

export const changePassword = asyncWrapper(async (req, res) => {
  const { oldPassword, newPassword } = req.validated.body;
  const result = await userService.changePassword(req.user.id, oldPassword, newPassword);
  res.json({ success: true, data: result });
});

// ─── Dashboard ─────────────────────────────────────────
export const getDashboard = asyncWrapper(async (req, res) => {
  const balance = await walletService.getBalance(req.user.id);
  const activations = await activationService.getActiveActivations(req.user.id);
  const summary = await walletService.getTransactionSummary(req.user.id);
  res.json({ success: true, data: { ...balance, activeActivations: activations.length, ...summary } });
});

// ─── Activations ───────────────────────────────────────
export const rentNumber = asyncWrapper(async (req, res) => {
  const { service, country, maxPrice, providerIds, activationType } = req.validated.body;
  const result = await activationService.rentNumber(req.user.id, service, country, {
    maxPrice,
    providerIds,
    activationType,
  });
  res.status(201).json({ success: true, data: result });
});

export const getActivationStatus = asyncWrapper(async (req, res) => {
  const activation = await activationService.getActivationStatus(req.user.id, req.params.id);
  res.json({ success: true, data: activation });
});

export const getMyActivations = asyncWrapper(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const result = await activationService.getActivationHistory(req.user.id, page, limit);
  res.json({ success: true, data: result });
});

export const cancelActivation = asyncWrapper(async (req, res) => {
  const result = await activationService.cancelActivation(req.user.id, req.params.id);
  res.json({ success: true, data: result });
});

// ─── Wallet ────────────────────────────────────────────
export const getBalance = asyncWrapper(async (req, res) => {
  const result = await walletService.getBalance(req.user.id);
  res.json({ success: true, data: result });
});

export const getTransactions = asyncWrapper(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const result = await walletService.getTransactions(req.user.id, page, limit);
  res.json({ success: true, data: result });
});

export default {
  register,
  login,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
  getDashboard,
  rentNumber,
  getActivationStatus,
  getMyActivations,
  cancelActivation,
  getBalance,
  getTransactions,
};
