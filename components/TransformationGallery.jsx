"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const images = [
  {
    id: 1,
    src: "/result/img2.jpg",
    alt: "Client transformation before and after",
  },
  {
    id: 2,
    src: "/result/img1.jpg",
    alt: "Weight loss transformation",
  },
];

export default function TransformationGallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  const openFullscreen = (imageId) => {
    setSelectedImage(imageId);
  };

  const closeFullscreen = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    if (selectedImage === null) return;

    const currentIndex = images.findIndex((img) => img.id === selectedImage);
    let newIndex;

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    } else {
      newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedImage(images[newIndex].id);
  };

  const selectedImageData = selectedImage
    ? images.find((img) => img.id === selectedImage)
    : null;

  return (
    <>
      <motion.h4
        className="text-sm  uppercase text-center tracking-wider text-primary"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        Transformation Gallery
      </motion.h4>
      <motion.h2
        className="text-3xl md:text-4xl text-center font-bold mb-12"
        initial={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.7 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        Pictures of client Transformation
      </motion.h2>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 mb-28 mt-12 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {images.map((image) => (
          <div
            key={image.id}
            className="group cursor-pointer overflow-hidden bg-card hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            onClick={() => openFullscreen(image.id)}
          >
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                fill
                alt={image.alt}
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                src={image.src || "/result/img1.jpg"}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            {/* <div className="p-6">
              <h3 className="font-semibold text-card-foreground mb-2 text-balance">
                {image.caption}
              </h3>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span className="font-medium">{image.clientName}</span>
                <span>{image.transformationDate}</span>
              </div>
            </div> */}
          </div>
        ))}
      </div>

      {/* Full-screen Modal */}
      {selectedImage && selectedImageData && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-10 rounded-full p-1 bg-background/90 hover:bg-background/40 shadow-lg text-popover-foreground"
              onClick={closeFullscreen}
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              className="absolute left-4 top-1/2 rounded-full p-1 -translate-y-1/2 z-10 bg-background/90 hover:bg-background/40 shadow-lg text-popover-foreground"
              onClick={() => navigateImage("prev")}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              className="absolute right-4 top-1/2 rounded-full p-1 -translate-y-1/2 z-10 bg-background/90 hover:bg-background/40 shadow-lg text-popover-foreground"
              onClick={() => navigateImage("next")}
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Main Image */}
            <div className="relative w-full h-full max-w-5xl max-h-[80vh] mx-auto">
              <Image
                fill
                priority
                alt={selectedImageData.alt}
                className="object-contain"
                sizes="100vw"
                src={selectedImageData.src || "/result/img1.jpg"}
              />
            </div>

            {/* Image Info */}
            {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-popover-foreground bg-background/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <h3 className="font-semibold text-lg mb-1">
                {selectedImageData.caption}
              </h3>
              <div className="flex items-center gap-4 text-sm opacity-90">
                <span>{selectedImageData.clientName}</span>
                <span>•</span>
                <span>{selectedImageData.transformationDate}</span>
              </div>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
}
