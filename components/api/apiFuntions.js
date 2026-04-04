"use client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useSelector } from "react-redux";

import { decryptData } from "./encrypted";
import { axiosInstance } from "./axiosInstance";

const ApiFunction = () => {
  const router = useRouter();
  const { user: reduxUser } = useSelector((state) => state.auth);

  const handleUserLogout = () => {
    Cookies.remove("accesstoken-tina-user");
    Cookies.remove("refreshtoken-tina-user");
    Cookies.remove("userdata-tina-user");
    localStorage.clear();
    toast.error("Your session has expired. Please login again.");
    router.push("/auth/login");
  };

  const getToken = () => {
    const token = Cookies.get("accesstoken-tina-user");

    return token ? decryptData(token) : null;
  };

  const getHeaders = (isMultipart = false) => {
    return {
      "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
    };
  };

  const get = async (endpoint) => {
    const apiResponse = axiosInstance
      .get(endpoint, { headers: getHeaders() })
      .then((response) => response?.data)
      .catch((error) => {
        console.error("Error in GET request:", error);
        if (error?.response?.status === 401) {
          handleUserLogout();
        }
        throw error;
      });

    return apiResponse;
  };

  const post = async (endpoint, apiData, isMultipart = false) => {
    const apiResponse = axiosInstance
      .post(endpoint, apiData, { headers: getHeaders(isMultipart) })
      .then((response) => response?.data)
      .catch((error) => {
        console.error("Error in POST request:", error);
        if (error?.response?.status === 401) {
          handleUserLogout();
        }
        throw error;
      });

    return apiResponse;
  };

  const put = async (endpoint, apiData, isMultipart = false) => {
    const apiResponse = axiosInstance
      .put(endpoint, apiData, { headers: getHeaders(isMultipart) })
      .then((response) => response?.data)
      .catch((error) => {
        console.error("Error in PUT request:", error);
        if (error?.response?.status === 401) {
          handleUserLogout();
        }
        throw error;
      });

    return apiResponse;
  };

  const deleteData = async (endpoint) => {
    const apiResponse = axiosInstance
      .delete(endpoint, { headers: getHeaders() })
      .then((response) => response?.data)
      .catch((error) => {
        console.error("Error in DELETE request:", error);
        if (error?.response?.status === 401) {
          handleUserLogout();
        }
        throw error;
      });

    return apiResponse;
  };

  const getUserData = () => {
    if (reduxUser) return reduxUser;
    const userData = Cookies.get("userdata-tina-user");

    return userData ? decryptData(userData) : null;
  };

  return {
    get,
    post,
    put,
    deleteData,
    token: getToken(),
    userData: getUserData(),
    handleUserLogout,
  };
};

export default ApiFunction;
