"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ButterflySection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        {/* Intro Purpose Text */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-[#4A3B4C] leading-snug tracking-tight">
            The Butterfly Sanctuary is a holistic wellness platform founded by a
            Jamaican Certified Holistic Practitioner, focused on Pilates-based
            strength, low-impact movement, and nervous system support to help
            women stay consistent without burnout.
          </h3>
        </motion.div>

        {/* Scalable Vector Pareto Chart (SVG) */}
        <motion.div
          className="relative flex justify-center mb-20 pointer-events-none select-none"
          initial={{ opacity: 0, scale: 0.95 }}
          transition={{ delay: 0.2, duration: 1 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, scale: 1 }}
        >
          <div className="relative w-full max-w-[400px] aspect-square">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 200 200"
            >
              {/* Background Circle / 80% Segment Base */}
              <circle
                className="text-[#8B5E83]"
                cx="100"
                cy="100"
                fill="transparent"
                r="85"
                stroke="currentColor"
                strokeDasharray="534"
                strokeDashoffset="107" /* 80% */
                strokeLinecap="round"
                strokeWidth="18"
              />
              {/* Highlight / 20% Segment */}
              <motion.circle
                className="text-primary/30"
                cx="100"
                cy="100"
                fill="transparent"
                initial={{ strokeDashoffset: 534 }}
                r="85"
                stroke="currentColor"
                strokeDasharray="534"
                strokeLinecap="round"
                strokeWidth="18"
                transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
                viewport={{ once: true }}
                whileInView={{
                  strokeDashoffset: 427,
                }} /* 20% of 534 is ~107. OFFSET = 534-107 = 427 */
              />
            </svg>

            {/* Center Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
              <motion.div
                initial={{ opacity: 0 }}
                transition={{ delay: 1.2, duration: 1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1 }}
              >
                <span className="block text-6xl md:text-7xl font-black text-[#4A3B4C] mb-2 drop-shadow-sm">
                  20%
                </span>
                <span className="block text-sm md:text-base font-bold text-gray-500 uppercase tracking-[0.2em] leading-tight">
                  Of Our Actions =<br />
                  <span className="text-[#8B5E83] text-lg md:text-xl">
                    80% of our Results
                  </span>
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Narrative Personal Story */}
        <motion.div
          className="space-y-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col gap-4">
            <p className="text-lg text-[#8B5E83] font-semibold italic opacity-80 uppercase tracking-widest">
              Personal Journey
            </p>
            <p className="text-xl md:text-2xl text-gray-600 font-medium italic leading-relaxed">
              &quot;I&apos;ve been there...&quot;
            </p>
          </div>

          <h4 className="text-2xl md:text-3xl font-bold text-[#4A3B4C] leading-tight">
            Pushing my body in the gym, doing everything I thought was right...
            and still not seeing results.
          </h4>

          <div className="pt-4 border-t border-purple-50 inline-block">
            <p className="text-xl md:text-2xl text-primary font-bold italic drop-shadow-sm">
              Consistency felt forced, not sustainable.
            </p>
          </div>
        </motion.div>

        {/* Additional Image Sequence */}
        <div className="mt-24 space-y-24">
          {/* Image 1 */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Image
              alt="Physiological Insight 1"
              className="w-full max-w-3xl rounded-2xl shadow-xl border border-divider h-auto"
              height={600}
              src="/image1.png"
              width={1000}
            />
          </motion.div>
          <motion.p
            className="text-xl md:text-2xl text-gray-600 italic font-bold mt-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            I’ve been there too…
          </motion.p>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 40 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Image
              alt="Physiological Insight 2"
              className="w-full h-auto max-w-3xl rounded-2xl shadow-xl border border-divider"
              height={600}
              src="/image.png"
              width={1000}
            />
          </motion.div>

          {/* Image 3 with Content Block */}
          <div className="space-y-16">
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 40 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <Image
                alt="Physiological Insight 3"
                className="w-full h-auto max-w-3xl rounded-2xl shadow-xl border border-divider"
                height={600}
                src="/image2.PNG"
                width={1000}
              />
            </motion.div>

            {/* Why This Actually Works Text Block */}
            <motion.div
              className="space-y-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#4A3B4C] font-serif">
                Why this actually works
              </h2>

              <div className="space-y-2">
                <p className="text-xl md:text-2xl text-[#8B5E83] italic">
                  Because your body is cyclical.
                </p>
                <p className="text-xl md:text-2xl text-[#8B5E83] italic">
                  Most fitness plans aren&apos;t.
                </p>
              </div>

              <p className="text-2xl md:text-3xl font-bold text-[#4A3B4C] leading-tight">
                When your workouts match your physiology, your body responds
                instead of resisting.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
