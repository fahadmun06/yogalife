"use client";
import { motion } from "framer-motion";
import { Heart, Clock, Smile, Zap } from "lucide-react";

const features = [
  { icon: Heart, title: "Holistic Wellness" },
  { icon: Clock, title: "Flexible Schedule" },
  { icon: Smile, title: "Expert Trainers" },
  { icon: Zap, title: "Energizing Workouts" },
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-20 px-6 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50 dark:bg-black dark:from-black dark:via-black dark:to-black overflow-hidden">
      <div className="container mx-auto text-center relative z-10">
        {/* Heading */}
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-purple-950 dark:text-white mb-14"
          initial={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Why Choose Us ✨
        </motion.h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="relative group bg-gradient-to-br from-purple-200/40 to-purple-100/30 dark:from-black dark:to-black rounded-2xl p-[2px] shadow-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ y: -8, scale: 1.03 }}
              whileInView={{ opacity: 1, scale: 1 }}
            >
              {/* Inner Card */}
              <div className="flex flex-col items-center text-center bg-white dark:bg-white/5 rounded-2xl h-full p-8 transition-all group-hover:bg-gradient-to-b group-hover:from-purple-50 group-hover:to-purple-100 dark:group-hover:from-white/10 dark:group-hover:to-white/10">
                <div className="bg-gradient-to-tr from-purple-700 to-purple-500 dark:from-purple-600 dark:to-purple-700 p-5 rounded-2xl text-white shadow-lg mb-6 group-hover:scale-110 transition-transform">
                  <f.icon size={36} />
                </div>
                <h3 className="text-lg font-semibold text-purple-900 dark:text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Lorem ipsum dolor sit amet consectetur elit.
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Gradient Blobs */}
      <div className="absolute top-20 -left-10 w-72 h-72 bg-purple-300/30 dark:bg-purple-700/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 -right-10 w-80 h-80 bg-purple-400/30 dark:bg-purple-800/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-200/30 dark:bg-gray-800/20 rounded-full blur-3xl opacity-70" />
    </section>
  );
}
