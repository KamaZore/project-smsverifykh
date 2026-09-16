import * as adminService from "../services/admin.service.js";
import asyncWrapper from "../middleware/async-wrapper.js";

// ─── Auth ──────────────────────────────────────────────
export const adminLogin = asyncWrapper(async (req, res) => {
  const { username, password } = req.validated.body;
  const result = await adminService.adminLogin(username, password);
  res.json({ success: true, data: result });
});

// ─── Dashboard ─────────────────────────────────────────
export const getDashboardStats = asyncWrapper(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  res.json({ success: true, data: stats });
});

// ─── Users ─────────────────────────────────────────────
export const getUsers = asyncWrapper(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const search = (req.query.search || "").trim();
  const result = await adminService.getUsers(page, limit, search);
  res.json({ success: true, data: result });
});

export const getUserById = asyncWrapper(async (req, res) => {
  const user = await adminService.getUserById(req.params.id);
  res.json({ success: true, data: user });
});

export const updateUserStatus = asyncWrapper(async (req, res) => {
  const { status } = req.validated.body;
  const result = await adminService.updateUserStatus(req.params.id, status);
  res.json({ success: true, data: result });
});

export const adjustBalance = asyncWrapper(async (req, res) => {
  const { amount, description } = req.validated.body;
  const result = await adminService.adjustBalance(req.params.id, amount, description);
  res.json({ success: true, data: result });
});

// ─── Activations / Transactions ────────────────────────
export const getActivations = asyncWrapper(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const result = await adminService.getAllActivations(page, limit);
  res.json({ success: true, data: result });
});

export const getTransactions = asyncWrapper(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const result = await adminService.getAllTransactions(page, limit);
  res.json({ success: true, data: result });
});

// ─── API Key management (HERO SMS) ─────────────────────
export const getHeroKeyStatus = asyncWrapper(async (req, res) => {
  const status = await adminService.getHeroKeyStatus();
  res.json({ success: true, data: status });
});

export const updateHeroKey = asyncWrapper(async (req, res) => {
  const { apiKey } = req.validated.body;
  const status = await adminService.updateHeroKey(apiKey);
  res.json({ success: true, data: status });
});

export const getHeroProfile = asyncWrapper(async (req, res) => {
  const profile = await adminService.getHeroProfile();
  res.json({ success: true, data: profile });
});

export const getMyAccount = asyncWrapper(async (req, res) => {
  const account = await adminService.getMyAccount();
  res.json({ success: true, data: account });
});

export const getHeroAccountInfo = asyncWrapper(async (req, res) => {
  const info = await adminService.getHeroAccountInfo();
  res.json({ success: true, data: info });
});

export const updateHeroAccountInfo = asyncWrapper(async (req, res) => {
  const info = await adminService.updateHeroAccountInfo(req.validated.body);
  res.json({ success: true, data: info });
});

// ─── Stock (HERO SMS services & number counts) ──────────
export const getStockServices = asyncWrapper(async (req, res) => {
  const services = await adminService.getStockServices();
  res.json({ success: true, data: services });
});

export const getStockCount = asyncWrapper(async (req, res) => {
  const { service } = req.validated.query;
  const count = await adminService.getStockCount(service);
  res.json({ success: true, data: count });
});

export default {
  adminLogin,
  getDashboardStats,
  getUsers,
  getUserById,
  updateUserStatus,
  adjustBalance,
  getActivations,
  getTransactions,
  getHeroKeyStatus,
  updateHeroKey,
  getHeroProfile,
  getMyAccount,
  getHeroAccountInfo,
  updateHeroAccountInfo,
  getStockServices,
  getStockCount,
};