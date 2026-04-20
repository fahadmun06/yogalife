"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@heroui/skeleton";
import { Image as ImageIcon } from "lucide-react";

import { useLandingPage } from "../../hooks/useLandingPage";

export default function ServicesSectionNew() {
  const { getServices } = useLandingPage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      const servicesData = await getServices();

      if (servicesData) {
        setData(servicesData);
      }
      setLoading(false);
    };

    loadServices();
  }, []);

  const services = data?.items || [];

  return (
    <section className="py-20 bg-[#FCF6F5] relative">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14"
          initial={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-10 w-3/4 rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold mt-2 text-[#413625]">
                {data?.mainTitle || "Whenever You Need It"}
              </h2>
              <p className="mt-4 text-gray-600 whitespace-pre-wrap">
                {data?.mainDesc}
              </p>
            </>
          )}
        </motion.div>

        {/* Slider */}
        <div className="relative">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-[430px] bg-white rounded-tl-[50px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
                >
                  <Skeleton className="h-52 w-full" />
                  <div className="p-5 space-y-4">
                    <Skeleton className="h-6 w-3/4 rounded-lg" />
                    <Skeleton className="h-24 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="relative"
              loop={services.length > 4}
              modules={[Navigation, Autoplay]}
              navigation={{
                nextEl: ".custom-next",
                prevEl: ".custom-prev",
              }}
              slidesPerView={1}
              spaceBetween={24}
            >
              {services.map((s, i) => (
                <SwiperSlide key={i} className="!h-auto py-3">
                  <motion.div
                    className="bg-[#FCF6F5] rounded-tl-[50px] rounded-2xl rounded-tr-none overflow-hidden group transition border border-gray-200 shadow-sm hover:shadow-md h-full flex flex-col"
                    initial={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.6, delay: i * 0.2 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1, y: 0 }}
                  >
                    <div className="overflow-hidden relative">
                      {s.img ? (
                        <img
                          alt={s.title}
                          className={`w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500`}
                          src={s.img}
                        />
                      ) : (
                        <div className="w-full h-52 bg-gray-100 flex items-center justify-center text-gray-300">
                          <ImageIcon size={40} />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <motion.h3
                        className="font-playfair text-lg font-semibold text-[#413625]"
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: i * 0.3 }}
                        viewport={{ once: true }}
                        whileInView={{ opacity: 1, y: 0 }}
                      >
                        {s.title}
                      </motion.h3>

                      <motion.div
                        className="text-gray-500 text-sm mt-4 flex-grow leading-relaxed whitespace-pre-wrap"
                        initial={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: i * 0.4 }}
                        viewport={{ once: true }}
                        whileInView={{ opacity: 1, y: 0 }}
                      >
                        {s.desc}
                      </motion.div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {!loading && services.length > 0 && (
            <>
              {/* Custom Arrows */}
              <button className="custom-prev absolute cursor-pointer -left-3 top-1/2 -translate-y-1/2 z-10 bg-[#E1CCAD] text-[#413625] p-3 rounded-full shadow hover:bg-[#d9b88f] transition">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="custom-next absolute cursor-pointer -right-3 top-1/2 -translate-y-1/2 z-10 bg-[#E1CCAD] text-[#413625] p-3 rounded-full shadow hover:bg-[#d9b88f] transition">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// Helper to keep the import clean if used elsewhere
