/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import { Play, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/spinner";

import ApiFunction from "@/components/api/apiFuntions";

export default function PremiumHero() {
  const router = useRouter();
  const { get } = ApiFunction();
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const res = await get("/banner?type=premium");

      if (res.success && res.data) {
        setBanner(res.data);
      }
    } catch {
      // Silence error log for now
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-[92vh] overflow-hidden flex flex-col justify-center">
      {/* Background Texture Overlay */}
      <div
        className="absolute inset-0 opacity-100 pointer-events-none"
        style={{
          backgroundImage: `url("/bg-premium.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          mixBlendMode: "multiply", // This helps it blend with any base color if needed
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-16 relative z-10 pt-12 md:pt-20 pb-20 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-[45%] z-10 flex flex-col items-center md:items-start text-center md:text-left gap-4 md:gap-6 pt-10"
          initial={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.8 }}
        >
          {banner?.premiumLeftContentMode === "custom" ? (
            <>
              {banner.premiumCustomTitle ? (
                <motion.h1
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-playfair font-black text-[#4A3B4C] leading-tight max-w-xl"
                  initial={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                >
                  {banner.premiumCustomTitle}
                </motion.h1>
              ) : null}
              {banner.premiumCustomDescription ? (
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  className="text-base md:text-lg text-[#4A3B4C]/85 max-w-xl leading-relaxed whitespace-pre-wrap font-poppins"
                  initial={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                >
                  {banner.premiumCustomDescription}
                </motion.p>
              ) : null}
              {(banner.premiumCtaText || banner.premiumCtaRoute) && (
                <Button
                  className="bg-[#6D735C] text-white px-8 py-7 rounded-xl font-medium text-lg hover:bg-[#5a604b] transition-all shadow-md mt-2 font-poppins"
                  onPress={() => {
                    const raw =
                      banner.premiumCtaRoute?.trim() || "/premium/workouts";

                    if (
                      raw.startsWith("http://") ||
                      raw.startsWith("https://")
                    ) {
                      window.open(raw, "_blank", "noopener,noreferrer");
                    } else {
                      router.push(raw.startsWith("/") ? raw : `/${raw}`);
                    }
                  }}
                >
                  {banner.premiumCtaText?.trim() || "View Workouts"}
                </Button>
              )}
            </>
          ) : (
            <>
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 relative ml-[-10px] md:ml-[-20px]"
                initial={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <img
                  alt="Butterfly Sanctuary Logo"
                  className="rounded-2xl w-full max-w-[320px] sm:max-w-[420px] md:max-w-[500px] lg:max-w-[600px] h-auto object-contain object-left"
                  src="/premium-hero.png"
                  style={{
                    mixBlendMode: "multiply",
                  }}
                />
              </motion.div>

              <Button
                className="bg-[#6D735C] text-white px-8 py-7 rounded-xl font-medium text-lg hover:bg-[#5a604b] transition-all shadow-md mt-4 font-poppins"
                onPress={() => router.push("/premium/workouts")}
              >
                View Workouts
              </Button>
            </>
          )}
        </motion.div>

        {/* Right Image/Video Placeholder */}
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="w-full md:w-[55%] z-10 relative flex justify-center pt-8 md:pt-0"
          initial={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative rounded-[24px] md:rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] group bg-white aspect-[4/3] w-full max-w-[650px]">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Spinner color="secondary" />
              </div>
            ) : isPlaying && banner?.videoUrl ? (
              <div className="w-full h-full relative group">
                <video
                  autoPlay
                  controls
                  className="w-full h-full object-cover"
                  src={banner.videoUrl}
                >
                  <track kind="captions" />
                </video>
                <button
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-20"
                  onClick={() => setIsPlaying(false)}
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div
                className="w-full h-full cursor-pointer relative"
                role="button"
                tabIndex={0}
                onClick={() => setIsPlaying(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setIsPlaying(true);
                  }
                }}
              >
                <img
                  alt={banner?.title || "Workout Preview"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src={banner?.thumbnailUrl || "/aboutnew.jpg"}
                />

                {/* Play Button Overlay - Matching the clear style in screenshot */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 group-hover:bg-black/10 transition-all">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play
                      className="text-gray-400 fill-gray-400 ml-1 opacity-80"
                      size={32}
                    />
                  </div>
                </div>

                {!banner?.videoUrl && !loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-bold">
                      Intro video not found
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
