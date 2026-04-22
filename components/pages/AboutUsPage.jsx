"use client";

import Head from "next/head";
import { motion } from "framer-motion";

import Testimonials from "../Testimonials";
import DiscountSection from "../DiscountSection";
import PageHero from "../NewSimpleUI/PageHero";
import { useLandingPage } from "../../hooks/useLandingPage";
import { useEffect, useState } from "react";
import { Skeleton } from "@heroui/skeleton";

const AboutUsPage = () => {
  const { getAbout } = useLandingPage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="space-y-12 pb-20">
        <Skeleton className="h-[40vh] w-full" />
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 mt-20">
            <Skeleton className="aspect-square w-full rounded-[50px]" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{data?.title || "About"} - TinasHaii</title>
        <meta
          content={data?.description || "Meet Tina — Certified Health Coach, Fitness & Pilates."}
          name="description"
        />
      </Head>

      <PageHero
        breadcrumb={[{ label: "About", link: "/about" }]}
        subtitle={data?.tagline || "Certified Health Coach • Fitness • Pilates"}
        title="About"
      />

      {/* About Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Images */}
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
               bg-[#F4EDF5] z-0"
              />

              {/* Main Image */}
              <motion.img
                alt="Tina - Health Coach"
                className="w-full max-w-[570px] h-auto aspect-square 
               rounded-tl-[50px] rounded-br-[50px] 
               object-cover object-bottom z-10 relative shadow-2xl"
                src={data?.image || "aboutnew.jpg"}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                whileHover={{ scale: 1.02 }}
              />
            </motion.div>

            {/* Content */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h4 className="text-primary font-semibold text-sm uppercase tracking-wide">
                {data?.tagline || "Meet Tina"}
              </h4>
              <h2 className="text-4xl font-bold text-gray-900 font-playfair leading-tight">
                {data?.title || "Certified Health Coach • Fitness • Pilates"}
              </h2>

              {/* Dynamic Content */}
              <div 
                className="space-y-4 text-gray-600 leading-relaxed text-lg whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: data?.description }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <DiscountSection />
      <Testimonials />
    </>
  );
};

export default AboutUsPage;
