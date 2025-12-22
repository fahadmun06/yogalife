"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Shanae",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "I've tried so many diets and nothing ever stuck. Tina’s program was different. It was personal and practical. The gut health focus blew my mind! My skin is clearer, I sleep better, and I finally have a flat tummy again. I feel like myself for the first time in years. This is life-changing!",
  },
  {
    name: "Kemar Davis",
    img: "https://randomuser.me/api/portraits/men/76.jpg",
    text: "Hello, I was introduced to gut health strategies that have improved my digestive system so I’m pleased about that. Yes I did find the resources and coaching very valuable.",
  },
  {
    name: "SandyL",
    img: "https://randomuser.me/api/portraits/women/52.jpg",
    text: "When I started Tina’s weightloss coaching program, at first I was skeptical like most people would be. However, once I booked that consultation call and learned about the phenomenal transformation in her weight loss journey, both mind and body, I was convinced.",
  },
  {
    name: "Adrene Wright",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "I am very satisfied, the sessions provided me with valuable information and insights. I have been able to make the necessary adjustments in my lifestyle and I’m already seeing results. Tina is a health coach, she is very knowledgeable and supportive!",
  },
  {
    name: "Imani Biggs",
    img: "https://randomuser.me/api/portraits/women/40.jpg",
    text: "I was very happy with Tina—she’s an incredible coach who’s truly passionate about her clients. Her 1-on-1 sessions were extremely informative, and she made the weight loss process simple by breaking it down step by step.",
  },
];

function StarRating() {
  return (
    <div className="flex gap-1 text-yellow-400">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Star key={i} fill="currentColor" size={16} stroke="none" />
        ))}
    </div>
  );
}

export default function Testimonials() {
  const swiperRef = useRef(null);

  return (
    <section className="py-16">
      <div className="container relative mx-auto px-4">
        <motion.h4
          className="text-sm uppercase text-center tracking-wider text-primary"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Testimonials
        </motion.h4>
        <motion.h2
          className="text-3xl md:text-4xl text-center font-bold mb-12"
          initial={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.7 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          What Our Clients Saying
        </motion.h2>

        {/* Swiper */}
        <Swiper
          autoplay={{ delay: 4000 }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          loop={true}
          modules={[Autoplay, Pagination]}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
            bulletClass: "swiper-pagination-bullet !bg-gray-400",
            bulletActiveClass: "swiper-pagination-bullet-active !bg-primary",
          }}
          slidesPerView={1}
          spaceBetween={20}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <motion.div
                className="bg-primary/10 border border-primary/20 p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col h-full"
                initial={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                {/* Stars */}
                <StarRating />

                {/* User Info */}
                <div className="flex items-center gap-3 my-3">
                  <img
                    alt={t.name}
                    className="w-12 h-12 rounded-full border-2 border-primary"
                    src={t.img}
                  />
                  <p className="font-semibold text-black">{t.name}</p>
                </div>

                {/* Full Text */}
                <p className="text-sm text-black/80">{t.text}</p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination below cards */}
        <div className="custom-pagination flex justify-center mt-6" />
      </div>
    </section>
  );
}
