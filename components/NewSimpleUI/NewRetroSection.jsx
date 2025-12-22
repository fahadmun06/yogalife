"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ Yup validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required").min(3, "Name too short"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^\+?\d{10,15}$/, "Enter valid phone number")
    .required("Phone number is required"),
});

export default function NewRetroSection() {
  const [showForm, setShowForm] = useState(false);

  // ✅ react-hook-form setup
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  const onSubmit = (data) => {
    console.log("Form submitted:", data);

    // Simple success feedback
    alert("🎉 Successfully joined The Butterfly Sanctuary!");
    reset();
    setShowForm(false);
  };

  return (
    <section className="relative bg-white pt-20 md:pt-28 overflow-hidden">
      <motion.img
        alt="left design"
        animate={{ opacity: 1, x: 0 }}
        className="absolute left-0 top-10 hidden md:block"
        height={236}
        initial={{ opacity: 0, x: -80 }}
        src="https://designingmedia.com/yogastic/wp-content/uploads/2022/07/hero-left-design-1.png"
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        width={233}
      />

      <motion.img
        alt="right design"
        animate={{ opacity: 1, x: 0 }}
        className="absolute right-0 top-20 hidden md:block"
        height={267}
        initial={{ opacity: 0, x: 80 }}
        src="https://designingmedia.com/yogastic/wp-content/uploads/2022/07/hero-right-design-1.png"
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        width={193}
      />

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-800"
          initial={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Transform Your Health with{" "}
          <span className="text-primary">The Butterfly Sanctuary</span>
        </motion.h1>

        <motion.p
          className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          Holistic Health 🌿 Your All-in-One Wellness Coaching
        </motion.p>

        <motion.p
          className="mt-4 text-gray-500 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1 }}
        >
          No more confusion. No more trying to figure it out alone. This
          membership gives you{" "}
          <span className="font-semibold text-gray-700">
            everything you need
          </span>{" "}
          to heal your gut, build strength, stay consistent, and feel
          amazing—all in one place.
        </motion.p>

        {/* CTA Button */}
        {!showForm && (
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {/* <button
              onClick={() => setShowForm(true)}
              className="inline-block bg-primary text-white px-8 py-3 rounded-tl-2xl rounded-br-2xl shadow-md hover:bg-primary/90 transition-all duration-300"
            >
              JOIN THE SANCTUARY
            </button> */}
          </motion.div>
        )}

        {/* Form (only shows if user clicked) */}
        {showForm && (
          <motion.form
            animate={{ opacity: 1, y: 0 }}
            className="relative mt-10 max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-6 text-left"
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Cancel / Close Icon */}
            <button
              className="absolute cursor-pointer top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              type="button"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-1">
                Name
              </label>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full border rounded-lg px-3 py-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your name"
                    type="text"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-1">
                Email
              </label>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full border rounded-lg px-3 py-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your email"
                    type="email"
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-1">
                Phone
              </label>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <input
                    {...field}
                    className="w-full border rounded-lg px-3 py-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your phone number"
                    type="tel"
                  />
                )}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              className="w-full bg-primary text-white py-2 rounded-lg mt-4 hover:bg-primary/90 transition-all"
              type="submit"
            >
              Start My Wellness Journey
            </button>
          </motion.form>
        )}
      </div>

      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent z-0" />

      <div className="relative bg-white py-16 md:py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What You'll Get Inside
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your membership includes:
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <ul className="space-y-4 text-left">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-lg">●</span>
                <span className="text-gray-700 leading-relaxed">
                  <strong>1:1 Health Coaching</strong> – A monthly check-in call
                  to keep you on track with personalized guidance
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-lg">●</span>
                <span className="text-gray-700 leading-relaxed">
                  <strong>Daily Workout Videos</strong> – Pilates, Strength,
                  Yoga, Stretch, and more—new content added weekly
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-lg">●</span>
                <span className="text-gray-700 leading-relaxed">
                  <strong>Nutrition & Meal Support</strong> – 100+
                  dietitian-approved, wholefood recipes including
                  Jamaican-inspired, vegan, pescatarian, vegetarian &
                  gluten-free options
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-lg">●</span>
                <span className="text-gray-700 leading-relaxed">
                  <strong>Gut Healing Guidance</strong> – Tools for digestion,
                  bloating, reflux, and supplement support
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-lg">●</span>
                <span className="text-gray-700 leading-relaxed">
                  <strong>Workshops & Resources</strong> – Covering wellness,
                  mindset, cycle tracking & habit-building
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold text-lg">●</span>
                <span className="text-gray-700 leading-relaxed">
                  <strong>Accountability & Support</strong> – Monthly progress
                  tracking plus quick WhatsApp/Email support
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
