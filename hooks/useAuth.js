"use client";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Cookies from "js-cookie";

import {
  setCredentials,
  logout as logoutAction,
} from "../store/slices/authSlice";
import ApiFunction from "../components/api/apiFuntions";
import { authApi } from "../components/api/ApiRoutesFile";
import { encryptData, decryptData } from "../components/api/encrypted";
import { axiosInstance } from "../components/api/axiosInstance";
import { updateUser as updateUserAction } from "../store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const { post, put, get } = ApiFunction();

  const getMinimalUser = (user) => {
    if (!user) return null;

    const minimalUser = { ...user };

    delete minimalUser.fcmTokens;
    delete minimalUser.recentPlans;
    delete minimalUser.password;

    return minimalUser;
  };

  const login = async (credentials) => {
    try {
      const response = await post(authApi.login, credentials);

      if (response.success) {
        const {
          user: userResponse,
          token: tokenResponse,
          refreshToken,
        } = response.data;

        const now = new Date();
        const lastLoginTime = now.toTimeString().split(" ")[0];
        const userWithTime = { ...userResponse, lastLoginTime };

        console.log(userWithTime);

        Cookies.set("accesstoken-tina-user", encryptData(tokenResponse), {
          expires: 7,
          path: "/",
        });
        Cookies.set("refreshtoken-tina-user", encryptData(refreshToken), {
          expires: 7,
          path: "/",
        });
        Cookies.set(
          "userdata-tina-user",
          encryptData(getMinimalUser(userWithTime)),
          {
            expires: 7,
            path: "/",
          },
        );
        Cookies.set(
          "userstatus-tina-user",
          userWithTime.subscriptionStatus || "free",
          { expires: 7, path: "/" },
        );

        dispatch(
          setCredentials({
            user: userWithTime,
            token: tokenResponse,
          }),
        );

        toast.success("Login successful");

        return response;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const refreshSession = async () => {
    const refreshTokenCookie = Cookies.get("refreshtoken-tina-user");

    if (!refreshTokenCookie) return;

    try {
      const decryptedRefreshToken = decryptData(refreshTokenCookie);

      if (decryptedRefreshToken) {
        const response = await axiosInstance.post(authApi.refreshToken, {
          refreshToken: decryptedRefreshToken,
        });

        if (response?.data?.success) {
          const {
            token: newToken,
            refreshToken: newRefreshToken,
            user: updatedUser,
          } = response.data.data;

          Cookies.set("accesstoken-tina-user", encryptData(newToken), {
            expires: 7,
            path: "/",
          });
          Cookies.set("refreshtoken-tina-user", encryptData(newRefreshToken), {
            expires: 7,
            path: "/",
          });

          const now = new Date();
          const lastLoginTime = now.toTimeString().split(" ")[0];
          const userWithTime = { ...updatedUser, lastLoginTime };

          Cookies.set(
            "userdata-tina-user",
            encryptData(getMinimalUser(userWithTime)),
            {
              expires: 7,
              path: "/",
            },
          );
          Cookies.set(
            "userstatus-tina-user",
            userWithTime.subscriptionStatus || "free",
            { expires: 7, path: "/" },
          );

          dispatch(
            setCredentials({
              user: userWithTime,
              token: newToken,
            }),
          );

          console.log("Token auto-refreshed successfully");
        }
      }
    } catch (error) {
      console.error("Auto-refresh failed", error);
    }
  };

  const register = async (userDataInput) => {
    try {
      const response = await post(authApi.register, userDataInput);

      if (response.success) {
        toast.success("Registration successful! Please verify your email.");

        return response;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      throw err;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    Cookies.remove("accesstoken-tina-user");
    Cookies.remove("refreshtoken-tina-user");
    Cookies.remove("userdata-tina-user");
    Cookies.remove("userstatus-tina-user");
    toast.success("Logged out successfully");
    window.location.href = "/auth/login";
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };

    Cookies.set("userdata-tina-user", encryptData(getMinimalUser(newUser)), {
      expires: 7,
      path: "/",
    });
    Cookies.set("userstatus-tina-user", newUser.subscriptionStatus || "free", {
      expires: 7,
      path: "/",
    });
    dispatch(updateUserAction(updatedData));
  };

  const verifyEmail = async (email, code) => {
    try {
      const response = await post(authApi.verify, { email, code });

      if (response.success) {
        toast.success("Email verified successfully");

        return response;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
      throw err;
    }
  };

  const resendVerificationCode = async (email) => {
    try {
      const response = await post(authApi.resendCode, { email });

      if (response.success) {
        toast.success("Verification code resent");

        return response;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend code");
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await post(authApi.forgotPassword, { email });

      if (response.success) {
        toast.success("Reset code sent to your email");

        return response;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset code");
      throw err;
    }
  };

  const forgetVerify = async (email, code) => {
    try {
      const response = await post(authApi.forgetVerify, { email, code });

      if (response.success) {
        toast.success("OTP verified successfully");

        return response;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
      throw err;
    }
  };

  const resetPassword = async (data) => {
    try {
      const response = await post(authApi.resetPassword, data);

      if (response.success) {
        toast.success("Password reset successful");

        return response;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
      throw err;
    }
  };

  const updatePassword = async (data) => {
    try {
      const response = await put(authApi.updatePassword, data);

      if (response.success) {
        toast.success("Password updated successfully");

        return response;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
      throw err;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await get(authApi.me);

      if (response?.success) {
        const updatedUser = response.data.user;
        const now = new Date();
        const lastLoginTime = now.toTimeString().split(" ")[0];
        const userWithTime = { ...updatedUser, lastLoginTime };

        Cookies.set(
          "userdata-tina-user",
          encryptData(getMinimalUser(userWithTime)),
          {
            expires: 7,
            path: "/",
          },
        );
        Cookies.set(
          "userstatus-tina-user",
          userWithTime.subscriptionStatus || "free",
          { expires: 7, path: "/" },
        );

        dispatch(
          setCredentials({
            user: userWithTime,
            token: token, // Use current token
          }),
        );
      }
    } catch (error) {
      console.error("Failed to refresh user data", error);
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    refreshSession,
    verifyEmail,
    resendVerificationCode,
    forgotPassword,
    forgetVerify,
    resetPassword,
    updatePassword,
    updateUser,
    refreshUser,
  };
};
