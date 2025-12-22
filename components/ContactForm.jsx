"use client";
import { motion } from "framer-motion";
import { User, Mail, Phone, MessageSquare } from "lucide-react";

export default function ContactForm() {
  return (
    <section
      className="relative py-20 px-6 overflow-hidden 
      bg-gradient-to-br from-purple-100 via-white to-purple-200 
      dark:bg-black dark:from-gray-900 dark:via-black dark:to-gray-900"
    >
      {/* Floating background shapes */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-300/30 dark:bg-purple-700/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200/40 dark:bg-purple-900/20 rounded-full blur-3xl animate-ping" />
      <div className="absolute top-40 right-1/3 w-40 h-40 bg-purple-400/20 dark:bg-purple-800/20 rounded-full blur-2xl animate-bounce" />

      <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 items-center gap-12 relative z-10">
        {/* Left - Form */}
        <motion.div
          className="flex-1 max-w-lg mx-auto"
          initial={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.6 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-4xl font-extrabold text-purple-900 dark:text-white mb-4 leading-snug">
            Stay{" "}
            <span className="text-purple-600 dark:text-purple-400">
              Connected
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Subscribe to our newsletter and never miss updates, yoga tips, and
            meditation guides.
          </p>

          <form className="space-y-5 bg-white/70 dark:bg-white/5 backdrop-blur-md border border-purple-200 dark:border-white/20 p-8 rounded-2xl shadow-xl">
            {[
              {
                icon: (
                  <User
                    className="text-purple-600 dark:text-purple-400"
                    size={20}
                  />
                ),
                placeholder: "Your Name",
                type: "text",
              },
              {
                icon: (
                  <Mail
                    className="text-purple-600 dark:text-purple-400"
                    size={20}
                  />
                ),
                placeholder: "Email Address",
                type: "email",
              },
              {
                icon: (
                  <Phone
                    className="text-purple-600 dark:text-purple-400"
                    size={20}
                  />
                ),
                placeholder: "Phone Number",
                type: "text",
              },
            ].map((field, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl 
                           bg-white/20 dark:bg-white/5 border border-purple-200 dark:border-white/20
                           focus-within:ring-2 focus-within:ring-purple-400 dark:focus-within:ring-white/20
                           transition-all duration-300`}
              >
                {field.icon}
                <input
                  className="w-full bg-transparent outline-none text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
                  placeholder={field.placeholder}
                  type={field.type}
                />
              </div>
            ))}

            {/* Message */}
            <div
              className={`flex items-start gap-3 px-4 py-3 rounded-xl bg-white/20 dark:bg-white/5 border border-purple-200 dark:border-white/20 focus-within:ring-2 focus-within:ring-purple-400 dark:focus-within:ring-white/20
                         transition-all duration-300`}
            >
              <MessageSquare
                className="text-purple-600 dark:text-purple-400 mt-1"
                size={20}
              />
              <textarea
                className="w-full bg-transparent outline-none resize-none text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
                placeholder="Write your message..."
                rows={3}
              />
            </div>

            {/* Button */}
            <motion.button
              className="w-full bg-gradient-to-r from-purple-700 to-purple-500 dark:from-purple-600 dark:to-purple-700 hover:from-purple-800 hover:to-purple-600 
                         text-white px-6 py-3 rounded-xl shadow-lg font-semibold transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe Now
            </motion.button>
          </form>
        </motion.div>

        {/* Right - Image / Illustration */}
        <motion.div
          className="hidden lg:block relative"
          initial={{ opacity: 0, x: 40 }}
          transition={{ duration: 0.6 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl">
            <img
              alt="Newsletter Yoga"
              className="object-cover h-full w-full"
              src="https://images.unsplash.com/photo-1593164842264-854604db2260?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 dark:from-black/40 via-purple-600/20 dark:via-black/20 to-transparent" />

            {/* Tagline */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white/80 dark:bg-gray-800/70 text-purple-800 dark:text-purple-300 font-semibold text-xl px-8 py-3 rounded-full shadow-lg backdrop-blur-md">
                Mind • Body • Peace
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
