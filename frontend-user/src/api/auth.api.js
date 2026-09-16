import { request } from "../util/request";

export const authApi = {
  register: (data) =>
    request({ url: "/auth/register", method: "POST", data }),

  login: (data) =>
    request({ url: "/auth/login", method: "POST", data }),

  refresh: (data) =>
    request({ url: "/auth/refresh", method: "POST", data }),

  me: () =>
    request({ url: "/auth/me", method: "GET" }),
};
