"use client";

import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";

import { store, persistor } from "../store/store";
import { SocketProvider } from "../context/SocketProvider";
import useFcmToken from "../hooks/useFcmToken";

function FcmWrapper({ children }) {
  useFcmToken();
  return <>{children}</>;
}

export function Providers({ children, themeProps }) {
  const router = useRouter();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HeroUIProvider navigate={router.push}>
          <Toaster richColors position="top-center" />
          <NextThemesProvider {...themeProps}>
            <SocketProvider>
              <FcmWrapper>{children}</FcmWrapper>
            </SocketProvider>
          </NextThemesProvider>
        </HeroUIProvider>
      </PersistGate>
    </Provider>
  );
}
