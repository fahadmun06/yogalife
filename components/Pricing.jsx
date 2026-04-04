"use client";

import { Calendar, Star, Crown, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Weekly",
    price: "$20",
    desc: "Pay as you go, weekly access",
    icon: (
      <Calendar className="w-10 h-10 text-purple-700 dark:text-purple-400" />
    ),
    features: ["3 Yoga Classes", "Community Access", "Basic Support"],
  },
  {
    name: "Monthly",
    price: "$45",
    desc: "Perfect for regular yogis",
    icon: <Star className="w-10 h-10 text-yellow-500 dark:text-yellow-400" />,
    popular: true,
    features: ["12 Yoga Classes", "Priority Booking", "Meditation Sessions"],
  },
  {
    name: "Yearly",
    price: "$165",
    desc: "Best value for long-term commitment",
    icon: <Crown className="w-10 h-10 text-pink-600 dark:text-pink-400" />,
    features: [
      "Unlimited Classes",
      "1-on-1 Coaching",
      "Exclusive Retreats",
      "Premium Support",
    ],
  },
];

export default function Pricing() {
  const roter = useRouter();

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-purple-100 via-pink-50 to-white dark:from-black dark:via-black dark:to-black">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-900 dark:text-white mb-14">
          Our Pricing Plans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-3xl p-[2px] transition-all duration-500 transform hover:scale-105 hover:-rotate-1 ${plan.popular
                  ? "bg-gradient-to-r from-purple-500 to-pink-400 dark:from-purple-700 dark:to-pink-700 shadow-2xl"
                  : "bg-gradient-to-r from-purple-200/60 to-pink-100/60 dark:from-white/5 dark:to-white/5 shadow-lg"
                }`}
            >
              <div className="rounded-3xl p-8 h-full flex flex-col items-center justify-between bg-white/80 dark:bg-white/5 backdrop-blur-md shadow-inner">
                {plan.popular && (
                  <span className="absolute -top-4 bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-700 dark:to-pink-600 text-white text-xs font-semibold px-5 py-1 rounded-full shadow-md">
                    Most Popular
                  </span>
                )}
                <div className="mb-6">{plan.icon}</div>
                <h3 className="text-2xl font-semibold text-purple-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-purple-700 dark:text-gray-300 mb-6">
                  {plan.desc}
                </p>
                <p className="text-5xl font-extrabold text-purple-950 dark:text-white mb-8 drop-shadow-sm">
                  {plan.price}
                </p>

                {/* Features */}
                <ul className="text-left text-purple-800 dark:text-gray-300 mb-8 space-y-3">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  className={`px-8 py-3 text-lg rounded-xl shadow-xl transition-all ${plan.popular
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-700 dark:to-pink-600 hover:from-purple-800 hover:to-pink-700 text-white"
                      : "bg-gradient-to-r from-purple-400 to-purple-600 dark:from-purple-600 dark:to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white"
                    }`}
                  onClick={() => roter.push("/auth/login")}
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
