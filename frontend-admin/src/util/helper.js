import axios from "axios";
import { config } from "./config";
import { getAccessToken } from "../store/token_access";
const request = async (url = "", method = "", data = {}) => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  var headers = { "Content-Type": "application/json" };
  if (data instanceof FormData) {
    headers = {};
  }
  return axios({
    url: config.BASE_URL + url,
    method: method,
    data: data,
    headers: {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
export default request;
