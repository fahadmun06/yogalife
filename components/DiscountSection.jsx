"use client";

import { useUser } from "@/context/UserContext";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);


export default function DiscountSection() {
  const { user } = useUser();
  const router = useRouter();
  
  async function handleCheckout(plan) {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    // console.log("user", user);
    try {
      // Check if user already has an active subscription
      if (user?.packageDetails && user.packageDetails.subStatus === "active") {
        setSelectedPlan(plan);
        setIsModalOpen(true);

        return;
      }

      // Store selected plan details in localStorage for success page
      const planDetails = {
        packageName:
          plan === "monthly"
            ? "Monthly Plan"
            : plan === "quarterly"
              ? "Quarterly Plan"
              : "Yearly Plan",
        duration: plan === "monthly" ? 30 : plan === "quarterly" ? 90 : 455,
        price: plan === "monthly" ? 7500 : plan === "quarterly" ? 22500 : 75500,
        planType: plan,

        currency: "JMD",
        trialDaysLeft: 7,
        trialStatus: "active",
        selectedAt: new Date().toISOString(),
      };

      localStorage.setItem("selectedPlan", JSON.stringify(planDetails));
      console.log("Stored plan details:", planDetails);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          userId: user.uid,
          userEmail: user.email,
        }),
      });

      const contentType = res.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await res.text();

        throw new Error(text?.slice(0, 300) || "Unexpected non-JSON response");
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Failed to create session");

      const stripe = await stripePromise;

      if (!stripe) throw new Error("Stripe failed to initialize");

      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (err) {
      console.error("Checkout error:", err);
      toast.warning(err?.message || "Something went wrong starting checkout.");
    }
  }

  return (
    <div className="my-10">
      <section
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/discount-bg.png')", // 🔥 replace with your background image
        }}
      >
        <div className="container mx-auto text-center px-4">
          {/* Main Heading */}
          <motion.h2 className="text-4xl md:text-5xl font-bold leading-snug text-gray-900">
            Lock in a full year of coaching for just{" "}
            <span className="text-primary">$75,000</span> and get{" "}
            <span className="text-primary">3 months FREE!</span>
          </motion.h2>

          <motion.p className="mt-6 text-lg max-w-3xl mx-auto text-gray-800">
            That’s unlimited guidance, support, and results – your best
            investment in health and wellness.
          </motion.p>

          <motion.ul className="mt-8 space-y-3 text-left max-w-3xl mx-auto text-lg text-gray-700">
            <li>
              ✔ A library of workouts to help you lose weight, get toned, and
              reshape your body.
            </li>
            <li>
              ✔ Over 100 meal guides and weekly plans designed to fuel your
              body without restrictions or overwhelm.
            </li>
            <li>
              ✔ Choose from Jamaican, Mediterranean, Keto, Paleo, Vegan, and
              Vegetarian to fit your lifestyle and taste.
            </li>
            <li>
              ✔ Coaching ✔ Workouts ✔ Meal Plan ✔ Holistic Wellness ✔
              Recovery ✔ Community
            </li>
          </motion.ul>

          {/* CTA Button */}
          <motion.button
            className="mt-10 cursor-pointer inline-block bg-primary hover:bg-[#E1CCAD] hover:text-black text-white font-semibold py-3 px-8 rounded-tl-3xl rounded-br-3xl shadow-lg transition"
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            onClick={() => handleCheckout("yearly")}
            onKeyDown={() => handleCheckout("yearly")}
          >
            Get Started
          </motion.button>
        </div>
      </section>
    </div>
  );
}
