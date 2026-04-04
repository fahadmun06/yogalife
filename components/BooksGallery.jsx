"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addToast } from "@heroui/toast";

export default function BooksGallery({ isPage = false }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();

  const images = isPage
    ? [
      {
        id: 1,
        src: "/books/img1.jpg",
        alt: "How to Create A Balance Plated",
        caption: "How to Create A Balance Plated",
        transformationDate: "2025",
        pdfFile: "/pdf/HowtoCreateaBalancePlate.pdf",
      },
      {
        id: 2,
        src: "/books/img2.jpg",
        alt: "Nutrition Guidance Guide",
        caption: "Nutrition Guidance Guide",
        transformationDate: "2025",
        pdfFile: "/pdf/NutritionGuidanceGuide.pdf",
      },
      {
        id: 3,
        src: "/books/im3.jpg",
        alt: "The ultimate Meal Guid",
        caption: "The ultimate Meal Guid",
        transformationDate: "2025",
        pdfFile: "/pdf/HowtoCreateaBalancePlate.pdf",
      },
      {
        id: 4,
        src: "/books/img4.jpg",
        alt: "NUTRITION,WELLNESS & FITNESS GUIDE",
        caption: "NUTRITION,WELLNESS & FITNESS GUIDE",
        transformationDate: "2025",
        pdfFile: "/pdf/The Ultimate Meal Plan.pdf",
      },
      //   {
      //     id: 4,
      //     src: "/books/img4.jpg",
      //     alt: "THE ULTIMATE GUIDE TO OPTIMAL GUT HEALTH",
      //     caption: "THE ULTIMATE GUIDE TO OPTIMAL GUT HEALTH",
      //     transformationDate: "2025",
      //     pdfFile: "/pdfs/UltimateGutHealingGuide.pdf",
      //   },
    ]
    : [
      {
        id: 1,
        src: "/books/img1.jpg",
        alt: "How to Create A Balance Plated",
        caption: "How to Create A Balance Plated",
        transformationDate: "2025",
        pdfFile: "/pdf/HowtoCreateaBalancePlate.pdf",
      },
      {
        id: 2,
        src: "/books/img2.jpg",
        alt: "Nutrition Guidance Guide",
        caption: "Nutrition Guidance Guide",
        transformationDate: "2025",
        pdfFile: "/pdf/NutritionGuidanceGuide.pdf",
      },
    ];

  const openFullscreen = (imageId) => {
    setSelectedImage(imageId);
  };

  const closeFullscreen = () => {
    setSelectedImage(null);
  };

  const downloadPDF = async (pdfFile, caption) => {
    try {
      const res = await fetch(pdfFile, { method: "HEAD" });

      if (!res.ok) {
        addToast({
          title: "File not found! Please try again later.",
          color: "danger",
          description: "Please try again later.",
        });

        return;
      }

      const link = document.createElement("a");

      link.href = pdfFile;
      link.download = `${caption.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast({
        title: "File downloaded successfully!",
        color: "success",
        description: "Please check your downloads folder.",
      });
    } catch (error) {
      console.error("Download error:", error);
      addToast({
        title: "Something went wrong while downloading the file.",
        color: "danger",
        description: "Please try again later.",
      });
    }
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
      {isPage && (
        <section
          className="relative bg-no-repeat bg-right md:bg-center bg-cover min-h-[80vh] h-[70vh] flex items-center justify-center py-32"
          style={{
            backgroundImage: "url(/unnamed.jpg)",
          }}
        >
          {/* Soft overlay to ensure readability while keeping the image visible */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm md:backdrop-blur-none" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center md:-mt-10"
              initial={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl md:text-7xl font-playfair font-bold text-[#4A3B4C] mb-4 tracking-wide">
                Books
              </h1>
              <p className="text-lg md:text-2xl font-playfair mb-8 max-w-2xl mx-auto text-[#6A5A6D]">
                Sanctuary Fit Guides
              </p>
              <div className="flex justify-center items-center">
                <nav className="breadcrumb bg-[#A38B9B]/90 backdrop-blur-sm px-6 py-2 rounded-lg shadow-sm text-white font-medium tracking-wide">
                  <Link
                    className="hover:text-gray-200 transition-colors"
                    href="/"
                  >
                    Home
                  </Link>
                  <span className="mx-3 font-light">/</span>
                  <Link
                    className="hover:text-gray-200 transition-colors"
                    href="/books"
                  >
                    Books
                  </Link>
                </nav>
              </div>
            </motion.div>
          </div>
        </section>
      )}
      <motion.h4
        className={
          isPage
            ? "text-sm mt-10 uppercase text-center tracking-wider text-primary"
            : "text-sm uppercase text-center tracking-wider text-primary"
        }
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        EBOOKS
      </motion.h4>
      <motion.h2
        className="text-3xl md:text-4xl text-center font-bold mb-12"
        initial={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.7 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        Sanctuary Fit Guides
      </motion.h2>
      {/* Gallery Grid */}
      <div
        className="
      mb-28 mt-12"
      >
        <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {images.map((image) => (
            <div
              key={image.id}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-card hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] relative"
              onClick={() => setSelectedImage(image.id)}
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  fill
                  alt={image.alt}
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  src={image.src || "/books/img1.jpg"}
                  onClick={() => openFullscreen(image.id)}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    className="bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground p-2 rounded-full shadow-lg transition-colors duration-200"
                    title="Download PDF"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadPDF(image.pdfFile, image.caption);
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-card">
                <h3 className="font-semibold text-sm mb-2">{image.caption}</h3>
                <button
                  className="w-full bg-primary cursor-pointer hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                  onClick={() => downloadPDF(image.pdfFile, image.caption)}
                >
                  <Download className="h-4 w-4" />
                  Download PDF Guide
                </button>
              </div>
            </div>
          ))}
        </div>
        {!isPage && (
          <div className="flex mt-8 justify-center items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <button
                className="inline-block cursor-pointer mx-auto bg-primary text-white px-8 py-3 rounded-tl-2xl rounded-br-2xl shadow-md hover:bg-primary/90 transition-all duration-300"
                onClick={() => router.push("/books")}
              >
                See All Books
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Full-screen Modal */}
      {selectedImage && selectedImageData && (
        <div className="fixed inset-0  z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              className="absolute cursor-pointer top-4 right-4 z-10 bg-background/80 hover:bg-background/40 text-popover-foreground p-2 rounded-full"
              onClick={closeFullscreen}
            >
              <X className="h-6 w-6" />
            </button>

            <button
              className="absolute cursor-pointer top-4 right-16 z-10 bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-full"
              title="Download PDF"
              onClick={() =>
                downloadPDF(
                  selectedImageData.pdfFile,
                  selectedImageData.caption,
                )
              }
            >
              <Download className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              className="absolute cursor-pointer left-1 top-1/2 -translate-y-1/2 z-10 bg-background/90 hover:bg-background/40 shadow-lg text-popover-foreground p-1 rounded-full"
              onClick={() => navigateImage("prev")}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              className="absolute cursor-pointer right-1 top-1/2 -translate-y-1/2 z-10 bg-background/90 hover:bg-background/40 shadow-lg text-popover-foreground p-1 rounded-full"
              onClick={() => navigateImage("next")}
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Main Image */}
            <div className="relative rounded-3xl w-full h-full max-w-5xl max-h-[80vh] mx-auto">
              <Image
                fill
                priority
                alt={selectedImageData.alt}
                className="object-contain rounded-3xl"
                sizes="100vw"
                src={selectedImageData.src || "/books/img1.jpg"}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
