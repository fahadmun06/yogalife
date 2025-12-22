"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function PricingSectionNew() {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
    }),
  };

  return (
    <section
      className="py-16 bg-white text-center relative overflow-hidden"
      id="pricing"
    >
      <div className="container mx-auto ">
        {/* Decorative Side Images */}
        <motion.img
          alt="decoration"
          className="absolute top-10 left-0 w-[100px] md:w-[150px] lg:w-[200px] opacity-90 pointer-events-none select-none"
          initial={{ opacity: 0, x: -40 }}
          src="https://designingmedia.com/yogastic/wp-content/uploads/2022/07/left-design-testimonial-1.png"
          transition={{ duration: 0.8 }}
          whileInView={{ opacity: 1, x: 0 }}
        />

        {/* Section Heading */}
        <motion.h4
          className="text-primary font-medium tracking-wider uppercase"
          initial={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          WHAT WE OFFER
        </motion.h4>

        <motion.h2
          className="text-3xl md:text-4xl font-bold font-playfair mt-2"
          initial={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.8 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Our Pricing Plans
        </motion.h2>

        <motion.p
          className="max-w-2xl mx-auto mt-4 text-gray-600"
          initial={{ opacity: 0 }}
          transition={{ duration: 1 }}
          whileInView={{ opacity: 1 }}
        >
          Choose the plan that fits your journey best. Whether you want
          flexibility, a structured reset, or a long-term commitment — we’ve got
          you covered.
        </motion.p>

        {/* Pricing Cards */}
        <div className="grid w-full mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 relative z-10">
          {[
            {
              title: "Monthly Membership",
              price: "9,500 JMD",
              img: "img7.jpg",
              heighlight: "",
              icon: "https://designingmedia.com/yogastic/wp-content/uploads/2022/07/pricing-1-icon-1.png",
              features: [
                "1:1 Health Coaching (2 calls per month)",
                "Daily Workout Videos (Pilates + Strength-based)",
                "Jamaican-inspired Meal Guide (easy, budget-friendly options)",
                "Gut Healing Basics (bloating, acid reflux, digestion tools)",
                "WhatsApp/Email Support for quick questions",
              ],
              duration: "/per month",
            },
            {
              title: "Quarterly Membership",
              price: "19,000 JMD",
              img: "img5.jpg",
              heighlight: "Save 1 month",

              icon: "https://designingmedia.com/yogastic/wp-content/uploads/2022/07/pricing-2-icon-1.png",
              features: [
                "1:1 Health Coaching (weekly calls)",
                "Daily Workout Videos (strength, mobility & toning)",
                "Customized Whole-Foods Meal Plan (Jamaican + pescatarian/vegetarian friendly)",
                "Gut Healing Toolkit (supplement guidance, bloating support, food swaps)",
                "Mindfulness & Stress-Relief Tools (breathwork, journaling prompts)",
                "Monthly Check-ins & Progress Tracking",
                "Access to Supportive Community",
              ],
              duration: "/per 4 months",
            },
            {
              title: "Yearly Membership",
              price: "95,000 JMD",
              img: "img11.jpg",
              heighlight: "Best Value – Save 3 months",
              icon: "https://designingmedia.com/yogastic/wp-content/uploads/2022/07/pricing-3-icon-1.png",
              features: [
                "1:1 Health Coaching (unlimited text support + weekly video calls)",
                "Personalized Daily Workout Plan (tailored to goals & injuries)",
                "Fully Customized Nutrition Coaching (meal plans, grocery lists, gut-healing recipes)",
                "Deep Gut Healing Protocol (supplement support, reset strategy, food sensitivity guidance)",
                "Weekly Progress Tracking & Adjustments",
                "Exclusive Online Workshops (mindset, hormone balance, holistic wellness)",
                "24/7 Support & Accountability Partner",
              ],
              duration: "/per year",
            },
          ].map((plan, i) => (
            <motion.div
              key={i}
              className="bg-white shadow-md transition-all duration-200 ease-in-out hover:shadow-lg rounded-tl-[50px] rounded-br-[50px] overflow-hidden relative flex flex-col"
              custom={i}
              initial="hidden"
              variants={cardVariants}
              viewport={{ once: true }}
              whileInView="visible"
            >
              {/* Top Image */}
              <img
                alt={plan.title}
                className="w-full h-52 object-cover"
                src={plan.img}
              />

              {/* Icon */}
              <motion.img
                alt="Icon"
                className="w-20 h-20 mx-auto -mt-10"
                initial={{ scale: 0 }}
                src={plan.icon}
                transition={{ duration: 0.6 }}
                whileInView={{ scale: 1 }}
              />

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl mr-2 font-semibold mt-4">
                    {plan.title}
                  </h3>
                  <p className="text-primary font-bold mt-2">
                    {plan.heighlight}
                  </p>
                  <ul className="mt-4 space-y-2 text-gray-600 text-left">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="min-w-5 max-w-5 min-h-5 max-h-5 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Fixed Section */}
                <div className="mt-6">
                  <div className="flex justify-center items-center gap-2">
                    <h2 className="text-3xl text-primary font-bold">
                      {plan.price}
                    </h2>
                  </div>
                  <p className="text-gray-500 mt-2">{plan.duration}</p>

                  <motion.a
                    className="mt-6 inline-block w-auto rounded-tl-2xl rounded-br-2xl bg-[#E1CCAD] text-[#413625] px-6 py-2 hover:text-white hover:bg-primary transition text-center"
                    href="/contact"
                  >
                    Enroll Now
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
