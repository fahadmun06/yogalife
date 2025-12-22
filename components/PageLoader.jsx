"use client";

import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";

export default function PageLoader({ 
  isVisible = true, 
  message = "Loading...",
  overlay = false 
}) {
  if (!isVisible) return null;

  const containerClasses = overlay 
    ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-40 flex items-center justify-center"
    : "flex items-center justify-center py-12";

  return (
    <motion.div
      className={containerClasses}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <LoadingSpinner size="large" text={message} />
      </div>
    </motion.div>
  );
}
