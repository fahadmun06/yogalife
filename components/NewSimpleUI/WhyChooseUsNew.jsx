"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ImageIcon } from "lucide-react";
import { Skeleton } from "@heroui/skeleton";
import { useLandingPage } from "../../hooks/useLandingPage";

export default function WhyChooseUsNew() {
  const { getWhyChooseUs } = useLandingPage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const whyData = await getWhyChooseUs();
      if (whyData) {
        setData(whyData);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const featuresLeft = data?.featuresLeft || [];
  const featuresRight = data?.featuresRight || [];

  return (
    <section className="py-16 bg-[#F4EDF5] overflow-hidden">
      <div className="container mx-auto text-center px-4">
        {/* Heading */}
        <motion.div
          className="text-sm tracking-widest text-primary font-bold"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {loading ? (
            <Skeleton className="h-4 w-32 mx-auto rounded-lg" />
          ) : (
            data?.tagline || "OUR SPECIALTIES"
          )}
        </motion.div>

        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 whitespace-pre-wrap"
          initial={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {loading ? (
            <Skeleton className="h-10 w-full max-w-sm mx-auto mt-4 rounded-lg" />
          ) : (
            data?.title || "Why Choose Us"
          )}
        </motion.h2>

        <motion.div
          className="mt-4 text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          {loading ? (
            <Skeleton className="h-20 w-full mt-4 rounded-lg" />
          ) : (
            data?.description
          )}
        </motion.div>

        {/* Main Content */}
        <div className="relative mt-12 px-2 md:px-0 flex flex-col md:flex-row items-center justify-center gap-10">
          {/* Left Features */}
          <div className="w-full md:w-1/3 space-y-8 text-right md:pr-1 order-2 md:order-1">
            {loading
              ? [1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-end gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32 ml-auto rounded-lg" />
                      <Skeleton className="h-12 w-48 ml-auto rounded-lg" />
                    </div>
                    <Skeleton className="w-10 h-10 rounded-full" />
                  </div>
                ))
              : featuresLeft.map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center justify-end space-x-4"
                    initial={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5, delay: i * 0.2 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1, x: 0 }}
                  >
                    <div className="text-right">
                      <h3 className="font-semibold text-gray-800">
                        {item.title}
                      </h3>
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
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
              <div className="relative max-w-[400px] min-w-[400px] min-h-[400px] max-h-[400px]">
                <div className="absolute inset-4 rounded-full bg-primary/5 " />
                <div className="absolute inset-14 rounded-full bg-primary/10 " />
                <div className="absolute inset-28 rounded-full shadow-lg bg-white " />
              </div>
            </div>

            {/* Target Image */}
            {loading ? (
              <Skeleton className="w-[200px] aspect-square rounded-full z-10" />
            ) : data?.centerImage ? (
              <img
                alt="Yoga Pose"
                className="relative z-10 w-[250px] md:w-[350px] h-auto object-contain drop-shadow-lg"
                src={data.centerImage}
              />
            ) : (
              <div className="relative z-10 w-[250px] h-[350px] flex items-center justify-center text-gray-300">
                <ImageIcon size={60} />
              </div>
            )}
          </motion.div>

          {/* Right Features */}
          <div className="w-full md:w-1/3 space-y-8 md:pl-10 order-3">
            {loading
              ? [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-start gap-4"
                  >
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32 rounded-lg" />
                      <Skeleton className="h-12 w-48 rounded-lg" />
                    </div>
                  </div>
                ))
              : featuresRight.map((item, i) => (
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
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
