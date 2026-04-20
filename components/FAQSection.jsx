"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { Skeleton } from "@heroui/skeleton";

import { useLandingPage } from "../hooks/useLandingPage";

import DiscountSection from "./DiscountSection";
import PageHero from "./NewSimpleUI/PageHero";

const staticFaqs = [
  {
    question: "How does 1:1 Health Coaching work?",
    answer:
      "You’ll get personalized guidance tailored to your goals. We meet virtually (via Zoom/WhatsApp), set action steps, and check in weekly or monthly depending on your package. I’ll be your accountability partner every step of the way.",
  },
  {
    question: "Do I need to be flexible to start yoga or Pilates?",
    answer:
      "Not at all! These practices are about building strength, mobility, and alignment. Flexibility comes with consistency, so you can start at any level.",
  },
  {
    question: "Will I get my own meal and workout plan?",
    answer:
      "Yes. Depending on your package, you’ll receive personalized nutrition guidance and structured workout plans that fit your lifestyle, preferences, and fitness level.",
  },
  {
    question: "Are online consultations available?",
    answer:
      "Yes, everything is online. You can access coaching, workouts, and meal guidance from anywhere in the world.",
  },
  {
    question: "What should I bring to a yoga or Pilates session?",
    answer:
      "Just a mat, comfortable clothing, water, and an open mind. For at-home workouts, I’ll also show you how to use household items if you don’t have equipment.",
  },
  {
    question: "Do you offer group classes as well?",
    answer:
      "Yes. In addition to 1:1 coaching, you’ll have access to group workout sessions and a supportive community where we connect, share progress, and encourage each other.",
  },
  {
    question: "Can this help me if I want to lose weight or back fat?",
    answer:
      "Yes. The workouts and meal plans are designed for toning, gut health, and body recomposition — not just weight loss. The focus is on healing and strength, not quick fixes.",
  },
  {
    question: "I’m vegetarian/pescatarian — can this still work for me?",
    answer:
      "Absolutely! Many of my recipes and meal guides are Jamaican-inspired and include vegetarian, vegan, and pescatarian options.",
  },
  {
    question: "What if I have gut issues like bloating or acid reflux?",
    answer:
      "This program is designed with gut health in mind. You’ll learn what foods trigger symptoms, how to eat for digestion, and natural ways to heal your gut.",
  },
  {
    question: "How much support do I get outside of coaching calls?",
    answer:
      "Depending on your package, you’ll have access to WhatsApp or email support for quick questions, plus ongoing accountability check-ins.",
  },
  {
    question: "Do I need gym equipment?",
    answer:
      "No. Most workouts are bodyweight-based (Pilates, strength training, mobility). If you have dumbbells or bands, you can use them, but they aren’t required.",
  },
  {
    question: "Is this program beginner-friendly?",
    answer:
      "Yes. Whether you’re just starting or have been active for years, the workouts and coaching are adaptable to your level.",
  },
  {
    question: "How soon will I see results?",
    answer:
      "Everyone is different, but most clients notice improved energy, better digestion, and more strength within the first 4–6 weeks. Sustainable results come with consistency.",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Yes, flexible payment options are available depending on the package you choose.",
  },
  {
    question: "Is this only for women?",
    answer:
      "No, my programs are open to both men and women who are committed to improving their health and lifestyle.",
  },
];

// Hero UI Accordion Component
const Accordion = ({ children, type = "single", className = "" }) => {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
};

const AccordionItem = ({ children, value, className = "" }) => {
  return (
    <div
      className={`border cursor-pointer border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {children}
    </div>
  );
};

const AccordionTrigger = ({ children, isOpen, onClick, className = "" }) => {
  return (
    <button
      className={`flex justify-between cursor-pointer items-center w-full px-6 py-4 text-left font-medium text-gray-900 hover:text-gray-700 focus:outline-none transition-colors ${className}`}
      onClick={onClick}
    >
      <span className="text-sm font-medium leading-6">{children}</span>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        className="flex-shrink-0 ml-4"
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <ChevronDown className="h-5 w-5 text-gray-500" />
      </motion.div>
    </button>
  );
};

const AccordionContent = ({ children, isOpen, className = "" }) => {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          animate={{
            height: "auto",
            opacity: 1,
            transition: {
              height: { duration: 0.3, ease: "easeInOut" },
              opacity: { duration: 0.2, delay: 0.1 },
            },
          }}
          className="overflow-hidden"
          exit={{
            height: 0,
            opacity: 0,
            transition: {
              height: { duration: 0.3, ease: "easeInOut" },
              opacity: { duration: 0.2 },
            },
          }}
          initial={{ height: 0, opacity: 0 }}
        >
          <div
            className={`px-6 pb-4 text-sm text-gray-600 leading-relaxed ${className}`}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function FAQSection() {
  const { getFaqs } = useLandingPage();
  const [data, setData] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFaqs = async () => {
      const res = await getFaqs();

      if (res && res.length > 0) {
        setData(res);
      } else {
        setData(staticFaqs);
      }
      setLoading(false);
    };

    loadFaqs();
  }, [getFaqs]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <PageHero
        breadcrumb={[{ label: "FAQ'S", link: "/faq" }]}
        subtitle="Frequently Asked Questions"
        title="FAQ'S"
      />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          {/* Heading */}
          <motion.h4
            className="text-lg font-semibold text-primary"
            initial={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            FAQ'S
          </motion.h4>

          <motion.h2
            className="text-3xl md:text-4xl font-bold mt-2"
            initial={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.7 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            FAQ’s – Frequently Asked Questions
          </motion.h2>

          <motion.p
            className="mt-4 text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.9 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            Learn how our Mind-Body Reset program, daily workouts, mindfulness
            tools, and supportive community can help you restore balance,
            improve strength, and feel at home in your body.
          </motion.p>

          {/* Hero UI Accordion */}
          <div className="mt-10 text-left">
            {loading ? (
              <div className="w-full max-w-3xl mx-auto space-y-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <Accordion className="w-full max-w-3xl mx-auto" type="single">
                {data.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileInView={{ opacity: 1, y: 0 }}
                  >
                    <AccordionItem value={`item-${index}`}>
                      <AccordionTrigger
                        isOpen={openIndex === index}
                        onClick={() => toggleFAQ(index)}
                      >
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent isOpen={openIndex === index}>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </section>

      {/* DiscountSection placeholder - replace with actual component */}
      <DiscountSection />
    </div>
  );
}
