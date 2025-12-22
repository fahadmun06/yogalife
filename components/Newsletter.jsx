"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    window.open(
      "https://medium.com/@tina.123.shay",
      "_blank",
      "noopener,noreferrer",
    );
    setEmail("");
  };

  return (
    <section className="relative  max-w-6xl  mx-auto mb-10 md:mb-0 mt-10">
      {/* Background Image */}
      <img
        alt="Newsletter Background"
        className="w-full md:rounded-tl-[50px] md:rounded-br-[50px] h-[300px] md:h-[420px] object-[25%_75%] object-cover"
        src="/newsletternew.jpg"
      />
      {/* overlayblack */}
      <div className="absolute rounded-tl-[50px] rounded-br-[50px]  inset-0 bg-black opacity-50" />

      {/* Overlay Content */}
      <div className="absolute  rounded-tl-[50px] rounded-br-[50px]  inset-0 flex items-center">
        <div className="container  mx-auto px-3 md:px-14">
          <div className="max-w-xl space-y-6">
            <motion.h4
              className="text-sm font-bold tracking-widest text-primary  uppercase"
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              SUBSCRIBE NOW
            </motion.h4>

            <motion.h2
              className="text-3xl md:text-4xl text-white font-playfair font-bold leading-snug text-left"
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              Get the Latest Updates <br />
              With Our Newsletter
            </motion.h2>

            <motion.form
              className="flex flex-col  gap-4"
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileInView={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
            >
              <motion.input
                required
                className="flex-1 px-5 py-3 max-w-sm rounded-lg border bg-white border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none transition"
                placeholder="Enter Your Email"
                type="email"
                value={email}
                whileFocus={{ scale: 1.02 }}
                onChange={(e) => setEmail(e.target.value)}
              />

              <motion.button
                className="bg-primary cursor-pointer w-auto max-w-[200px] text-white px-6 py-3 rounded-tl-3xl rounded-br-3xl font-medium transition hover:bg-[#d9b88f]"
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
}
