/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-unknown-property */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addToast } from "@heroui/toast";
import { Spinner } from "@heroui/spinner";

import { supportApi } from "../api/ApiRoutesFile";
import ApiFunction from "../api/apiFuntions";
import { useLandingPage } from "../../hooks/useLandingPage";

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
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { post } = ApiFunction();
  const { getRetro } = useLandingPage();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const retroContent = await getRetro();

        if (retroContent) {
          setContent(retroContent);
        }
      } catch (error) {
        console.error("Error fetching retro content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Send message to support backend
      const payload = {
        firstName: data.name,
        lastName: "Retro Signup",
        email: data.email,
        phone: data.phone,
        message: "User signed up via The Butterfly Sanctuary form.",
      };
      const response = await post(supportApi.create, payload);

      if (response && response.success) {
        addToast({
          title: "Success",
          description: "Successfully joined The Butterfly Sanctuary!",
          color: "success",
        });
        reset();
        setShowForm(false);
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to join. Please try again.",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!loading && content) {
    return (
      <section className="relative bg-white pt-20 md:pt-28 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            dangerouslySetInnerHTML={{ __html: content }}
            className="retro-content"
            initial={{ opacity: 0, y: 30 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          />
        </div>
        <style global jsx>{`
          .retro-content h1 {
            font-size: 2.25rem;
            font-weight: 800;
            color: #1a202c;
            text-align: center;
            margin-bottom: 2rem;
          }
          .retro-content h2 {
            font-size: 1.875rem;
            font-weight: 700;
            color: #2d3748;
            margin-top: 2rem;
            margin-bottom: 1.5rem;
          }
          .retro-content p {
            margin-bottom: 1.25rem;
            line-height: 1.75;
            color: #4a5568;
            font-size: 1.125rem;
          }
          .retro-content ul {
            list-style-type: none;
            padding: 0;
            margin-bottom: 2rem;
          }
          .retro-content li {
            margin-bottom: 1rem;
            position: relative;
            padding-left: 1.5rem;
          }
          .retro-content li:before {
            content: "●";
            position: absolute;
            left: 0;
            color: #4a3b4c;
          }
          .retro-content img {
            max-width: 100%;
            height: auto;
            border-radius: 1rem;
            margin: 2.5rem 0;
          }
          .retro-content span.text-primary {
            color: #4a3b4c;
          }
        `}</style>
      </section>
    );
  }

  return (
    <section className="relative bg-white pt-20 md:pt-28 overflow-hidden">
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
              className={`w-full text-white py-2 rounded-lg mt-4 transition-all flex items-center justify-center gap-2 ${
                isSubmitting
                  ? "bg-primary/70 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              }`}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <Spinner color="white" size="sm" />
              ) : (
                "Start My Wellness Journey"
              )}
            </button>
          </motion.form>
        )}
      </div>

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
              What You&apos;ll Get Inside
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
