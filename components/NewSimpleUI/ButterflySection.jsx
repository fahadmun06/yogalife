"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@heroui/skeleton";

import { useLandingPage } from "../../hooks/useLandingPage";

export default function ButterflySection() {
  const { getButterfly } = useLandingPage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadButterfly = async () => {
      const bData = await getButterfly();

      if (bData) {
        setData(bData);
      }
      setLoading(false);
    };

    loadButterfly();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl space-y-12">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </section>
    );
  }

  // If no content is available, we can show a placeholder or nothing
  if (!data?.content) {
    return null;
  }

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl dynamic-content-container">
        <motion.div
          dangerouslySetInnerHTML={{ __html: data.content }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-xl prose-purple max-w-none dynamic-content-wrapper"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        />
        <style jsx global>{`
          .dynamic-content-wrapper {
             color: #4a5568;
          }
          .dynamic-content-wrapper h2 {
             color: #4a3b4c !important;
             font-family: serif;
             text-align: center;
             margin: 3rem 0;
          }
          .dynamic-content-wrapper p {
             text-align: center;
             line-height: 1.8;
          }
          /* CKEditor Image and Figure Handling */
          .dynamic-content-wrapper figure {
            margin: 2rem auto;
            display: table;
          }
          .dynamic-content-wrapper figure.image-style-side {
            float: right;
            margin-left: 1.5rem;
            max-width: 50%;
          }
          .dynamic-content-wrapper figure.image-style-align-left {
            float: left;
            margin-right: 1.5rem;
          }
          .dynamic-content-wrapper figure.image-style-align-right {
            float: right;
            margin-left: 1.5rem;
          }
          .dynamic-content-wrapper img {
            max-width: 100%;
            height: auto;
            border-radius: 1rem;
            display: block;
            margin: 0 auto;
          }
          .dynamic-content-wrapper p img {
             display: inline-block;
             margin: 10px;
             vertical-align: middle;
          }
          .dynamic-content-container .custom-button {
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
            display: table; /* For centering if needed, or just block */
            text-align: center;
          }
          .dynamic-content-container .custom-button:hover {
            background-color: #3b2f3d;
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
          }
        `}</style>
      </div>
    </section>
  );
}
