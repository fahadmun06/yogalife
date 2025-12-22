"use client";

import "swiper/css";
import "swiper/css/pagination";
import Testimonials from "./Testimonials";

export default function TestimonialsForPage() {
  const testimonials = [
    {
      name: "Sophia Williams",
      role: "Wellness Member",
      quote:
        "The coaching sessions gave me the clarity and confidence I needed. I finally feel in control of my health and lifestyle.",
      img: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      name: "Michael Brown",
      role: "Community Member",
      quote:
        "Daily workouts and mindfulness tools have completely shifted my energy. I feel stronger, calmer, and more present in my everyday life.",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Olivia Martinez",
      role: "Nutrition Enthusiast",
      quote:
        "The whole-food meal plan made healthy eating simple and enjoyable. I never feel restricted, only nourished and energized.",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ];

  return (
    <section
      className="relative py-24 px-6 bg-gradient-to-b from-primary/5 via-primary/10 to-primary/5  overflow-hidden"
      id="testimonial"
    >
      {/* Background floating orbs */}

      <Testimonials isPage={true} />
    </section>
  );
}
