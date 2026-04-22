"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import Cookies from "js-cookie";
import { toast } from "sonner";

import {
  addNotification,
  incrementUnreadCount,
} from "@/store/slices/notificationSlice";
import { axiosInstance } from "@/components/api/axiosInstance";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const token = Cookies.get("accesstoken-tina-user");

  useEffect(() => {
    if (token && user?._id) {
      console.log(
        "🔌 [Socket] Initializing connection to:",
        axiosInstance.defaults.baseURL?.replace("/api/", ""),
      );

      const BASE_URL = axiosInstance.defaults.baseURL?.replace("/api/", "");

      const config = {
        path: "/ws",
        transports: ["websocket"],
        auth: { token }, // Authentication ke liye token
      };

      try {
        const newSocket = io(BASE_URL, config);

        newSocket.on("connect", () => {
          console.log("✅ [Socket] Connected:", newSocket.id);
          newSocket.emit("join", user._id);
          setSocket(newSocket);
        });

        newSocket.on("connect_error", (error) => {
          console.error("❌ [Socket] Connection Error:", error.message);
        });

        newSocket.on("disconnect", (reason) => {
          console.warn("⚠️ [Socket] Disconnected. Reason:", reason);
        });

        newSocket.on("new_notification", (notification) => {
          console.log("📩 [Socket] Received notification:", notification);
          dispatch(incrementUnreadCount());
          dispatch(addNotification(notification));

          // Play notification sound
          try {
            const audio = new Audio("/notification.mp3");
            audio
              .play()
              .catch((err) => console.log("Audio playback blocked", err));
          } catch (error) {
            console.error("Error playing audio", error);
          }

          toast[notification.type || "info"](notification.message, {
            duration: 5000,
            closeButton: true,
          });
        });

        socketRef.current = newSocket;

        return () => {
          console.log("🔌 [Socket] Disconnecting and cleaning up...");
          newSocket.off("new_notification");
          newSocket.disconnect();
          setSocket(null);
        };
      } catch (err) {
        console.error("❌ [Socket] Initialization failed:", err);
      }
    } else {
      if (!token)
        console.log(
          "⏳ [Socket] Connection pending: Token is missing from cookies",
        );
      if (!user?._id)
        console.log(
          "⏳ [Socket] Connection pending: userData._id is missing",
          user,
        );
    }
  }, [token, user?._id]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
