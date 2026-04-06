"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    title: "1:1 Health Coaching",
    desc: "Get personalized support designed around your goals and lifestyle.<br/><br/>Together, we build sustainable habits that support gut health, balanced hormones, and long-term transformation from the inside out.",
    img: "img2.jpg",
    pos: "object-center",
    isHtml: true,
    link: "#",
  },
  {
    title: "Daily Workout Videos",
    desc: "Access a full library of Pilates, Strength, Sculpt, and Stretch workouts with new classes added weekly.<br/><br/>Move anytime, anywhere. Build strength, improve alignment, and stay consistent with guided sessions designed for real results.",
    img: "yogaNew.png",
    pos: "object-center",
    isHtml: true,
    link: "#",
  },
  {
    title: "100+ Nourishing, Dietitian-Approved Recipes",
    desc: "Choose from over 100 whole-food recipes inspired by Jamaican flavors and global wellness.<br/><br/>Designed to fuel your body, balance blood sugar, and support gut health - without restriction.",
    img: "/healthy_food_bowl.webp", // Updated from generation
    pos: "object-center",
    isHtml: true,
    link: "#",
  },
  {
    title: "Destination Wellness Retreats",
    desc: "Escape to curated wellness experiences in stunning locations.<br/><br/>Move, nourish, and restore through Pilates, strength training, and holistic living practices designed to transform you from the inside out.<br/><br/>🌿 Limited spaces available.<br/>✨ Join the retreat waitlist.",
    img: "img8.jpg",
    pos: "object-center",
    isHtml: true,
    link: "#",
  },
];

export default function ServicesSectionNew() {
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
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mt-2 text-[#413625]">
            Whenever You Need It
          </h2>
          <p className="mt-4 text-gray-600 ">
            Your wellness journey should flow with your life - not compete with
            it. Our programs are accessible anywhere, anytime. Whether
            you&apos;re at home, traveling, or on the go, you&apos;ll stay
            consistent without feeling restricted.
          </p>
        </motion.div>

        {/* Slider */}
        <div className="relative">
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
            loop={true}
            modules={[Navigation, Autoplay]}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            slidesPerView={1}
            spaceBetween={24}
          >
            {services.map((s, i) => (
              <SwiperSlide key={i} className="py-3 px-0 h-full">
                <motion.div
                  className="bg-[#FCF6F5] rounded-tl-[50px] rounded-2xl rounded-tr-none  overflow-hidden group transition border border-gray-200 shadow-sm hover:shadow-md h-full flex flex-col"
                  initial={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div className="overflow-hidden relative">
                    <img
                      alt={s.title}
                      className={`w-full h-52 ${s.pos || "object-center"} ${s.img !== "Picture2.jpg " ? "object-cover" : "object-contain"}  group-hover:scale-105 transition-transform duration-500`}
                      src={s.img}
                    />
                    {/* {s.img === "Picture2.jpg" && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-white opacity-50"></div>
                    )} */}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <motion.h3
                      className="font-playfair text-lg font-semibold"
                      initial={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: i * 0.3 }}
                      viewport={{ once: true }}
                      whileInView={{ opacity: 1, y: 0 }}
                    >
                      {s.title}
                    </motion.h3>

                    <motion.div
                      className="text-gray-500 text-sm mt-4 flex-grow leading-relaxed"
                      initial={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, delay: i * 0.4 }}
                      viewport={{ once: true }}
                      whileInView={{ opacity: 1, y: 0 }}
                    >
                      {s.isHtml ? (
                        <div dangerouslySetInnerHTML={{ __html: s.desc }} />
                      ) : (
                        s.desc
                      )}
                    </motion.div>

                    {/* Button fixed bottom */}
                    {/* <motion.a
                      className="mt-6 inline-block bg-[#E1CCAD] cursor-pointer rounded-tl-3xl rounded-br-3xl text-[#413625] px-6 py-3 font-medium transition hover:bg-[#d9b88f] self-start"
                      href={s.link}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Read More
                    </motion.a> */}
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Arrows */}
          <button className="custom-prev absolute cursor-pointer -left-3 top-1/2 -translate-y-1/2 z-10 bg-[#E1CCAD] text-[#413625] p-3 rounded-full shadow hover:bg-[#d9b88f] transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="custom-next absolute cursor-pointer -right-3 top-1/2 -translate-y-1/2 z-10 bg-[#E1CCAD] text-[#413625] p-3 rounded-full shadow hover:bg-[#d9b88f] transition">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
