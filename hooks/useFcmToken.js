"use client";
import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { toast } from "sonner";

import { messaging } from "../config/firebase";
import ApiFunction from "../components/api/apiFuntions";
import { axiosInstance } from "../components/api/axiosInstance";

const useFcmToken = () => {
  const [token, setToken] = useState(null);
  const { token: authToken } = ApiFunction();
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState("");

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
          // Check if messaging is initialized
          if (!messaging) {
            console.log(
              "Messaging not available (likely not supported or project config missing)",
            );

            return;
          }

          // Request permission
          const permission = await Notification.requestPermission();

          setNotificationPermissionStatus(permission);

          if (permission === "granted") {
            // Get Token
            const currentToken = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            });

            if (currentToken) {
              setToken(currentToken);
              console.log("✅ FCM Token Generated");

              // Send token to backend
              try {
                if (!authToken) {
                  console.log(
                    "⚠️ No auth token found, skipping FCM token update",
                  );

                  return;
                }

                // Updated to use frontend's update-profile endpoint logic
                const response = await axiosInstance.put(
                  "auth/update-profile",
                  {
                    fcmToken: currentToken,
                  },
                );

                if (response.status === 200) {
                  console.log("✅ FCM Token sent to backend successfully");
                }
              } catch (apiError) {
                console.error(
                  "❌ Error sending FCM token to backend:",
                  apiError,
                );
              }
            } else {
              console.log("⚠️ No registration token available.");
            }
          }
        }
      } catch (error) {
        console.error(
          "❌ An error occurred while retrieving FCM token:",
          error,
        );
      }
    };

    if (authToken) {
      retrieveToken();
    }
  }, [authToken]);

  // Listen for foreground messages
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      messaging
    ) {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("📬 FOREGROUND NOTIFICATION RECEIVED 📬");
        console.log("Title:", payload.notification?.title);

        toast.success(payload.notification?.title || "New Notification", {
          description: payload.notification?.body,
        });
      });

      return () => unsubscribe();
    }
  }, [token]);

  return { token, notificationPermissionStatus };
};

export default useFcmToken;
