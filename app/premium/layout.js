import SimpleFooter from "@/components/dashboard/SimpleFooter";

import { Poppins } from "next/font/google";

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
      <div className="flex-1">{children}</div>
      <SimpleFooter />
    </div>
  );
}
