import axios from "axios";
import { config } from "../util/config";

const authApi = axios.create({
  baseURL: config.BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * POST /api/admin/login
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{admin: {id: number, username: string, role: string}, token: string}>}
 */
export const adminLogin = async (username, password) => {
  const res = await authApi.post("/admin/login", { username, password });
  if (!res.data?.success) {
    throw new Error(res.data?.error?.message || "Login failed");
  }
  return res.data.data;
};
