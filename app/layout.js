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
    default: "Tina Shay | The Butterfly Sanctuary Holistic Health Platform",
    template: "%s | Tina Shay",
  },
  description: "Pilates, strength training, and holistic all-in-one sanctuary.",
  metadataBase: new URL("https://www.butterflysanctuaryja.com"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Tina Shay",
    "The Butterfly Sanctuary",
    "Holistic Health",
    "Pilates",
    "Strength Training",
    "Wellness",
    "Sanctuary",
  ],
  openGraph: {
    title: "Tina Shay | The Butterfly Sanctuary Holistic Health Platform",
    description:
      "Pilates, strength training, and holistic all-in-one sanctuary.",
    url: "https://www.butterflysanctuaryja.com",
    siteName: "Tina Shay",
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
    title: "Tina Shay | The Butterfly Sanctuary Holistic Health Platform",
    description:
      "Pilates, strength training, and holistic all-in-one sanctuary.",
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
