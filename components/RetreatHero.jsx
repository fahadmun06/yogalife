"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay } },
});

export default function RetreatHero() {
  const router = useRouter();

  return (
    <section id="wellness-retreat" className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Top Heading */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-primary mb-4"
            style={{ fontFamily: "serif" }}
            variants={fadeUp(0.1)}
          >
            The Butterfly Sanctuary
          </motion.h1>

          <motion.h2
            className="text-2xl md:text-3xl font-semibold text-primary mb-4"
            style={{ fontFamily: "serif" }}
            variants={fadeUp(0.2)}
          >
            Pilates Wellness Retreat
          </motion.h2>

          <motion.p
            className="text-lg text-primary italic mb-6"
            style={{ fontFamily: "serif" }}
            variants={fadeUp(0.3)}
          >
            Pilates & Wellness Retreats in Jamaica | Mind-Body Reset with
            Tinashaii
          </motion.p>

          <motion.p className="text-gray-700 mb-8" variants={fadeUp(0.4)}>
            &quot;Pilates retreat Jamaica,&quot; &quot;wellness retreat Caribbean,&quot; <br />
            &quot;gut health reset,&quot; &quot;holistic lifestyle coaching.&quot;
          </motion.p>

          <motion.h3
            className="text-2xl font-bold text-gray-900 mb-8"
            variants={fadeUp(0.5)}
          >
            Reset • Realign • Restore
          </motion.h3>
        </motion.div>

        {/* Main Description */}
        <motion.div
          className="mb-12 text-gray-800 leading-relaxed"
          initial="hidden"
          whileInView="visible"
          variants={fadeUp(0.2)}
          viewport={{ once: true }}
        >
          <p className="mb-4">
            Join a holistic sanctuary anywhere in Jamaica and immerse yourself
            in a <strong>transformative retreat experience</strong> designed to
            help you recharge, realign your body, and restore inner balance. Our
            pop-up <strong>Pilates & Wellness Retreats</strong> bring together
            mindful movement, nourishing food, and holistic self-care practices
            that will leave you feeling lighter, stronger, and deeply renewed
            inside and out.
          </p>
        </motion.div>

        {/* What's Included */}
        <motion.div
          className="mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h3
            className="text-2xl font-semibold text-gray-900 mb-6 flex items-center"
            variants={fadeUp(0.1)}
          >
            <span className="text-yellow-500 mr-2">✨</span> What&apos;s
            Included
          </motion.h3>

          <motion.p className="mb-4 text-gray-800" variants={fadeUp(0.2)}>
            Your retreat package is thoughtfully curated to nurture your{" "}
            <strong>mind, body, and soul</strong>:
          </motion.p>

          <motion.ul className="space-y-3 text-gray-700" variants={fadeUp(0.3)}>
            {[
              [
                "Pilates Sessions",
                "Energizing and restorative pilates sessions in a serene outdoor setting.",
              ],
              [
                "Wellness Workshops",
                "Learn tools for gut health, blood sugar balance, and lifestyle shifts.",
              ],
              [
                "Wholesome Nutrition",
                "Fresh, locally inspired meals designed to support healing and energy.",
              ],
              [
                "Mindfulness Practices",
                "Guided breathwork, journaling, and rituals for grounding and clarity.",
              ],
              [
                "Island Experiences",
                "Relax with coconut water under the palms, ocean dips, and gentle nature walks.",
              ],
              [
                "Community Connection",
                "A safe, supportive space to connect with like-minded women.",
              ],
            ].map(([title, desc], i) => (
              <li key={i} className="flex items-start">
                <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <div>
                  <strong>{title}</strong> – {desc}
                </div>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Pilates Session Image */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <img
            src="/yoga/img7.jpg"
            alt="Pilates session in outdoor garden setting"
            className="w-full h-[400px] object-cover rounded-lg shadow-lg"
          />
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Left Column */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp(0.2)}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="text-pink-500 mr-2">🌸</span> Sample Day at the
              Retreat
            </h3>
            <ul className="space-y-3 text-gray-700">
              {[
                "Morning: Sunrise Pilates flow",
                "Fresh tropical fruits & nourishing local dishes",
                "Workshop on gut health & holistic living",
                "Free time to rest, swim, or explore",
                "Restorative Pilates & journaling session",
                "Wholesome farm-to-table dining, shared in community",
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <img
              src="/yoga/img14.jpg"
              alt="Outdoor pilates session with pink yoga mats"
              className="w-full h-[300px] object-cover rounded-lg shadow-lg"
            />
          </motion.div>
        </div>

        {/* Who This Retreat is For */}
        <motion.div
          className="mb-12"
          initial="hidden"
          whileInView="visible"
          variants={fadeUp(0.2)}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="text-orange-500 mr-2">🧘</span> Who This Retreat is
            For
          </h3>
          <p className="mb-4 text-gray-800">
            This retreat is for you if you are ready to...
          </p>
          <ul className="space-y-3 text-gray-700">
            {[
              "Reconnect with your body and restore balance",
              "Take a break from stress, fatigue, or burnout",
              "Deepen your Pilates practice in a supportive environment",
              "Learn how to use food as medicine and reset your lifestyle",
              "Experience wellness in the heart of the Caribbean",
            ].map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          variants={fadeUp(0.3)}
          viewport={{ once: true }}
        >
          <button
            onClick={() => router.push("/auth/signup")}
            className="inline-block cursor-pointer bg-primary text-white px-8 py-3 rounded-tl-2xl rounded-br-2xl shadow-md hover:bg-primary/90 transition-all duration-300"
          >
            JOIN THE WAIT LIST
          </button>
          <p className="text-primary text-lg mt-6">
            More details coming soon….
            <br />
            Secure your spot now, pay the rest later.
          </p>
        </motion.div>

        {/* Bottom Two Images */}
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              src: "/yoga/img13.jpg",
              alt: "Welcome sign in tropical garden setting",
            },
            {
              src: "/yoga/img11.jpg",
              alt: "Woman doing pilates stretch in tropical setting",
            },
          ].map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.3 }}
              viewport={{ once: true }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-[350px] object-cover rounded-lg shadow-lg"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
