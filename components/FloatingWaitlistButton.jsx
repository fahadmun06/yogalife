"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";

export default function FloatingWaitlistButton() {
  const { user } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (!user) {
      router.push("/pricing");
    } else {
      // For logged in users, navigate to the specific waitlist page (if available) or wait for backend update.
      // Currently just alerting, but you can replace this with a proper route.
      alert("Waitlist form coming soon for logged in members!");
    }
  };

  return (
    <motion.button
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="fixed bottom-6 right-6 cursor-pointer z-50 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full shadow-lg font-playfair tracking-wide text-[15px] transition-all duration-300"
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      onClick={handleClick}
    >
      Join the waitlist for our next retreat
    </motion.button>
  );
}
