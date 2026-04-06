"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Skeleton } from "@heroui/skeleton";

import { useGeneral } from "@/hooks/useGeneral";

const PageHero = ({ subtitle, title, breadcrumb = [] }) => {
  const { globalHeroImage, globalHeroPosition, globalHeroTextColor } = useGeneral();

  return (
    <section
      className="relative bg-no-repeat bg-cover min-h-[50vh] h-[60vh] flex items-center justify-center py-20 overflow-hidden"
      style={{
        backgroundImage: globalHeroImage ? `url(${globalHeroImage})` : "none",
        backgroundPosition: globalHeroPosition || "center",
      }}
    >
      {!globalHeroImage && (
        <div className="absolute inset-0 z-0">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
      )}

      {/* Soft glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] md:backdrop-blur-none" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1
            className="text-5xl md:text-7xl font-playfair font-bold mb-2 tracking-tight"
            style={{ color: globalHeroTextColor || "#4A3B4C" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="text-lg md:text-2xl font-playfair max-w-2xl mx-auto mb-8 font-medium"
              style={{ color: globalHeroTextColor || "#6A5A6D", opacity: 0.8 }}
            >
              {subtitle}
            </p>
          )}

          <div className="flex justify-center items-center mt-10">
            <nav className="breadcrumb bg-[#A38B9B]/70 backdrop-blur-lg px-8 py-3 rounded-full shadow-2xl text-white font-semibold flex items-center gap-3 border border-white/20">
              <Link
                href="/"
                className="hover:text-amber-200 transition-colors uppercase text-xs tracking-widest"
              >
                Home
              </Link>
              {breadcrumb.map((item, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-white/40 text-xs mt-0.5">•</span>
                  <Link
                    href={item.link}
                    className="hover:text-amber-200 transition-colors uppercase text-xs tracking-widest"
                  >
                    {item.label}
                  </Link>
                </React.Fragment>
              ))}
            </nav>
          </div>
        </motion.div>
      </div>

      {/* Subtle organic movement overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "mirror",
        }}
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 80%)",
          backgroundSize: "200% 200%",
        }}
      />
    </section>
  );
};

export default PageHero;
