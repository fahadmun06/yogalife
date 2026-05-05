"use client";
import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";

import YogasticFooter from "@/components/NewSimpleUI/YogasticFooter";
import Navbar from "@/components/Navbar";
import AppLoader from "@/components/AppLoader";
import FloatingWaitlistButton from "@/components/FloatingWaitlistButton";
import { useAuth } from "@/hooks/useAuth";
import { useGeneral } from "@/hooks/useGeneral";
import ApiFunction from "@/components/api/apiFuntions";

export default function MainLayout({ children }) {
  const restrictRoute = [
    "/auth/change-password",
    "/auth/forgot-password",
    "/auth/login",
    "/auth/reset-password",
    "/auth/signup",
    "/auth/verify",
    "/cancel",
    "/success",
  ];
  const { user, refreshSession } = useAuth();
  const {
    isLoading,
    loadingMessage,
    setAppLoading,
    globalHeroImage,
    setGlobalHero,
  } = useGeneral();
  const { get } = ApiFunction();
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  useEffect(() => {
    refreshSession();
  }, []);

  // Fetch global hero image if not exists
  useEffect(() => {
    const fetchGlobalBanner = async () => {
      if (!globalHeroImage) {
        try {
          const res = await get("/banner?type=all_pages");

          if (res?.success && res?.data) {
            setGlobalHero(res.data);
          }
        } catch {
          // Catch and handle error silently
        }
      }
    };

    fetchGlobalBanner();
  }, [globalHeroImage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AppLoader
        isVisible={isLoading}
        message={loadingMessage}
        showUserStatus={true}
        user={user}
      />
      <div className="relative text-black">
        {isDashboard || restrictRoute.includes(pathname) ? null : (
          <Suspense fallback={<div aria-hidden className="h-16 w-full shrink-0" />}>
            <Navbar />
          </Suspense>
        )}
        <main>{children}</main>
        {isDashboard ||
        pathname.startsWith("/premium") ||
        restrictRoute.includes(pathname) ||
        !!user ? null : (
          <YogasticFooter />
        )}
        {!isDashboard &&
          !pathname.startsWith("/premium") &&
          !pathname.startsWith("/auth") &&
          !user &&
          !restrictRoute.includes(pathname) && <FloatingWaitlistButton />}
      </div>
    </>
  );
}
