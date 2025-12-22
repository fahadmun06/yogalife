"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import BlogSection from "../Blog";

const BlogsPage = () => {
  return (
    <div>
      <section
        className="relative bg-cover no-repeat bg-center py-32"
        style={{
          backgroundImage: "url(/yoga/img1.jpg)",
        }}
      >
        <div className="absolute inset-0 bg-primary/70" />

        {/* Decorative flower top-left */}
        <motion.img
          alt="Design Element"
          className="absolute top-10 left-0 w-[200px] hidden md:block z-20"
          initial={{ opacity: 0, x: -50, y: -50, scale: 0.8 }}
          src="https://designingmedia.com/yogastic/wp-content/uploads/2022/07/hero-left-design-1.png"
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blogs</h1>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Practice Whereever You Want Whenever You Need
            </p>
            <div className="flex justify-center items-center">
              <nav className="breadcrumb bg-black/20 p-2 px-4 rounded-lg ">
                <Link className="text-white hover:text-yellow-300" href="/">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link
                  className="text-white hover:text-yellow-300"
                  href="/blogs"
                >
                  Blogs
                </Link>
              </nav>
            </div>
          </motion.div>
        </div>
      </section>
      <BlogSection />
    </div>
  );
};

export default BlogsPage;
