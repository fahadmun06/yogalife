"use client";

import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner";
import Image from "next/image";

export default function AppLoader({
  isVisible = true,
  message = "Loading Butterfly Sanctuary...",
  showUserStatus = false,
  user = null,
}) {
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-[#F4EDF5] z-50 flex items-center justify-center font-sans tracking-wide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center w-full max-w-sm px-6 relative">
        {/* Subtle decorative elements mimicking the main design */}
        <div className="absolute top-0 right-10 w-2 h-2 bg-[#d1c2d3] rounded-full opacity-60"></div>
        <div className="absolute top-10 -left-4 w-1.5 h-1.5 bg-[#4a3b4c] rounded-full opacity-40"></div>

        {/* Logo/Brand */}
        <motion.div
          className="mb-8 flex flex-col items-center justify-center p-6 rounded-[32px] bg-[#F4EDF5] shadow-[8px_8px_16px_#d9cddc,-8px_-8px_16px_#ffffff]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="rounded-full shadow-[inset_3px_3px_6px_#d9cddc,inset_-3px_-3px_6px_#ffffff] p-2 mb-4">
            <Image src="/logo.jpg" className="rounded-full" alt="Butterfly Sanctuary" width={60} height={60} />
          </div>
          <h1 className="text-2xl font-bold text-[#4A3B4C] font-playfair tracking-wider">Butterfly Sanctuary</h1>
          <p className="text-[#4A3B4C]/70 text-xs font-medium uppercase tracking-[0.2em] mt-1">Holistic Health</p>
        </motion.div>

        {/* Loading Spinner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-8 text-[#4A3B4C]"
        >
          <LoadingSpinner size="large" text={message} />
        </motion.div>

        {/* User Status */}
        {showUserStatus && (
          <motion.div
            className="mt-8 p-5 bg-[#F4EDF5] rounded-[24px] shadow-[8px_8px_16px_#d9cddc,-8px_-8px_16px_#ffffff] border-[1.5px] border-[#d1c2d3]/30 mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            {user ? (
              <div className="text-[#4A3B4C]">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#E5D7E6] flex items-center justify-center mr-2 shadow-[inset_1px_1px_3px_#d1c2d3,inset_-1px_-1px_3px_#ffffff]">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-semibold text-[15px]">
                    Welcome back, {user.name || user.email}!
                  </span>
                </div>
                <div className="inline-block mt-1 bg-[#ebddeb] shadow-[inset_2px_2px_4px_#d1c2d3,inset_-2px_-2px_4px_#ffffff] text-[#4A3B4C] text-[11px] font-bold tracking-widest py-1 px-4 rounded-full uppercase">
                  {user.packageDetails ? "Premium member" : "Free member"}
                </div>
              </div>
            ) : (
              <div className="text-[#4A3B4C]/80">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#E5D7E6] flex items-center justify-center mr-2 shadow-[inset_1px_1px_3px_#d1c2d3,inset_-1px_-1px_3px_#ffffff]">
                    <svg
                      className="w-3.5 h-3.5 text-[#4A3B4C]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="font-semibold text-[15px]">Guest user</span>
                </div>
                <p className="text-[12px] text-[#4A3B4C]/70 font-medium">
                  Sign in to access premium features
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Loading Dots Animation */}
        <motion.div
          className="flex justify-center items-center space-x-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-[#4A3B4C] rounded-full shadow-[1px_1px_2px_#d1c2d3,-1px_-1px_2px_#ffffff]"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4],
                y: [0, -3, 0]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
