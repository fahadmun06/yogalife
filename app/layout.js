import "@/styles/globals.css";
import "@/styles/main.css";
import clsx from "clsx";
import { Playfair_Display, Poppins } from "next/font/google";
import DebugFirebase from "../components/DebugFirebase";
import AppLoader from "../components/AppLoader";

import { Providers } from "./providers";
import MainLayout from "./mainLayout";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-poppins",
});

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      suppressHydrationWarning
      className={`${playfair.variable} ${poppins.variable}`}
      lang="en"
    >
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-playfair  antialiased"
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <MainLayout>{children}</MainLayout>
          {/* <DebugFirebase /> */}
        </Providers>
      </body>
    </html>
  );
}
