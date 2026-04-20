"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import { useLandingPage } from "../hooks/useLandingPage";

import "swiper/css";
import "swiper/css/pagination";

const staticTestimonials = [
  {
    text: "I've tried so many programs before, but this one truly changed my life. My gut health improved, I feel stronger, and I've never been more confident!",
    rating: 5,
  },
  {
    text: "The coaching, recipes, and support made all the difference. I finally understand my body and achieved results I didn't think were possible.",
    rating: 5,
  },
  {
    text: "Professional, caring, and life-changing! Tina's program helped me transform my mind and body—highly recommend!",
    rating: 5,
  },
];

function StarRating({ rating = 5 }) {
  return (
    <div className="flex gap-1.5 justify-center text-[#FFC107] mb-5 mt-2">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Star
            key={i}
            fill={i < rating ? "currentColor" : "none"}
            size={18}
            stroke="currentColor"
            strokeWidth={1}
          />
        ))}
    </div>
  );
}

export default function Testimonials() {
  const swiperRef = useRef(null);
  const { getTestimonials } = useLandingPage();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      const testimonialsData = await getTestimonials();

      if (testimonialsData && testimonialsData?.length > 0) {
        setData(testimonialsData);
      } else {
        setData(staticTestimonials);
      }
      setLoading(false);
    };

    loadTestimonials();
  }, []);

  // Reusable Butterfly SVG for cards
  const Butterfly = ({ className, flip }) => (
    <div className={`relative ${className} ${flip ? "scale-x-[-1]" : ""}`}>
      <svg
        className="w-full h-full opacity-60"
        fill="none"
        stroke="#4a3b4c"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        viewBox="0 0 100 100"
      >
        {/* Left Wings */}
        <path
          d="M48 45 C20 40, -5 20, 15 10 C30 5, 45 20, 48 45 Z"
          fill="rgba(235,224,236,0.3)"
        />
        <path
          d="M48 45 C25 60, 5 90, 20 95 C30 100, 45 80, 48 55 Z"
          fill="rgba(235,224,236,0.3)"
        />
        <path
          d="M48 45 C30 35, 10 20, 25 15 C35 10, 45 25, 48 45"
          strokeWidth="0.4"
        />
        <path
          d="M48 45 C35 60, 15 80, 25 85 C30 90, 40 70, 48 55"
          strokeWidth="0.4"
        />
        {/* Right Wings */}
        <path
          d="M52 45 C80 40, 105 20, 85 10 C70 5, 55 20, 52 45 Z"
          fill="rgba(235,224,236,0.3)"
        />
        <path
          d="M52 45 C75 60, 95 90, 80 95 C70 100, 55 80, 52 55 Z"
          fill="rgba(235,224,236,0.3)"
        />
        <path
          d="M52 45 C70 35, 90 20, 75 15 C65 10, 55 25, 52 45"
          strokeWidth="0.4"
        />
        <path
          d="M52 45 C65 60, 85 80, 75 85 C70 90, 60 70, 52 55"
          strokeWidth="0.4"
        />
        {/* Body */}
        <path
          d="M48 35 C46 30, 54 30, 52 35 C53 45, 52 55, 50 55 C48 55, 47 45, 48 35 Z"
          fill="#4a3b4c"
          stroke="none"
        />
        {/* Antennae */}
        <path d="M49 32 C45 20, 35 12, 30 15" strokeWidth="1.2" />
        <path d="M51 32 C55 20, 65 12, 70 15" strokeWidth="1.2" />
      </svg>
    </div>
  );

  return (
    <section className="py-24 bg-gradient-to-br from-[#FDFBFD] via-[#F9F5FA] to-[#F1E8F5] relative overflow-hidden">
      {/* Background Splashes Logic (Remains identical) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute left-[20%] top-[40%] w-[60%] h-[50%] bg-[#EFE6F5] blur-[100px] rounded-full opacity-60" />
        <div className="absolute right-0 top-0 w-[40%] h-[60%] bg-[#F4EDF5] blur-[80px] rounded-full opacity-50" />
        <div className="absolute left-0 bottom-0 w-[50%] h-[50%] bg-[#DCCAE5] blur-[120px] rounded-full opacity-30" />
        <svg
          className="absolute w-[180%] md:w-[120%] h-[60%] md:h-[80%] -left-[40%] md:-left-[10%] top-[10%] opacity-40"
          preserveAspectRatio="none"
          viewBox="0 0 1000 300"
        >
          <path
            d="M0,150 C300,300 700,0 1000,150"
            fill="none"
            filter="blur(20px)"
            stroke="url(#g-swoosh1)"
            strokeWidth="60"
          />
          <defs>
            <linearGradient id="g-swoosh1" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#DCCAE5" stopOpacity="0" />
              <stop offset="50%" stopColor="#DCCAE5" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#DCCAE5" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 max-w-6xl">
        {/* Title area */}
        <div className="flex flex-col items-center mb-16">
          <motion.div
            className="flex items-center gap-4 mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#A38B9B]/50" />
            <h4 className="text-[11px] md:text-xs uppercase tracking-[0.25em] font-semibold text-[#8E7391]">
              TESTIMONIALS
            </h4>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#A38B9B]/50" />
          </motion.div>

          <motion.div
            className="relative inline-flex flex-col items-center justify-center mt-2"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-[46px] text-center font-bold text-[#1A1A1A] font-playfair tracking-wide relative z-10 px-4">
              What Our Clients Saying
            </h2>
            <div className="absolute -bottom-3 md:-bottom-4 left-0 w-[100%] h-[20px] md:h-[25px] pointer-events-none opacity-50 z-0">
              <svg
                height="100%"
                preserveAspectRatio="none"
                viewBox="0 0 500 40"
                width="100%"
              >
                <path
                  d="M100 20 Q250 40, 400 15"
                  fill="none"
                  stroke="#8E7391"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Swiper */}
        <div className="px-2 md:px-6 -mx-10 overflow-visible">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-10">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/50 backdrop-blur-sm rounded-[28px] h-[300px] animate-pulse p-8 border border-white"
                >
                  <div className="h-4 w-24 bg-gray-200 rounded mx-auto mb-6" />
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded" />
                    <div className="h-4 w-4/6 bg-gray-200 rounded mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="!pb-32 !pt-10 !px-10 !overflow-visible"
              loop={data.length > 3}
              modules={[Autoplay, Pagination]}
              pagination={{
                clickable: true,
                el: ".custom-testimonials-pagination",
                bulletClass:
                  "swiper-pagination-bullet !bg-[#D1C2D3] !w-2.5 !h-2.5 !mx-2 !opacity-100 transition-all cursor-pointer",
                bulletActiveClass:
                  "swiper-pagination-bullet-active !bg-[#8E7391] !scale-125",
              }}
              slidesPerView={1}
              spaceBetween={40}
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
              }}
            >
              {data.map((t, i) => (
                <SwiperSlide key={i} className="h-auto !overflow-visible">
                  <motion.div
                    className="bg-white rounded-[28px] shadow-[0_20px_60px_-10px_rgba(142,115,145,0.4)] h-full flex flex-col items-center px-8 py-10 relative group hover:shadow-[0_30px_80px_-12px_rgba(142,115,145,0.6)] transition-all duration-300 pointer-events-auto"
                    initial={{ opacity: 0, y: 40 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1, y: 0 }}
                  >
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#DCCAE5] blur-[20px] rounded-full opacity-30" />
                    <div
                      className={`absolute bottom-4 ${i % 3 === 2 ? "right-4 opacity-50" : "left-4 opacity-50"}`}
                    >
                      <Butterfly className="w-10 h-10" flip={i % 3 === 2} />
                    </div>
                    <div className="relative z-10 flex flex-col h-full w-full">
                      <StarRating rating={t.rating} />
                      <div className="text-[15px] sm:text-[16.5px] text-[#4A3B4C] leading-relaxed font-playfair font-medium text-center relative px-2 flex-grow mb-6 mt-2">
                        <span className="absolute -left-3 -top-2 text-5xl text-[#B9A1C6] font-serif leading-none select-none">
                          &#8220;
                        </span>
                        <span className="relative z-10 ml-2 mr-2">
                          {t.text}
                        </span>
                        <span className="text-5xl text-[#B9A1C6] font-serif leading-none select-none relative top-3 ml-1">
                          &#8221;
                        </span>
                      </div>
                      {t.name && (
                        <p className="text-center font-semibold text-[#8E7391] mt-auto">
                          — {t.name}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        <div className="custom-testimonials-pagination flex justify-center mt-2 relative z-10" />
      </div>
    </section>
  );
}
