import axios from "axios";
import { config } from "../util/config";
import { getAccessToken, clearSession } from "../store/token_access";

const adminApi = axios.create({
  baseURL: config.BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the admin Bearer token to every request
adminApi.interceptors.request.use((cfg) => {
  const token = getAccessToken();
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Session expired / invalid → clear storage and return to the login screen
adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearSession();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

const unwrap = (res) => {
  if (!res.data?.success) {
    throw new Error(res.data?.error?.message || "Request failed");
  }
  return res.data.data;
};

/** GET /api/admin/dashboard/stats */
export const getDashboardStats = async () =>
  unwrap(await adminApi.get("/admin/dashboard/stats"));

/** GET /api/admin/users?page&limit&search — returns { data, total, page, limit } */
export const getUsers = async ({ page = 1, limit = 10, search = "" } = {}) =>
  unwrap(await adminApi.get("/admin/users", { params: { page, limit, search } }));

/** GET /api/admin/activations?page&limit — returns { data, total, page, limit } */
export const getActivations = async ({ page = 1, limit = 10 } = {}) =>
  unwrap(await adminApi.get("/admin/activations", { params: { page, limit } }));

/** GET /api/admin/transactions?page&limit — returns { data, total, page, limit } */
export const getTransactions = async ({ page = 1, limit = 10 } = {}) =>
  unwrap(await adminApi.get("/admin/transactions", { params: { page, limit } }));

/** PATCH /api/admin/users/:id/status — body: { status: "active" | "suspended" | "banned" } */
export const updateUserStatus = async (userId, status) =>
  unwrap(await adminApi.patch(`/admin/users/${userId}/status`, { status }));

/** POST /api/admin/users/:id/balance — body: { amount, description } (amount can be negative) */
export const adjustUserBalance = async (userId, amount, description) =>
  unwrap(await adminApi.post(`/admin/users/${userId}/balance`, { amount, description }));

/** GET /api/admin/settings/hero-key — masked key status (never returns the raw key) */
export const getHeroKeyStatus = async () =>
  unwrap(await adminApi.get("/admin/settings/hero-key"));

/** PUT /api/admin/settings/hero-key — body: { apiKey } — validated against HERO SMS before saving */
export const updateHeroKey = async (apiKey) =>
  unwrap(await adminApi.put("/admin/settings/hero-key", { apiKey }));

/** GET /api/admin/settings/hero-profile — Hero SMS profile bundle for the sidebar card */
export const getHeroProfile = async () =>
  unwrap(await adminApi.get("/admin/settings/hero-profile"));

/** GET /api/admin/stock/services — list of Hero SMS services */
export const getStockServices = async () =>
  unwrap(await adminApi.get("/admin/stock/services"));

/** GET /api/admin/stock/count?service=xxx — number count for a service */
export const getStockCount = async (service) =>
  unwrap(await adminApi.get("/admin/stock/count", { params: { service } }));
