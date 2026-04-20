"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@heroui/skeleton";

import { useLandingPage } from "../../hooks/useLandingPage";

export default function AboutSectionNew() {
  const { getAbout } = useLandingPage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLScfDRhlC2YxHuHLhJ1edCF-mwxvctWmpDO_fhBSAi-rXlrasA/viewform";
  console.log("aboutData", data);
  useEffect(() => {
    const loadAbout = async () => {
      const aboutData = await getAbout();

      if (aboutData) {
        setData(aboutData);
      }
      setLoading(false);
    };

    loadAbout();
  }, []);

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
          {loading ? (
            <Skeleton className="w-full max-w-[570px] aspect-square rounded-tl-[50px] rounded-br-[50px]" />
          ) : (
            <>
              {/* Background color shape */}
              <div
                className="absolute top-4 left-4 w-full max-w-[570px] h-full max-h-[570px] 
                   rounded-tl-[50px] rounded-br-[50px] 
                   bg-[#F4EDF5] z-0"
              />

              {/* Main Image */}
              <motion.img
                alt="Yoga Girl"
                className="w-full max-w-[570px] h-auto aspect-square 
                   rounded-tl-[50px] rounded-br-[50px] 
                   object-cover object-bottom z-10 relative"
                src={data?.image || "aboutnew.jpg"}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                whileHover={{ scale: 1.02 }}
              />
            </>
          )}
        </motion.div>

        {/* Right Content */}
        <motion.div
          className="text-left"
          initial={{ opacity: 0, x: 80 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-12 w-32 rounded-lg" />
            </div>
          ) : (
            <>
              <motion.h4
                className="text-sm uppercase tracking-wider text-primary font-bold"
                initial={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                {data?.tagline || "Meet Tina"}
              </motion.h4>

              <motion.h2
                className="mt-3 text-3xl md:text-4xl font-playfair font-bold leading-snug"
                initial={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                {data?.title ||
                  "Hi, I’m Tina Certified Health Coach, Fitness & Pilates"}
              </motion.h2>

              <motion.div
                className="mt-6 text-gray-600 text-lg whitespace-pre-wrap leading-relaxed"
                initial={{ opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                whileInView={{ opacity: 1 }}
              >
                {data?.description}
              </motion.div>

              <motion.a
                className="mt-6 inline-block bg-primary cursor-pointer rounded-tl-3xl rounded-br-3xl text-white px-6 py-3 font-medium transition hover:bg-primary/90 shadow-lg shadow-primary/20"
                href={FORM_URL}
              >
                Get Started
              </motion.a>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
