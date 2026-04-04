"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HeroNew() {
  const [active, setActive] = useState(0);
  const FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLScfDRhlC2YxHuHLhJ1edCF-mwxvctWmpDO_fhBSAi-rXlrasA/viewform";

  const slides = [
    {
      title: "1:1 Health Coaching",
      heading: "Personalized guidance tailored to your lifestyle",
      text: "Build healthier habits, improve nutrition, heal your gut, manage stress, weight loss and reach your wellness goals with a plan designed just for you.",
      link: FORM_URL,
    },
    {
      title: "Meal Guides & Plans",
      heading: "Simple, nourishing recipes",
      text: "Over 100 meal guides and weekly plans designed to fuel your body without restrictions or overwhelm. Choose from a variety of styles including Jamaican, Mediterranean, Keto, Paleo, Vegan, and Vegetarian to fit your lifestyle and taste.",
      link: FORM_URL,
    },
    {
      title: "Meet Tina",
      heading: "Your Wellness Coach",
      text: "Through personalized coaching I help women & men heal their gut, balance their weight, and create sustainable healthy habits through personalized nutrition, lifestyle guidance, and holistic wellness practices.",
      link: FORM_URL,
    },
    {
      title: "Daily Workouts",
      heading: "Strength, Mobility & Energy Boost",
      text: "Pre-recorded videos - balanced blend of Pilates, strength training, and mobility to help you get stronger, improve posture, and feel energized.",
      link: FORM_URL,
    },
    {
      title: "Wellness Club",
      heading: "Join the Wellness Club",
      isHtml: true,
      text: "Step into your holistic sanctuary, a space where wellness meets joy. Move, breathe, and strengthen your body with our Pilates classes, dive into nourishing workshops, and recharge with rejuvenating retreats. <br /> <br /> Our Wellness Club is more than just a program, it's a community, a lifestyle, and your personal hub for feeling vibrant, balanced, and fully alive. <br /> <br /> Come for the movement. Stay for the magic.",
      link: FORM_URL,
    },
    {
      title: "SUPPORTIVE COMMUNITY",
      heading: "Accountability & Connection",
      text: "Stay motivated with group support, shared wins, and LIVE community workouts, workshops to keep you motivated, disciplined & consistent.",
      link: FORM_URL,
    },
    // {
    //   title: "Mindfulness & Somatic Tools",
    //   heading: "Calm Your Mind & Reduce Stress",
    //   text: "Daily meditation and nervous system reset practices to improve focus, presence, and inner peace.",
    //   link: FORM_URL,
    // },

    {
      title: "PROGRAM OFFER",
      heading: "Shape Your Way: Mind Body Reset",
      text: "✔ Coaching ✔ Workouts ✔ Meal Plan ✔ Holistic wellness ✔ Recovery ✔ Community",
      link: FORM_URL,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 sec delay

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-32 w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-[url('/heromd.png')] lg:bg-[url('/herolg.png')] bg-cover bg-no-repeat bg-center">
      {/* Content */}
      <div className="container relative z-10 mx-auto px-6 text-center md:text-left flex flex-col md:flex-row items-center justify-start">
        {/* Text Carousel (Left Aligned) */}
        <div className="w-full md:w-1/2 relative ">
          <motion.div
            key={active}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.h5
              animate={{ opacity: 1, y: 0 }}
              className="text-lg text-black mb-2 tracking-wide font-semibold"
              initial={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {slides[active].title}
            </motion.h5>
            <motion.h1
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4 leading-snug"
              initial={{ opacity: 0, x: -40 }}
              transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
            >
              {slides[active].heading}
            </motion.h1>
            <motion.p
              animate={{ opacity: 1 }}
              className="text-gray-200 mb-6 max-w-lg"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {slides[active].isHtml ? (
                <div
                  dangerouslySetInnerHTML={{ __html: slides[active].text }}
                />
              ) : (
                slides[active].text
              )}
            </motion.p>
            <motion.a
              className="bg-white hover:bg-primary hover:text-white inline-block cursor-pointer text-[#413625] px-8 py-3 rounded-tl-3xl rounded-br-3xl font-semibold shadow-md transition-all duration-300 hover:shadow-lg"
              href={slides[active].link}
            >
              Get Started
            </motion.a>
          </motion.div>

          {/* Indicators */}
          <div className="flex gap-3 mt-6 justify-center md:justify-start">
            {slides.map((_, i) => (
              <motion.button
                key={i}
                animate={{
                  scale: active === i ? 1.3 : 1,
                  transition: { type: "spring", stiffness: 250, damping: 15 },
                }}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  active === i ? "bg-white" : "bg-gray-500"
                }`}
                whileHover={{ scale: 1.15 }}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
