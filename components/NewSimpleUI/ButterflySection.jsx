"use client";

import { useEffect, useMemo, useState } from "react";
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

  const normalizedContent = useMemo(() => {
    if (!data?.content || typeof window === "undefined") return data?.content || "";

    const root = document.createElement("div");

    root.innerHTML = data.content;

    const allowedClasses = new Set([
      "image",
      "image-style-side",
      "image-style-align-left",
      "image-style-align-right",
      "custom-button",
    ]);

    root.querySelectorAll("*").forEach((el) => {
      el.removeAttribute("style");

      const className = el.getAttribute("class");

      if (className) {
        const filtered = className
          .split(/\s+/)
          .filter((cls) => allowedClasses.has(cls))
          .join(" ");

        if (filtered) {
          el.setAttribute("class", filtered);
        } else {
          el.removeAttribute("class");
        }
      }
    });

    return root.innerHTML;
  }, [data?.content]);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl space-y-4">
          <Skeleton className="h-10 w-3/4 max-w-md mx-auto rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-5/6 rounded-lg" />
        </div>
      </section>
    );
  }

  // If no content is available, we can show a placeholder or nothing
  if (!data?.content) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-white overflow-visible">
      <div className="container mx-auto px-6 max-w-4xl dynamic-content-container flow-root overflow-visible">
        <motion.div
          dangerouslySetInnerHTML={{ __html: normalizedContent }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-xl prose-purple max-w-none w-full dynamic-content-wrapper"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        />
        <style>{`
          .dynamic-content-container {
            overflow: visible !important;
            height: auto !important;
            min-height: 0 !important;
          }
          .dynamic-content-wrapper {
            color: #4a5568;
            display: flow-root;
            overflow: visible !important;
            height: auto !important;
            max-height: none !important;
            min-height: 0 !important;
          }
          .dynamic-content-wrapper * {
            max-width: 100%;
            box-sizing: border-box;
            word-break: break-word;
          }
          /* Prevent pasted HTML (absolute/fixed elements) from escaping layout */
          .dynamic-content-wrapper [style*="position:absolute"],
          .dynamic-content-wrapper [style*="position: absolute"],
          .dynamic-content-wrapper [style*="position:fixed"],
          .dynamic-content-wrapper [style*="position: fixed"] {
            position: static !important;
            top: auto !important;
            right: auto !important;
            bottom: auto !important;
            left: auto !important;
          }
          .dynamic-content-wrapper [style*="transform"] {
            transform: none !important;
          }
          .dynamic-content-wrapper > * {
            clear: both;
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
          .dynamic-content-wrapper::after {
            content: "";
            display: block;
            clear: both;
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
