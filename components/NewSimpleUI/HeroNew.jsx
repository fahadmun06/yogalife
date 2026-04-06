"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@heroui/skeleton";

import ApiFunction from "../api/apiFuntions";

export default function HeroNew() {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const { get } = ApiFunction();

  const FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLScfDRhlC2YxHuHLhJ1edCF-mwxvctWmpDO_fhBSAi-rXlrasA/viewform";

  const staticSlides = [
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
    {
      title: "PROGRAM OFFER",
      heading: "Shape Your Way: Mind Body Reset",
      text: "✔ Coaching ✔ Workouts ✔ Meal Plan ✔ Holistic wellness ✔ Recovery ✔ Community",
      link: FORM_URL,
    },
  ];

  const [slides, setSlides] = useState(staticSlides);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const res = await get("/banner?type=free");

      if (
        res.success &&
        res.data &&
        res.data.slides &&
        res.data.slides.length > 0
      ) {
        setBanner(res.data);
        // Map the dynamic banner slides
        const dynamicSlides = res.data.slides.map((s) => ({
          title: s.title,
          heading: s.heading,
          text: s.description,
          link: s.link || FORM_URL,
          backgroundImage: res.data.backgroundImage,
          type: "dynamic",
        }));

        setSlides(dynamicSlides);
      } else {
        setSlides(staticSlides);
      }
    } catch (err) {
      console.error("Error fetching banner:", err);
      setSlides(staticSlides);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setActive((prev) => (prev + 1) % slides.length);
      }, 7000); // Increased to 7s for better readability of dynamic content

      return () => clearInterval(timer);
    }
  }, [slides]);

  if (loading) {
    return (
      <section className="relative pt-32 w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-neutral-900">
        <div className="container relative z-10 mx-auto px-6 flex flex-col md:flex-row items-center justify-start">
          <div className="w-full md:w-1/2 space-y-6">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-16 w-full max-w-lg rounded-lg" />
            <Skeleton className="h-32 w-full max-w-lg rounded-lg" />
            <Skeleton className="h-14 w-44 rounded-tl-3xl rounded-br-3xl mt-4 shadow-lg" />
            <div className="flex gap-3 mt-8">
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="w-3 h-3 rounded-full" />
              <Skeleton className="w-3 h-3 rounded-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const activeSlide = slides[active];
  const bgImage = activeSlide.backgroundImage
    ? `url('${activeSlide.backgroundImage}')`
    : active === 0 && !banner
      ? "url('/heromd.png')"
      : "url('/herolg.png')";

  return (
    <section
      className="relative pt-32 w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-cover bg-no-repeat bg-center transition-all duration-1000"
      style={{ backgroundImage: bgImage }}
    >
      <div className="absolute inset-0 bg-black/5" />{" "}
      {/* Subtle overlay for text readability */}
      {/* Content */}
      <div className="container relative z-10 mx-auto px-6 text-center md:text-left flex flex-col md:flex-row items-center justify-start">
        {/* Text Carousel (Left Aligned) */}
        <div className="w-full md:w-1/2 relative ">
          <AnimatePresence mode="wait">
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
                {activeSlide.title}
              </motion.h5>
              <motion.h1
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-5xl font-bold text-white mb-4 leading-snug drop-shadow-md"
                initial={{ opacity: 0, x: -40 }}
                transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
              >
                {activeSlide.heading}
              </motion.h1>
              <motion.p
                animate={{ opacity: 1 }}
                className="text-gray-200 mb-6 max-w-lg font-medium whitespace-pre-wrap leading-relaxed drop-shadow-sm"
                initial={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {activeSlide.isHtml ? (
                  <div dangerouslySetInnerHTML={{ __html: activeSlide.text }} />
                ) : (
                  activeSlide.text
                )}
              </motion.p>
              <motion.a
                className="bg-white hover:bg-primary hover:text-white inline-block cursor-pointer text-[#413625] px-8 py-3 rounded-tl-3xl rounded-br-3xl font-semibold shadow-md transition-all duration-300 hover:shadow-lg"
                href={activeSlide.link}
                target="_blank"
              >
                Get Started
              </motion.a>
            </motion.div>
          </AnimatePresence>

          {/* Indicators */}
          <div className="flex gap-3 mt-8 justify-center md:justify-start">
            {slides.map((_, i) => (
              <motion.button
                key={i}
                animate={{
                  scale: active === i ? 1.4 : 1,
                  transition: { type: "spring", stiffness: 300, damping: 15 },
                }}
                className={`w-3 h-3 rounded-full transition-colors duration-300 cursor-pointer ${
                  active === i
                    ? "bg-white shadow-[0_0_10px_white]"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                whileHover={{ scale: 1.2 }}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
