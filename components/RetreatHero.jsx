/* eslint-disable react/no-unknown-property */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Skeleton } from "@heroui/skeleton";
import { AlertCircle } from "lucide-react";

import { useLandingPage } from "../hooks/useLandingPage";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay } },
});

export default function RetreatHero() {
  const router = useRouter();
  const { getRetro } = useLandingPage();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRetro = async () => {
      const retroData = await getRetro();

      if (retroData) {
        setContent(retroData);
      }
      setLoading(false);
    };

    loadRetro();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl space-y-12">
          <Skeleton className="h-20 w-3/4 mx-auto rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="h-60 w-full rounded-xl" />
            <Skeleton className="h-60 w-full rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  if (!content) {
    return (
      <section className="py-24 bg-white flex flex-col items-center justify-center text-center">
        <div className="container mx-auto px-6 max-w-7xl flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            No data found
          </h2>
          <p className="text-gray-500 text-lg">
            Please add Retro Section from admin panels.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div
          dangerouslySetInnerHTML={{ __html: content?.content }}
          className="retreat-content"
          initial="hidden"
          variants={fadeUp(0.1)}
          viewport={{ once: true }}
          whileInView="visible"
        />

        <style global jsx>{`
          .retreat-content {
            font-family: inherit;
            color: #1a202c;
          }
          .retreat-content h1 {
            font-size: 2.25rem;
            font-weight: 800;
            color: #4a3b4c;
            text-align: center;
            margin-bottom: 3rem;
            font-family: serif;
          }
          .retreat-content h2 {
            font-size: 1.875rem;
            font-weight: 700;
            color: #4a3b4c;
            text-align: center;
            margin-bottom: 2.5rem;
            font-family: serif;
          }
          .retreat-content h3 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1a1a1a;
            margin-top: 2rem;
            margin-bottom: 1rem;
          }
          .retreat-content p {
            margin-bottom: 1.25rem;
            line-height: 1.8;
            color: #2d3748;
            font-size: 1.125rem;
          }
          .retreat-content ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin-bottom: 1.5rem;
          }
          .retreat-content li {
            margin-bottom: 0.5rem;
            color: #4a5568;
            font-size: 1.125rem;
          }
          /* CKEditor Image Handling */
          .retreat-content figure {
            margin: 2rem auto;
            display: table;
          }
          .retreat-content figure.image-style-side {
            float: right;
            margin-left: 1.5rem;
            max-width: 50%;
          }
          .retreat-content figure.image-style-align-left {
            float: left;
            margin-right: 1.5rem;
          }
          .retreat-content figure.image-style-align-right {
            float: right;
            margin-left: 1.5rem;
          }
          .retreat-content img {
            max-width: 100%;
            height: auto;
            border-radius: 0.75rem;
            display: block;
            margin: 0 auto;
          }
          .retreat-content p img {
            display: inline-block;
            margin: 10px;
            vertical-align: middle;
          }
          .retreat-content strong {
            color: #1a202c;
            font-weight: 700;
          }
          .retreat-content .custom-button {
            display: inline-block;
            cursor: pointer;
            background-color: #4a3b4c;
            color: white !important;
            padding: 1rem 2.5rem;
            text-decoration: none !important;
            border-top-left-radius: 1.5rem;
            border-bottom-right-radius: 1.5rem;
            transition: all 0.3s;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            font-weight: 600;
            margin: 2rem auto;
            display: table;
          }
          .retreat-content .custom-button:hover {
            background-color: #3b2f3d;
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          }
        `}</style>
      </div>
      {/* <motion.div
        className="text-center !mx-auto mt-16 pb-12"
        initial="hidden"
        variants={fadeUp(0.3)}
        viewport={{ once: true }}
        whileInView="visible"
      >
        <button
          className="inline-block !mx-auto cursor-pointer bg-primary text-white px-10 py-4 rounded-tl-2xl rounded-br-2xl shadow-xl hover:bg-[#4a3b4c] transition-all duration-300 font-bold tracking-wide"
          onClick={() => router.push("/auth/signup")}
        >
          JOIN THE WAIT LIST
        </button>
        <p className="text-[#4a3b4c] text-xl mt-8 font-medium italic">
          More details coming soon….
          <br />
          Secure your spot now, pay the rest later.
        </p>
      </motion.div> */}
    </section>
  );
}
