"use client";

import { motion } from "framer-motion";

const services = [
  {
    title: "Meditation",
    desc: "Guided meditation to increase focus & relaxation.",
    img: "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Wellness Consultation",
    desc: "Personal wellness plans designed for you.",
    img: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=500&auto=format&fit=crop&q=60",
  },
  {
    title: "Daily Yoga",
    desc: "Join live & recorded yoga sessions anytime.",
    img: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=500&auto=format&fit=crop&q=60",
  },
  {
    title: "Fitness",
    desc: "Improve strength, flexibility, and balance.",
    img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80",
  },
];

export default function Services() {
  return (
    <section
      className={`py-20 px-6 relative
        bg-gradient-to-br from-purple-200 via-pink-100 to-purple-300  dark:from-black dark:via-black dark:to-black
         dark:before:absolute dark:before:inset-0 dark:before:bg-gradient-to-r dark:before:from-purple-900 dark:before:via-purple-800 dark:before:to-indigo-950 dark:before:animate-pulse-gradient dark:before:-z-10`}
    >
      <div className="container mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-950 dark:text-white mb-6">
          Practice Whenever You Want, Wherever You Need
        </h2>
        <p className="max-w-2xl mx-auto text-purple-800 dark:text-gray-300 mb-12">
          Take a step into holistic wellness with expert trainers, tailored
          sessions, and a supportive environment.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white/20 dark:bg-white/5 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-transform duration-300 border border-white/20 dark:border-white/10"
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              {/* Image */}
              <div className="w-full h-52 overflow-hidden rounded-t-2xl">
                <img
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  src={service.img}
                />
              </div>

              {/* Content */}
              <div className="p-6 text-left">
                <h3 className="text-xl font-semibold text-purple-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-purple-700 dark:text-gray-300 text-sm leading-relaxed">
                  {service.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        @keyframes pulse-gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-pulse-gradient {
          background-size: 200% 200%;
          animation: pulse-gradient 8s ease infinite;
        }
      `}</style>
    </section>
  );
}
