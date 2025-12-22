"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@heroui/toast";

import { UserProvider } from "@/context/UserContext";
import { LoadingProvider } from "@/context/LoadingContext";

export function Providers({ children, themeProps }) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <ToastProvider placement="top-center" />
      <NextThemesProvider {...themeProps}>
        <UserProvider>
          <LoadingProvider>
            {children}
          </LoadingProvider>
        </UserProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
