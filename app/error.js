"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error
    console.error(error);
  }, [error]);

  return (
    <section className="flex flex-col items-center justify-center h-screen bg-lavender-light text-center px-6">
      {/* Icon with animation */}
      <motion.div
        animate={{ scale: 1, rotate: 0 }}
        className="mb-6"
        initial={{ scale: 0, rotate: -90 }}
        transition={{ duration: 0.6 }}
      >
        <AlertTriangle className="w-16 h-16 text-purple-700" />
      </motion.div>

      {/* Heading */}
      <motion.h2
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-purple-950 mb-4"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
      >
        Oops! Something went wrong 😔
      </motion.h2>

      {/* Message */}
      <p className="text-purple-800 mb-8 max-w-lg">
        Don’t worry, it happens sometimes. Please try again or refresh the page.
      </p>

      {/* Retry Button */}
      <motion.button
        className="bg-purple-700 rounded-tl-3xl rounded-br-3xl hover:bg-purple-900 text-white px-8 py-3 shadow-lg transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => reset()}
      >
        Try Again
      </motion.button>
    </section>
  );
}
