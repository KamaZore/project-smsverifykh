import { request } from "../util/request";

export const servicesApi = {
  getServicesList: () =>
    request({ url: "/v1/getServicesList", method: "GET" }),

  getCountries: () =>
    request({ url: "/v1/getCountries", method: "GET" }),

  getPrices: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request({ url: `/v1/getPrices${query ? "?" + query : ""}`, method: "GET" });
  },

  getOffers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request({ url: `/v3/getOffers${query ? "?" + query : ""}`, method: "GET" });
  },

  getBalance: () =>
    request({ url: "/v1/getBalance", method: "GET" }),
};
