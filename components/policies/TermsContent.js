/* eslint-disable react/no-unknown-property */
"use client";

import React, { useState, useEffect } from "react";
import { Skeleton } from "@heroui/skeleton";
import PageHero from "@/components/NewSimpleUI/PageHero";
import ApiFunction from "@/components/api/apiFuntions";
import { policyApi } from "@/components/api/ApiRoutesFile";

export default function TermsContent() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { get } = ApiFunction();

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await get(policyApi.get("terms"));
        if (res && res.success) {
          setContent(res.data?.content || "");
        }
      } catch (error) {
        console.error("Error fetching terms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      <PageHero
        breadcrumb={[
          { label: "Home", link: "/" },
          { label: "Terms of Service", link: "/terms" },
        ]}
        subtitle="Our terms and conditions for using the platform"
        title="Terms of Service"
      />

      <div className="container mx-auto px-6 max-w-4xl mt-16">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-5/6 rounded-lg" />
            <Skeleton className="h-64 w-full rounded-xl mt-8" />
          </div>
        ) : content ? (
          <div
            className="prose prose-purple max-w-none prose-headings:font-playfair prose-headings:text-[#4A3B4C] prose-p:text-gray-600 prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 italic">
              Terms of Service content is currently unavailable.
            </p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .prose h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-bottom: 2rem;
        }
        .prose h2 {
          font-size: 1.875rem;
          font-weight: 600;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
        }
        .prose h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .prose p {
          margin-bottom: 1.25rem;
          font-size: 1.125rem;
        }
        .prose ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .prose li {
          margin-bottom: 0.5rem;
        }
        .prose strong {
          color: #4a3b4c;
        }
      `}</style>
    </div>
  );
}
