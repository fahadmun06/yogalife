"use client";
import React from "react";
import { usePathname } from "next/navigation";

import YogasticFooter from "@/components/NewSimpleUI/YogasticFooter";
import Navbar from "@/components/Navbar";
import AppLoader from "@/components/AppLoader";
import { useLoading } from "@/context/LoadingContext";
import { useUser } from "@/context/UserContext";

export default function MainLayout({ children }) {
  const restrictRoute = ["/auth/login", "/auth/signup", "/cancel", "/success"];
  const pathname = usePathname();
  const { isLoading, loadingMessage } = useLoading();
  const { user } = useUser();

  return (
    <>
      {/* Loading Screen */}
      <AppLoader 
        isVisible={isLoading} 
        message={loadingMessage}
        showUserStatus={true}
        user={user}
      />
      
      {/* Main App */}
      <div className="relative flex flex-col h-screen">
        {restrictRoute.includes(pathname) ? null : <Navbar />}
        <main className="mx-auto w-full text-black flex-grow">{children}</main>
        {restrictRoute.includes(pathname) ? null : <YogasticFooter />}
      </div>
    </>
  );
}
