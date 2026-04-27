import axios from "axios";
import Cookies from "js-cookie";

import { decryptData } from "./encrypted";

export const axiosInstance = axios.create({
  baseURL: "https://tina-backend-production-f218.up.railway.app/api/",
  // baseURL: "http://localhost:9000/api/",
});

axiosInstance.interceptors.request.use(
  (config) => {
    let token;
    const cookieToken = Cookies.get("accesstoken-tina-user");

    if (cookieToken) {
      token = decryptData(cookieToken);
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);
