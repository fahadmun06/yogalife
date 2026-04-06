"use client";
import PageHero from "../NewSimpleUI/PageHero";
import TestimonialsForPage from "../TestimonialsForPage";

const TestimonialsPage = () => {
  return (
    <div>
      <PageHero
        breadcrumb={[{ label: "Testimonials", link: "/testimonials" }]}
        subtitle="Practice Whereever You Want Whenever You Need"
        title="Testimonials"
      />

      <TestimonialsForPage />
    </div>
  );
};

export default TestimonialsPage;
