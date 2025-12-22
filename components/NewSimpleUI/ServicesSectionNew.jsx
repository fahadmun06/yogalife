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
    desc: "Get personalized support designed around your lifestyle, goals, and challenges. Together, we’ll focus on building sustainable habits that fuel your body, support your wellness, and create lasting transformation from the inside out.",
    img: "img2.jpg",
    link: "#",
  },
  {
    title: "Daily Workouts Videos",
    desc: "Workout Video Library. Access a complete library of Pilates, Strength, Yoga, Sweat, Power, and Stretch workouts, with fresh content added every week. Enjoy daily workout videos that blend Pilates and strength training to keep your body strong, balanced, and energized. Move anytime, anywhere, and experience the freedom of making movement a part of your daily life.",
    img: "img3.jpg",
    link: "#",
  },
  {
    title: "100+ Dietitian-Approved Recipes",

    desc: "Choose from over 100 nourishing meal plans featuring whole foods, Jamaican-inspired dishes, and delicious vegan, pescatarian, vegetarian, and gluten-free options all designed to fuel your body and support gut health.",

    img: "/books/img5.jpg",
    link: "#",
  },
  {
    title: "Pilates x Strength x Sculpt at Rehab Oasis Studio",
    desc: "Join us for <strong>Pilates sessions, strength training, and sculpting movements</strong> designed to tone, strengthen, and energize your body. Whether you’re looking to improve flexibility, build strength, or move mindfully, our sessions at Rehab Oasis Studio crafted to help you feel your best. <br /> <br /> <strong>Move. Strengthen. Sculpt. Transform.</strong>",
    img: "img2.jpg",
    isHtml: true,
    link: "#",
  },
  {
    title: "Wellness Club",
    desc: "<strong>Step into your holistic sanctuary, a space where wellness meets joy. Move, breathe, and strengthen your body with our Pilates classes, dive into nourishing workshops, and recharge with rejuvenating retreats. <br /> <br /> Our Wellness Club is more than just a program, it's a community, a lifestyle, and your personal hub for feeling vibrant, balanced, and fully alive. <br /> <br /> Come for the movement. Stay for the magic. Join the Wellness Club</strong>",
    img: "Picture2.jpg",
    isHtml: true,
    link: "#",
  },
  {
    title: "Supportive Community",
    desc: "Stay accountable with a comment section for connection and wins. Plus, enjoy access to a LIVE community workout to keep the energy high.",
    img: "img8.jpg",
    link: "#",
  },
];

export default function ServicesSectionNew() {
  return (
    <section className="py-20 bg-white relative">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14"
          initial={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h4 className="text-sm uppercase tracking-wider text-primary ">
            Our Services
          </h4>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mt-2">
            Get Coach Wherever You Want Whenever You Need
          </h2>
          <p className="mt-4 text-gray-600 ">
            Your wellness journey should fit seamlessly into your life. That’s
            why our programs are fully accessible anytime, anywhere — whether
            you’re at home, traveling, or on the go. With flexible coaching,
            guided workouts, nourishing meal plans, and mindfulness tools, you
            can stay consistent without feeling restricted.
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
              <SwiperSlide key={i} className="py-3 px-2 h-full">
                <motion.div
                  className="bg-white rounded-tl-[50px] rounded-br-[50px] overflow-hidden group transition border border-gray-200 shadow-sm hover:shadow-lg h-full flex flex-col"
                  initial={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  viewport={{ once: true }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  {/* Image */}
                  <div className="overflow-hidden relative">
                    <img
                      alt={s.title}
                      className={`w-full h-60 ${s.img !== "Picture2.jpg " ? "object-cover" : "object-contain"}  group-hover:scale-105 transition-transform duration-500`}
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

                    <motion.p
                      className="text-gray-500 text-sm mt-2 flex-grow"
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
                    </motion.p>

                    {/* Button fixed bottom */}
                    <motion.a
                      className="mt-6 inline-block bg-[#E1CCAD] cursor-pointer rounded-tl-3xl rounded-br-3xl text-[#413625] px-6 py-3 font-medium transition hover:bg-[#d9b88f] self-start"
                      href={s.link}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Read More
                    </motion.a>
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
