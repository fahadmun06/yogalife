"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { auth, db } from "@/config/firebase";
import { updateSubscriptionStatus } from "@/utils/subscriptionUtils";
import { createFirebaseTimeout } from "@/utils/firebaseUtils";

const UserContext = createContext({
  user: null,
  loading: true,
  logout: async () => {},
  refreshUser: async () => {},
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user in cookies on initial load
  useEffect(() => {
    const checkExistingUser = () => {
      try {
        const cookieUser = Cookies.get("tinashaii_user");

        if (cookieUser) {
          const parsedUser = JSON.parse(cookieUser);

          console.log("Found user in cookie:", parsedUser);

          // Check for pending package details
          const pendingPackageDetails = localStorage.getItem(
            "pendingPackageDetails",
          );

          if (pendingPackageDetails && !parsedUser.packageDetails) {
            try {
              const packageDetails = JSON.parse(pendingPackageDetails);

              console.log(
                "Found pending package details for logged-in user:",
                packageDetails,
              );

              // Update user with package details
              parsedUser.packageDetails = packageDetails;
              parsedUser.isPremium = true;

              // Update cookie
              Cookies.set("tinashaii_user", JSON.stringify(parsedUser), {
                expires: 7,
              });

              // Clear pending package details
              localStorage.removeItem("pendingPackageDetails");
              console.log("Pending package details applied to logged-in user");
            } catch (error) {
              console.error("Error processing pending package details:", error);
            }
          }

          setUser(parsedUser);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error parsing user cookie:", error);
        Cookies.remove("tinashaii_user");
      }
    };

    checkExistingUser();
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          console.log(
            "Firebase auth state changed - user logged in:",
            fbUser.uid,
          );

          let profile = {};

          try {
            console.log("Attempting to fetch user profile from Firestore...");
            console.log("Firebase app:", db.app.name);
            console.log("User ID:", fbUser.uid);

            const userRef = doc(db, "users", fbUser.uid);

            // Add timeout to prevent hanging
            const profilePromise = getDoc(userRef);
            const timeoutPromise = createFirebaseTimeout(8000);

            const snap = await Promise.race([profilePromise, timeoutPromise]);

            profile = snap.exists() ? snap.data() : {};
            console.log("Firestore profile fetched successfully:", profile);
          } catch (firestoreError) {
            console.error("Firestore error in UserContext:", firestoreError);
            console.log("Error details:", {
              message: firestoreError.message,
              code: firestoreError.code,
              name: firestoreError.name,
            });
            console.log("Falling back to cookie data due to Firestore error");
            // Use cookie data if Firestore fails
            const cookieUser = Cookies.get("tinashaii_user");

            if (cookieUser) {
              const parsedUser = JSON.parse(cookieUser);

              profile = {
                name: parsedUser.name,
                status: parsedUser.status,
                isVerified: parsedUser.isVerified,
                packageDetails: parsedUser.packageDetails,
              };
            }
          }

          const normalized = {
            uid: fbUser.uid,
            name: profile?.name || fbUser.displayName || "",
            email: fbUser.email || "",
            status: profile?.status || "active",
            isVerified: fbUser.emailVerified || profile?.isVerified || false,
            packageDetails: profile?.packageDetails || null,
          };

          // Update subscription status if package details exist
          if (normalized.packageDetails) {
            const updatedPackageDetails = await updateSubscriptionStatus(
              normalized,
              normalized.packageDetails,
            );

            if (updatedPackageDetails) {
              normalized.packageDetails = updatedPackageDetails;

              // Update Firestore with new status (if online)
              if (navigator.onLine) {
                try {
                  const userRef = doc(db, "users", fbUser.uid);

                  await updateDoc(userRef, {
                    packageDetails: updatedPackageDetails,
                    lastUpdated: new Date().toISOString(),
                  });
                  console.log("Subscription status updated in Firestore");
                } catch (error) {
                  console.error("Error updating subscription status:", error);
                }
              }
            }
          }

          // Check for pending package details from successful payment
          const pendingPackageDetails = localStorage.getItem(
            "pendingPackageDetails",
          );

          if (pendingPackageDetails && !normalized.packageDetails) {
            try {
              const packageDetails = JSON.parse(pendingPackageDetails);

              console.log("Found pending package details:", packageDetails);

              // Update user with package details
              normalized.packageDetails = packageDetails;
              normalized.isPremium = true;

              // Save to Firestore
              if (navigator.onLine) {
                try {
                  const userRef = doc(db, "users", fbUser.uid);

                  await updateDoc(userRef, {
                    packageDetails: packageDetails,
                    isPremium: true,
                    lastUpdated: new Date().toISOString(),
                  });
                  console.log("Pending package details saved to Firestore");
                } catch (error) {
                  console.error("Error saving pending package details:", error);
                }
              }

              // Clear pending package details
              localStorage.removeItem("pendingPackageDetails");
              console.log("Pending package details processed and cleared");
            } catch (error) {
              console.error("Error processing pending package details:", error);
            }
          }

          console.log("Setting user from Firebase auth:", normalized);
          setUser(normalized);
          Cookies.set("tinashaii_user", JSON.stringify(normalized), {
            expires: 7,
          });
        } else {
          console.log("Firebase auth state changed - user logged out");
          setUser(null);
          Cookies.remove("tinashaii_user");
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  console.log("UserContext - Current user:", user);

  const refreshUser = async () => {
    console.log("Refreshing user data...");
    const cookieUser = Cookies.get("tinashaii_user");
    
    if (cookieUser) {
      try {
        const parsedUser = JSON.parse(cookieUser);
        console.log("Refreshed user from cookie:", parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error refreshing user:", error);
      }
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      logout: async () => {
        console.log("Logging out user...");
        await signOut(auth);
        setUser(null);
        Cookies.remove("tinashaii_user");
      },
      refreshUser,
    }),
    [user, loading],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
