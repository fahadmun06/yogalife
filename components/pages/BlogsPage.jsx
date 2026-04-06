"use client";
import PageHero from "../NewSimpleUI/PageHero";
import BlogSection from "../Blog";

const BlogsPage = () => {
  return (
    <div>
      <PageHero
        breadcrumb={[{ label: "Blogs", link: "/blogs" }]}
        subtitle="Practice Whereever You Want Whenever You Need"
        title="Blogs"
      />

      <BlogSection />
    </div>
  );
};

export default BlogsPage;
