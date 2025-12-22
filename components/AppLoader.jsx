"use client";

import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import Image from "next/image";

export default function AppLoader({
  isVisible = true,
  message = "Loading Tinashaii...",
  showUserStatus = false,
  user = null,
}) {
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        {/* Logo/Brand */}
        <motion.div
          className="mb-8 flex flex-col items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Image src="/logo.jpg"   className="rounded-full mb-2" alt="Tinashaii" width={70} height={70} />
          <h1 className="text-2xl font-bold text-primary">Tinashaii</h1>
          <p className="text-primary/80 text-sm">Yoga & Wellness</p>
        </motion.div>

        {/* Loading Spinner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <LoadingSpinner size="large" text={message} />
        </motion.div>

        {/* User Status */}
        {showUserStatus && (
          <motion.div
            className="mt-8 p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg max-w-sm mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            {user ? (
              <div className="text-green-700">
                <div className="flex items-center justify-center mb-2">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    Welcome back, {user.name || user.email}!
                  </span>
                </div>
                <p className="text-sm text-green-600">
                  {user.packageDetails ? "Premium member" : "Free member"}
                </p>
              </div>
            ) : (
              <div className="text-primary/80">
                <div className="flex items-center justify-center mb-2">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Guest user</span>
                </div>
                <p className="text-sm text-primary/60">
                  Sign in to access premium features
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Loading Dots Animation */}
        <motion.div
          className="flex justify-center space-x-1 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary/80 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
