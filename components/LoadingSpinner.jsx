"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner({ 
  size = "large", 
  text = "Loading...", 
  showText = true 
}) {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8", 
    large: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
    xl: "text-xl"
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Animated Spinner */}
      <motion.div
        className={`${sizeClasses[size]} border-4 border-primary/20 border-t-primary/60 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Loading Text */}
      {showText && (
        <motion.div
          className={`${textSizeClasses[size]} text-primary font-medium`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {text}
        </motion.div>
      )}
    </div>
  );
}
