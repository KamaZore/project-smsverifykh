import { request } from "../util/request";

export const userApi = {
  getProfile: () =>
    request({ url: "/user/profile", method: "GET" }),

  updateProfile: (data) =>
    request({ url: "/user/profile", method: "PUT", data }),

  changePassword: (data) =>
    request({ url: "/user/change-password", method: "POST", data }),

  getDashboard: () =>
    request({ url: "/user/dashboard", method: "GET" }),

  rentNumber: (data) =>
    request({ url: "/user/rent-number", method: "POST", data }),

  getActivations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request({ url: `/user/activations${query ? "?" + query : ""}`, method: "GET" });
  },

  getActivation: (id) =>
    request({ url: `/user/activations/${id}`, method: "GET" }),

  cancelActivation: (id) =>
    request({ url: `/user/activations/${id}/cancel`, method: "POST" }),

  getBalance: () =>
    request({ url: "/user/balance", method: "GET" }),

  getTransactions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request({ url: `/user/transactions${query ? "?" + query : ""}`, method: "GET" });
  },
};
