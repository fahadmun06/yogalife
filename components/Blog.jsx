/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { useLandingPage } from "../hooks/useLandingPage";

export default function BlogSection() {
  const { getBlogs } = useLandingPage();
  const [blogs, setBlogs] = useState([]);
  const [settings, setSettings] = useState({
    tagline: "BLOG POSTS",
    title: "Sanctuary News Feed",
    description: "Welcome to our Sanctuary News Feed...",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      const data = await getBlogs();

      if (data) {
        if (data.blogs) setBlogs(data.blogs);
        if (data.settings) setSettings(data.settings);
      }
      setLoading(false);
    };

    loadBlogs();
  }, []);

  return (
    <section className="relative py-20 bg-white font-poppins" id="blog_post">
      {/* Decorative BG image
      <img
        alt="decor"
        className="absolute top-10 right-0 w-40 md:w-60 opacity-70"
        src="https://designingmedia.com/yogastic/wp-content/uploads/2022/07/our-specialities-design-element-1.png"
      /> */}
      <div className="container mx-auto text-center relative z-10 px-4">
        {/* Section Heading */}
        <motion.h4
          className="text-primary font-black text-xs tracking-[0.2em] uppercase"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {settings.tagline}
        </motion.h4>

        <motion.h2
          className="text-4xl md:text-5xl font-playfair text-black font-black mt-3"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {settings.title}
        </motion.h2>

        <motion.p
          className="text-gray-500 max-w-2xl mx-auto mt-6 text-sm md:text-base leading-relaxed whitespace-pre-wrap"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          {settings.description}
        </motion.p>

        {/* Blog Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            [1, 2].map((i) => (
              <div
                key={i}
                className="relative h-80 rounded-2xl bg-gray-200 animate-pulse overflow-hidden shadow-lg"
              >
                <div className="absolute inset-x-6 bottom-6 space-y-3">
                  <div className="h-4 w-24 bg-gray-300 rounded" />
                  <div className="h-6 w-3/4 bg-gray-300 rounded" />
                </div>
              </div>
            ))
          ) : blogs.length > 0 ? (
            blogs.map((blog, i) => (
              <motion.div
                key={blog._id}
                className="relative group overflow-hidden rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <img
                  alt={blog.title}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                  src={blog.img}
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-left">
                  <span className="text-sm text-white/80">{blog.category}</span>
                  <h4 className="text-lg md:text-xl font-bold text-white mt-2">
                    {blog.title}
                  </h4>

                  <div className="mt-4">
                    <Link
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-primary shadow-md transition-all group-hover:bg-primary group-hover:text-white"
                      href={blog.link || "#"}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 py-10 text-gray-400 italic">
              No news updates at the moment. Stay tuned!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
