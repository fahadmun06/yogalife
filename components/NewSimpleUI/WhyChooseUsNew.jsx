"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const featuresLeft = [
  {
    title: "Follow-Along Workout Videos",
    desc: "A complete library of Pilates, Strength, Yoga, Sweat, Power, Stretch. Move anytime, anywhere,and experience the freedom of making movement a part of your daily life.",
  },
  {
    title: "Personalized Cycle Syncing",
    desc: "Align your workouts, nutrition, and lifestyle with your menstrual cycle for better energy, balance, and results.",
  },
  {
    title: "6 Progressive Workout Guides",
    desc: "Choose from beginner to advanced training plans — designed to meet you exactly where you are.",
  },
  {
    title: "Custom Workout Planner",
    desc: "Add, remove, or swap workouts to create a routine that truly fits your lifestyle.",
  },
];

const featuresRight = [
  {
    title: "100+ Dietitian-Approved Recipes",
    desc: "Delicious vegan, pescatarian, vegetarian, and gluten-free recipes — designed to fuel your body and gut health.",
  },
  {
    title: "Exclusive Ebooks & Guides",
    desc: "Resources covering lifestyle changes, weight management, gut health, meal planning, and sustainable living.",
  },
  {
    title: "Gut Healing Guidance",
    desc: "Workshops, tools, and strategies to improve digestion, reduce bloating, and restore balance.",
  },
  {
    title: "Supportive Community & Accountability",
    desc: "Connect with like-minded people, join discussions, workshops and stay consistent with monthly check-ins.",
  },
];

export default function WhyChooseUsNew() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto text-center">
        {/* Heading */}
        <motion.p
          className="text-sm tracking-widest text-primary "
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          OUR SPECIALTIES
        </motion.p>

        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mt-2"
          initial={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Why Choose Us
        </motion.h2>

        <motion.p
          className="mt-4 text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          Your complete wellness journey — from guided workouts and nutrition to
          mindfulness, gut health, and a supportive community.
        </motion.p>

        {/* Main Content */}
        <div className="relative mt-12 px-2 md:px-0 flex flex-col md:flex-row items-center justify-center gap-10">
          {/* Left Features */}
          <div className="w-full md:w-1/3 space-y-8 text-right md:pr-6 order-2 md:order-1">
            {featuresLeft.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center justify-end space-x-4"
                initial={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <div className="text-right">
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-md">
                  <CheckCircle size={20} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Center Image */}
          <motion.div
            className="relative w-full md:w-1/4 flex justify-center order-1 md:order-2"
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            {/* Rings Background */}
            {/* Rings Background */}
            <div className="absolute left-10 inset-0 flex items-center justify-center z-0 pointer-events-none">
              <div className="relative max-w-[400px] min-w-[400px] min-h-[400px] max-h-[400px]">
                {/* Outer Ring */}
                <div className="absolute inset-4 rounded-full bg-primary/5 " />

                {/* Middle Ring */}
                <div className="absolute inset-14 rounded-full bg-primary/10 " />

                {/* Inner Ring */}
                <div className="absolute inset-28 rounded-full shadow-lg bg-white " />
              </div>
            </div>

            {/* Girl Image */}
            <img
              alt="Yoga Pose"
              className="relative z-10 w-[250px] md:w-[350px] h-auto object-contain drop-shadow-lg"
              src="GirlYoga.png"
            />
          </motion.div>

          {/* Right Features */}
          <div className="w-full md:w-1/3 space-y-8 md:pl-6 order-3">
            {featuresRight.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center w-full justify-start space-x-4"
                initial={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-md">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-start text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-sm text-start text-gray-500">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* <AnimatedRings /> */}
    </section>
  );
}
