/* eslint-disable @next/next/no-img-element */

"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useLandingPage } from "../hooks/useLandingPage";

export default function TransformationGallery() {
  const { getTransformations } = useLandingPage();
  const [images, setImages] = useState([]);
  const [settings, setSettings] = useState({
    tagline: "Transformation Gallery",
    title: "Pictures of client Transformation",
  });
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const loadTransformations = async () => {
      const data = await getTransformations();

      if (data) {
        if (data?.images) setImages(data?.images);
        if (data?.settings) setSettings(data?.settings);
      }
      setLoading(false);
    };

    loadTransformations();
  }, []);

  const openFullscreen = (imageId) => {
    setSelectedImage(imageId);
  };

  const closeFullscreen = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    if (selectedImage === null || images.length === 0) return;

    const currentIndex = images.findIndex((img) => img._id === selectedImage);
    let newIndex;

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    } else {
      newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedImage(images[newIndex]._id);
  };

  const selectedImageData = selectedImage
    ? images.find((img) => img._id === selectedImage)
    : null;

  return (
    <section className="py-20 font-poppins overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h4
          className="text-[10px] md:text-xs font-black uppercase text-center tracking-[0.3em] text-primary mb-3"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {settings.tagline}
        </motion.h4>
        <motion.h2
          className="text-3xl md:text-5xl text-center font-playfair font-black mb-16 text-black"
          initial={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {settings.title}
        </motion.h2>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center"
              >
                <ImageIcon className="text-gray-200" size={32} />
              </div>
            ))
          ) : images.length > 0 ? (
            images.map((image, i) => (
              <motion.div
                key={image._id}
                className="group cursor-pointer relative rounded-2xl overflow-hidden shadow-lg bg-gray-100 border-2 border-white"
                initial={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, scale: 1 }}
                onClick={() => openFullscreen(image._id)}
              >
                <div className="relative aspect-square">
                  <img
                    alt={image.alt || "Transformation Picture"}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    src={image.src}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-primary/10 transition-all duration-500" />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-400 italic font-medium">
              No transformations shared yet.
            </div>
          )}
        </div>
      </div>

      {/* Full-screen Modal (Lightbox) */}
      <AnimatePresence>
        {selectedImage && selectedImageData && (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <button
                className="absolute top-0 right-0 z-50 rounded-full p-2 bg-white/10 hover:bg-white/20 text-white transition-all transform hover:rotate-90"
                onClick={closeFullscreen}
              >
                <X className="h-6 w-6 md:h-8 md:w-8" />
              </button>

              {/* Navigation Buttons */}
              <button
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 bg-white/5 hover:bg-white/15 text-white transition-all shadow-2xl backdrop-blur-sm"
                onClick={() => navigateImage("prev")}
              >
                <ChevronLeft className="h-8 w-8 md:h-12 md:w-12" />
              </button>

              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 bg-white/5 hover:bg-white/15 text-white transition-all shadow-2xl backdrop-blur-sm"
                onClick={() => navigateImage("next")}
              >
                <ChevronRight className="h-8 w-8 md:h-12 md:w-12" />
              </button>

              {/* Main Image Container */}
              <motion.div
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-full h-full max-w-6xl max-h-[85vh] shadow-[0_0_100px_rgba(36,180,126,0.1)] border-8 border-white/5 rounded-2xl overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
              >
                <img
                  alt={selectedImageData.alt || "Transformation View"}
                  className="object-contain w-full h-full"
                  src={selectedImageData.src}
                />
              </motion.div>

              {/* Info Text */}
              {/* <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white/40 text-xs tracking-widest uppercase font-black italic">
                  Real Results, Real Impact
                </p>
              </div> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
