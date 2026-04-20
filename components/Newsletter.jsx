"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import { newsletterApi } from "./api/ApiRoutesFile";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    title: "Get the Latest Updates With Our Newsletter",
    subtitle: "SUBSCRIBE NOW",
    backgroundImage: "/newsletternew.jpg",
    buttonText: "Subscribe",
    placeholder: "Enter Your Email",
  });

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:9000/api";
        const response = await axios.get(`${baseUrl}/${newsletterApi.get}`);
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching newsletter:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletter();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Assuming this logic remains the same or you want to handle it differently
    window.open(
      "https://medium.com/@tina.123.shay",
      "_blank",
      "noopener,noreferrer",
    );
    setEmail("");
  };

  if (loading) {
    return (
      <section className="relative max-w-6xl mx-auto mb-10 md:mb-0 mt-10">
        <div className="w-full h-[300px] md:h-[420px] bg-gray-200 animate-pulse md:rounded-tl-[50px] md:rounded-br-[50px]" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-3 md:px-14">
            <div className="max-w-xl space-y-6">
              <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
              <div className="h-10 w-64 bg-gray-300 rounded animate-pulse" />
              <div className="space-y-4">
                <div className="h-12 w-full max-w-sm bg-gray-300 rounded animate-pulse" />
                <div className="h-12 w-32 bg-gray-300 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative  max-w-6xl  mx-auto mb-10 md:mb-0 mt-10">
      {/* Background Image */}
      <img
        alt="Newsletter Background"
        className="w-full md:rounded-tl-[50px] md:rounded-br-[50px] h-[300px] md:h-[420px] object-[25%_75%] object-cover"
        src={data.backgroundImage}
      />
      {/* overlayblack */}
      <div className="absolute rounded-tl-[50px] rounded-br-[50px]  inset-0 bg-black opacity-50" />

      {/* Overlay Content */}
      <div className="absolute  rounded-tl-[50px] rounded-br-[50px]  inset-0 flex items-center">
        <div className="container  mx-auto px-3 md:px-14">
          <div className="max-w-xl space-y-6">
            <motion.h4
              className="text-sm font-bold tracking-widest text-white/70  uppercase"
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              {data.subtitle}
            </motion.h4>

            <motion.h2
              className="text-3xl md:text-4xl text-white font-playfair font-bold leading-snug text-left"
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              {data.title.split("<br />").map((line, index) => (
                <span key={index}>
                  {line}
                  {index !== data.title.split("<br />").length - 1 && <br />}
                </span>
              ))}
            </motion.h2>

            <motion.form
              className="flex flex-col  gap-4"
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileInView={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
            >
              <motion.input
                required
                className="flex-1 px-5 py-3 max-w-sm rounded-lg border bg-white border-gray-300 focus:ring-2 focus:ring-primary focus:outline-none transition"
                placeholder={data.placeholder}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <motion.button
                className="bg-primary cursor-pointer w-auto max-w-[200px] text-white px-6 py-3 rounded-tl-3xl rounded-br-3xl font-medium transition hover:bg-primary/90"
                type="submit"
              >
                {data.buttonText}
              </motion.button>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
}

