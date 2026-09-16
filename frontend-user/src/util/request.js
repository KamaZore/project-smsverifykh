import axios from "axios";
import { config } from "./config";
import { getAccessToken, removeAccessToken } from "../store/access_token";

const api = axios.create({
  baseURL: config.BASE_URL,
});

api.interceptors.request.use((req) => {
  const token = getAccessToken("access_token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  if (req.data instanceof FormData) {
    req.headers["Content-Type"] = "multipart/form-data";
  }
  return req;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const url = err.config?.url || "";
      const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/register") || url.includes("/auth/refresh");
      if (!isAuthEndpoint) {
        removeAccessToken("access_token");
        removeAccessToken("refresh_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export const request = ({ url = "", method = "", data = {} }) => {
  return api({ url, method, data });
};
