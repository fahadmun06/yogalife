"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";

const LoadingContext = createContext({
  isLoading: true,
  setLoading: () => {},
  loadingMessage: "Loading...",
  setLoadingMessage: () => {},
});

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading Tinashaii...");
  const { user, loading: userLoading } = useUser();

  useEffect(() => {
    // Show loading for at least 2 seconds for better UX
    const minLoadingTime = setTimeout(() => {
      if (!userLoading) {
        setIsLoading(false);
      }
    }, 2000);

    // Also stop loading when user data is loaded
    if (!userLoading) {
      const userLoadedTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      return () => {
        clearTimeout(minLoadingTime);
        clearTimeout(userLoadedTimeout);
      };
    }

    return () => clearTimeout(minLoadingTime);
  }, [userLoading]);

  // Update loading message based on user status
  useEffect(() => {
    if (userLoading) {
      setLoadingMessage("Loading Tinashaii...");
    } else if (user) {
      setLoadingMessage(`Welcome back, ${user.name || user.email}!`);
    } else {
      setLoadingMessage("Ready to start your journey...");
    }
  }, [userLoading, user]);

  const value = {
    isLoading,
    setLoading: setIsLoading,
    loadingMessage,
    setLoadingMessage,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
