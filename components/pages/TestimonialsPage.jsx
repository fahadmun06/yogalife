"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import TestimonialsForPage from "../TestimonialsForPage";

const TestimonialsPage = () => {
  return (
    <div>
      <section
        className="relative bg-no-repeat bg-right md:bg-center bg-cover min-h-[80vh] h-[70vh] flex items-center justify-center py-32"
        style={{
          backgroundImage: "url(/unnamed.jpg)",
        }}
      >
        {/* Soft overlay to ensure readability while keeping the image visible */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm md:backdrop-blur-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center md:-mt-10"
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-[#4A3B4C] mb-4 tracking-wide">
              Testimonials
            </h1>
            <p className="text-lg md:text-2xl font-playfair mb-8 max-w-2xl mx-auto text-[#6A5A6D]">
              Practice Whereever You Want Whenever You Need
            </p>
            <div className="flex justify-center items-center">
              <nav className="breadcrumb bg-[#A38B9B]/90 backdrop-blur-sm px-6 py-2 rounded-lg shadow-sm text-white font-medium tracking-wide">
                <Link
                  className="hover:text-gray-200 transition-colors"
                  href="/"
                >
                  Home
                </Link>
                <span className="mx-3 font-light">/</span>
                <Link
                  className="hover:text-gray-200 transition-colors"
                  href="/testimonials"
                >
                  Testimonials
                </Link>
              </nav>
            </div>
          </motion.div>
        </div>
      </section>
      <TestimonialsForPage />
    </div>
  );
};

export default TestimonialsPage;
