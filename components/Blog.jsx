"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BlogSection() {
  const blogs = [
    {
      id: 1,
      category: "Holistic Health",
      title:
        "10 Ways to Heal Your Gut – Tips from a Certified Holistic Health Coach",
      img: "/img11.jpg",
      link: "/blogs/gut-healing",
    },
    {
      id: 2,
      category: "Fitness",
      title: "Strength Training & Pilates: Transform Your Body Inside and Out",
      img: "/img4.jpg",
      link: "/blogs/strength-pilates",
    },
    {
      id: 3,
      category: "Nutrition",
      title:
        "Top 5 Diets to Transform Your Body: Keto, Paleo, Carnivore, Vegan, Pescatarian",
      img: "/img2.jpg",
      link: "/blogs/top-diets",
    },
  ];

  return (
    <section className="relative py-20 bg-white" id="blog_post">
      {/* Decorative BG image */}
      <img
        alt="decor"
        className="absolute top-10 right-0 w-40 md:w-60 opacity-70"
        src="https://designingmedia.com/yogastic/wp-content/uploads/2022/07/our-specialities-design-element-1.png"
      />

      <div className="container mx-auto text-center relative z-10 px-4">
        {/* Section Heading */}
        <motion.h4
          className="text-primary  font-medium tracking-wide"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          BLOG POSTS
        </motion.h4>

        <motion.h2
          className="text-3xl md:text-4xl font-playfair text-black font-bold mt-2"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Sanctuary News Feed
        </motion.h2>

        <motion.p
          className="text-gray-600 max-w-xl mx-auto mt-4"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileInView={{ opacity: 1 }}
        >
          Welcome to our Sanctuary News Feed, your go-to space for all things
          wellness, movement, and mindful living. Here, we share the latest
          updates from our studio, holistic health tips, inspiring client
          stories, and announcements about workshops, retreats, and special
          events. <br /> <br />{" "}
          <strong>
            Stay connected, stay inspired, and discover new ways to nurture your
            body, mind, and soul
          </strong>
        </motion.p>

        {/* Blog Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((blog, i) => (
            <motion.div
              key={blog.id}
              className="relative group overflow-hidden rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <img
                alt={blog.title}
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                src={blog.img}
              />

              {/* Content Overlay */}
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6 text-left">
                <span className="text-sm text-white/80">{blog.category}</span>
                <h4 className="text-lg md:text-xl font-bold text-white mt-2">
                  {blog.title}
                </h4>

                <div className="mt-4">
                  <Link
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-primary shadow-md transition-all group-hover:bg-primary group-hover:text-white"
                    href={blog.link}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
