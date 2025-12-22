"use client";

import { motion } from "framer-motion";

export default function AboutSectionNew() {
  const FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLScfDRhlC2YxHuHLhJ1edCF-mwxvctWmpDO_fhBSAi-rXlrasA/viewform";
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Left Image */}
        <motion.div
          className="relative flex justify-center items-center w-full"
          initial={{ opacity: 0, x: -80 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          {/* Background color shape */}
          <div
            className="absolute top-4 left-4 w-full max-w-[570px] h-full max-h-[570px] 
               rounded-tl-[50px] rounded-br-[50px] 
               bg-gradient-to-br from-[#E1CCAD] to-[#d9b88f] z-0"
          />

          {/* Main Image */}
          <motion.img
            alt="Yoga Girl"
            className="w-full max-w-[570px] h-auto aspect-square 
               rounded-tl-[50px] rounded-br-[50px] 
               object-cover object-bottom z-10 relative"
            src="aboutnew.jpg"
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            whileHover={{ scale: 1.02 }}
          />

          {/* Decorative overlay image */}
          <motion.img
            alt="Design Element"
            className="absolute -bottom-10 -right-10 w-[180px] md:w-[250px] hidden md:block z-20"
            initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
            src="https://designingmedia.com/yogastic/wp-content/uploads/2022/07/about-us-design-element-1.png"
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
          />
        </motion.div>

        {/* Right Content */}
        <motion.div
          className="text-left"
          initial={{ opacity: 0, x: 80 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <motion.h4
            className="text-sm uppercase tracking-wider text-primary "
            initial={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Meet Tina
          </motion.h4>

          <motion.h2
            className="mt-3 text-3xl md:text-4xl font-playfair font-bold leading-snug"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Hi, I’m Tina <br /> Certified Health Coach, Fitness & Pilates
          </motion.h2>

          <motion.p
            className="mt-6 text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            whileInView={{ opacity: 1 }}
          >
            Founder and head coach at the Butterfly Sanctuary Holistic Health.
            My passion for health and fitness comes from my own journey of
            finding true balance with movement, nutrition, and mindset in a way
            that actually lasts. I know what it feels like to feel stuck,
            overwhelmed, or out of alignment with your body, and that’s exactly
            why I created this space: a sanctuary where transformation feels
            sustainable, enjoyable, and deeply personal.
          </motion.p>

          <motion.p
            className="mt-4 text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            whileInView={{ opacity: 1 }}
          >
            As a certified health coach through the Institute for Integrative
            Nutrition (IIN), I’ve learned how powerful it is to approach
            wellness holistically. For me, it wasn’t just about exercise or food
            alone, it was about weaving everything together: mind, body, and
            spirit.
          </motion.p>

          <motion.p
            className="mt-4 text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            whileInView={{ opacity: 1 }}
          >
            Pilates and strength training have been the foundation of how I
            transformed my own body, helping me build strength, tone, and
            confidence, while nutrition taught me how to fuel myself with the
            right foods for energy and healing.
          </motion.p>

          <motion.p
            className="mt-4 text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            whileInView={{ opacity: 1 }}
          >
            This passion for holistic wellness is what drives me to share tools
            that go beyond surface-level fixes. Here, you’ll find simple and
            effective practices that will help you feel strong, energized, and
            truly at home in your body while actually enjoying the journey.
          </motion.p>

          <motion.p
            className="mt-4 text-primary font-semibold text-lg"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            whileInView={{ opacity: 1 }}
          >
            I can’t wait for you to join me in this sanctuary, where wellness
            becomes a lifestyle, not a quick fix.
          </motion.p>

          <motion.a
            className="mt-6 inline-block bg-[#E1CCAD] cursor-pointer rounded-tl-3xl rounded-br-3xl text-[#413625] px-6 py-3 font-medium transition hover:bg-[#d9b88f]"
            href={FORM_URL}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
