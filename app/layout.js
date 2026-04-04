import "@/styles/globals.css";
import "@/styles/main.css";
import clsx from "clsx";
import { Playfair_Display, Poppins, Alex_Brush } from "next/font/google";

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
const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-alex-brush",
});

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata = {
  title: {
    default: "Tinashaii | Yoga & Wellness",
    template: "%s | Tinashaii",
  },
  description: "Take your yoga and wellness journey to the next level with Tinashaii. Premium workouts, nutrition plans, and holistic coaching.",
  metadataBase: new URL("https://tinashaii.com"),
  alternates: {
    canonical: "/",
  },
  keywords: ["Yoga", "Wellness", "Pilates", "Strength", "Nutrition", "Holistic Coaching", "Tinashaii"],
  openGraph: {
    title: "Tinashaii | Yoga & Wellness",
    description: "Premium yoga and wellness platform.",
    url: "https://tinashaii.com",
    siteName: "Tinashaii",
    images: [
      {
        url: "/apple-icon.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tinashaii | Yoga & Wellness",
    description: "Premium yoga and wellness platform.",
    images: ["/apple-icon.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      suppressHydrationWarning
      className={`${playfair.variable} ${poppins.variable} ${alexBrush.variable}`}
      lang="en"
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="Tinashaii" />
      </head>
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-playfair  antialiased",
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
