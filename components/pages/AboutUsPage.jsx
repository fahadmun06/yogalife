"use client";

import Head from "next/head";
import { motion } from "framer-motion";

import Testimonials from "../Testimonials";
import DiscountSection from "../DiscountSection";
import PageHero from "../NewSimpleUI/PageHero";

const AboutUsPage = () => {
  return (
    <>
      <Head>
        <title>About - TinasHaii</title>
        <meta
          content="Meet Tina — Certified Health Coach, Fitness & Pilates. Founder of the Butterfly Sanctuary Holistic Health, helping you achieve balance in movement, nutrition, and mindset."
          name="description"
        />
      </Head>

      <PageHero
        breadcrumb={[{ label: "About", link: "/about" }]}
        subtitle="Certified Health Coach • Fitness • Pilates"
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
               object-cover object-bottom z-10 relative"
                src="aboutnew.jpg"
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                whileHover={{ scale: 1.02 }}
              />

              {/* Decorative overlay image */}
              {/* <motion.img
                alt="Design Element"
                className="absolute -bottom-10 -right-10 w-[180px] md:w-[250px] hidden md:block z-20"
                initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
                src="https://designingmedia.com/yogastic/wp-content/uploads/2022/07/about-us-design-element-1.png"
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
              /> */}
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
                Meet Tina
              </h4>
              <h2 className="text-4xl font-bold text-gray-900 font-playfair">
                Certified Health Coach • Fitness • Pilates
              </h2>

              {/* Updated Tina Content */}
              <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                <p>
                  Hi, I’m <span className="font-bold text-primary">Tina</span>,
                  Founder and head coach at the{" "}
                  <span className="italic">
                    Butterfly Sanctuary Holistic Health
                  </span>
                  . My passion for health and fitness comes from my own journey
                  of finding true balance with movement, nutrition, and mindset
                  in a way that actually lasts.
                </p>
                <p>
                  I know what it feels like to feel stuck, overwhelmed, or out
                  of alignment with your body, and that’s exactly why I created
                  this space: a sanctuary where transformation feels
                  sustainable, enjoyable, and deeply personal.
                </p>
                <p>
                  As a certified health coach through the{" "}
                  <span className="font-semibold text-primary">
                    Institute for Integrative Nutrition (IIN)
                  </span>
                  , I’ve learned how powerful it is to approach wellness
                  holistically. For me, it wasn’t just about exercise or food
                  alone — it was about weaving everything together: mind, body,
                  and spirit.
                </p>
                <p>
                  Pilates and strength training have been the foundation of how
                  I transformed my own body, helping me build strength, tone,
                  and confidence, while nutrition taught me how to fuel myself
                  with the right foods for energy and healing.
                </p>
                <p>
                  This passion for holistic wellness is what drives me to share
                  tools that go beyond surface-level fixes. Here, you’ll find
                  simple and effective practices that will help you feel strong,
                  energized, and truly at home in your body — while actually
                  enjoying the journey.
                </p>
                <p className="font-semibold text-primary">
                  I can’t wait for you to join me in this sanctuary, where
                  wellness becomes a lifestyle, not a quick fix.
                </p>
              </div>
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
