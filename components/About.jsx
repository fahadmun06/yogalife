"use client";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section
      className="py-20 px-6 
      bg-gradient-to-r from-purple-100 via-pink-50 to-purple-200 dark:from-black dark:via-black dark:to-black"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left Image with hover effect */}
        <motion.div
          className="flex-1 relative group"
          initial={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.6 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <div className="overflow-hidden rounded-3xl shadow-2xl h-[500px]">
            <img
              alt="About Yoga"
              className="rounded-3xl h-[500px] object-cover w-full group-hover:scale-105 transition-transform duration-700"
              src="https://images.unsplash.com/photo-1484452330304-377cdeb05340?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fHlvZ2F8ZW58MHx8MHx8fDA%3D"
            />
          </div>
          {/* Decorative circle */}
          <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-purple-300/40 dark:bg-purple-700/30 rounded-full blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        </motion.div>

        {/* Right Content */}
        <motion.div
          className="flex-1 bg-white/20 dark:bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-lg"
          initial={{ opacity: 0, x: 60 }}
          transition={{ duration: 0.6 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-purple-950 dark:text-white mb-6 leading-snug">
            Take Your Yoga Practice to <br /> the Next Level ✨
          </h2>
          <p className="text-purple-800 dark:text-gray-300 mb-6 text-lg leading-relaxed">
            Learn from{" "}
            <span className="font-semibold text-purple-900 dark:text-white">
              expert instructors
            </span>{" "}
            and explore practices that enhance your{" "}
            <span className="italic">body, mind,</span> and{" "}
            <span className="italic">spirit</span>. Join a community dedicated
            to holistic wellness.
          </p>
          <motion.button
            className="bg-purple-700 hover:bg-purple-900 text-white px-8 py-3 rounded-xl shadow-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
