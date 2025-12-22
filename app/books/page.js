import React from "react";

import BooksGallery from "@/components/BooksGallery";

export default function page() {
  return <BooksGallery isPage={true} />;
}

export const metadata = {
  title: "Books | Tinashaii",
  description:
    "Take Your Yoga to the Next Level - Learn about our mission, vision, and yoga services",
};
