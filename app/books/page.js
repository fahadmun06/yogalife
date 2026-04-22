// import BooksGallery from "@/components/BooksGallery";
import PageHero from "../../components/NewSimpleUI/PageHero";

import Blog from "@/components/Blog";

export default function page() {
  // return <BooksGallery isPage={true} />;
  return (
    <div className="pt-20">
      <PageHero
        breadcrumb={[{ label: "Books", link: "/books" }]}
        subtitle="Sanctuary Fit Guides"
        title="Books"
      />
      <Blog />
    </div>
  );
}

export const metadata = {
  title: "Books | Tinashaii",
  description:
    "Take Your Yoga to the Next Level - Learn about our mission, vision, and yoga services",
};
