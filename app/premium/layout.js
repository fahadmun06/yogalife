import { Suspense } from "react";
import { Poppins } from "next/font/google";

import SimpleFooter from "@/components/dashboard/SimpleFooter";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Premium Hub",
  description: "Access your exclusive yoga workouts, nutrition guides, and health coaching sessions.",
};

export default function PremiumLayout({ children }) {
  return (
    <div className={`flex flex-col min-h-screen ${poppins.className}`}>
      <div className="flex-1">
        <Suspense
          fallback={
            <div className="min-h-[40vh] flex items-center justify-center bg-white text-slate-400 text-sm">
              Loading…
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
      <SimpleFooter />
    </div>
  );
}
