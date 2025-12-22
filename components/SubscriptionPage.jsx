"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

import { useRouter } from "next/navigation";

import { useUser } from "@/context/UserContext";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

export default function SubscriptionPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.8,
        type: "spring",
        stiffness: 100,
      },
    },
  };
  const onCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  // derive selected plan details for the modal
  const selectedInfo = selectedPlan
    ? {
        name:
          selectedPlan === "monthly"
            ? "Monthly Plan"
            : selectedPlan === "quarterly"
            ? "Quarterly Plan"
            : "Yearly Plan",
        price:
          selectedPlan === "monthly"
            ? 7500
            : selectedPlan === "quarterly"
            ? 22500
            : 75500,
        durationDays:
          selectedPlan === "monthly" ? 30 : selectedPlan === "quarterly" ? 90 : 365,
      }
    : null;

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
        duration: plan === "monthly" ? 30 : plan === "quarterly" ? 90 : 365,
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
      alert(err?.message || "Something went wrong starting checkout.");
    }
  }

  return (
    <div className=" relative my-12 overflow-hidden flex flex-col items-center justify-center p-8">
      <svg className="absolute" height="0" width="0">
        <defs>
          <clipPath id="cloudClip">
            <path d="M19.35 10.04A7 7 0 0 0 5.64 9.6 5.5 5.5 0 0 0 6 20h13a4 4 0 0 0 .35-9.96z" />
          </clipPath>
        </defs>
      </svg>

      {/* <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100" />
      <div className="absolute inset-0 bg-[#d4b5a0]" /> */}
      <div className="absolute inset-0 bg-primary" />
      <div className="absolute inset-0 bg-white/50" />

      {/* Content wrapper with relative positioning */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Title */}
        <motion.h1
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-black  mb-16 text-center"
          initial={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Subscription Options
        </motion.h1>
        {/* <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-[#6b574a] mb-10 space-y-2"
        >
          <li>• Monthly Membership – 7,500 JMD</li>
          <li>• Quarterly Membership – 22,500 JMD (Save 1 month)</li>
          <li>• Yearly Membership – 75,500 JMD (Best Value – Save 3 months)</li>
        </motion.ul> */}

        {/* Pricing Cards Container */}
        <motion.div
          animate="visible"
          className="flex items-end mx-auto  w-full flex-wrap gap-8 mb-16"
          initial="hidden"
          variants={containerVariants}
        >
          <motion.div className="relative mx-auto" variants={cardVariants}>
            <motion.div
              className="bg-white rounded-full w-48 h-48 flex flex-col font-poppins items-center justify-center shadow-lg cursor-pointer"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCheckout("monthly")}
            >
              <h2 className="text-xl font-semibold font-poppins text-black mb-2">
                MONTHLY
              </h2>
              <p className="text-base font-bold text-black">7,500 JMD</p>
            </motion.div>
            {/* <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2"
            >
              <svg className="w-32 h-auto text-[#c2a187]" viewBox="0 0 24 24">
                <defs>
                  <filter
                    id="cloudShadow1"
                    x="0"
                    y="0"
                    width="200%"
                    height="200%"
                    filterUnits="userSpaceOnUse"
                  >
                    <feDropShadow
                      dx="0"
                      dy="2"
                      stdDeviation="2"
                      floodColor="black"
                      floodOpacity="0"
                    />
                  </filter>
                </defs>

                <path
                  d="M19.35 10.04A7 7 0 0 0 5.64 9.6 5.5 5.5 0 0 0 6 20h13a4 4 0 0 0 .35-9.96z"
                  fill="currentColor"
                  filter="url(#cloudShadow1)"
                />
              </svg>
            </motion.div> */}
          </motion.div>

          <motion.div className="relative mx-auto" variants={cardVariants}>
            <motion.div
              className="bg-white  w-48 h-48 flex flex-col font-poppins items-center justify-center shadow-lg cursor-pointer"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCheckout("quarterly")}
            >
              <h2 className="text-xl font-semibold font-poppins text-black mb-2">
                QUARTERLY
              </h2>
              <p className="text-base font-bold text-black">22,500 JMD</p>
            </motion.div>
            <motion.div
              animate={{ scale: 1 }}
              className="absolute -bottom-12 left-10 transform translate-x-1/2 scale-90"
              initial={{ scale: 0 }}
              transition={{ delay: 1, type: "spring", stiffness: 200 }}
            >
              <svg className="w-28 h-auto text-[#c2a187]" viewBox="0 0 24 24">
                <defs>
                  <filter
                    filterUnits="userSpaceOnUse"
                    height="200%"
                    id="cloudShadow"
                    width="200%"
                    x="0"
                    y="0"
                  >
                    <feDropShadow
                      dx="0"
                      dy="2"
                      floodColor="black"
                      floodOpacity="0.1"
                      stdDeviation="2"
                    />
                  </filter>
                </defs>

                <path
                  d="M19.35 10.04A7 7 0 0 0 5.64 9.6 5.5 5.5 0 0 0 6 20h13a4 4 0 0 0 .35-9.96z"
                  fill="currentColor"
                  filter="url(#cloudShadow)"
                />

                <text
                  className="fill-black font-bold"
                  fontSize="3"
                  textAnchor="middle"
                  x="13"
                  y="16"
                >
                  Save 1 month
                </text>
              </svg>
            </motion.div>
          </motion.div>

          <motion.div className="relative mx-auto" variants={cardVariants}>
            <motion.div
              className="bg-white rounded-full w-48 h-48 flex flex-col items-center justify-center shadow-lg cursor-pointer"
              style={{
                transform: "scale(0.9)",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCheckout("yearly")}
            >
              <h2 className="text-xl font-semibold font-poppins text-black mb-2">
                YEARLY
              </h2>
              <p className="text-base font-bold font-poppins text-black">
                75,500 JMD
              </p>
            </motion.div>
            <motion.div
              animate={{ scale: 1 }}
              className="absolute -bottom-12 left-1/4 w-full transform translate-x-1/4 scale-90"
              initial={{ scale: 0 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
            >
              <svg className="w-28 h-auto text-[#c2a187]" viewBox="0 0 100 100">
                <defs>
                  <filter
                    filterUnits="userSpaceOnUse"
                    height="200%"
                    id="cloudShadow3"
                    width="200%"
                    x="0"
                    y="0"
                  >
                    <feDropShadow
                      dx="0"
                      dy="2"
                      floodColor="black"
                      floodOpacity="0.3"
                      stdDeviation="2"
                    />
                  </filter>
                </defs>

                <path
                  d="M80 40A25 25 0 0 0 20 38 18 18 0 0 0 22 80h56a15 15 0 0 0 2-40z"
                  fill="currentColor"
                  filter="url(#cloudShadow3)"
                />

                <text
                  className="fill-black font-bold"
                  fontSize="12"
                  textAnchor="middle"
                  x="50"
                  y="60"
                >
                  Save 3 months
                </text>
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          animate="visible"
          initial="hidden"
          variants={buttonVariants}
        >
          <button
            className="bg-white shadow-lg cursor-pointer  border border-[#6b574a] text-[#6b574a]  px-8 py-3 text-sm font-semibold rounded-lg  transition-all duration-200"
            size="lg"
            onClick={() => handleCheckout("monthly")}
          >
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              START YOUR 7 DAY FREE TRIAL
            </motion.span>
          </button>
        </motion.div>
      </div>

      {/* Active Subscription Modal */}
      <Modal
        classNames={{
          base: "bg-white",
          header: "border-b border-gray-200",
          body: "py-4",
          footer: "border-t border-gray-200",
        }}
        isOpen={isModalOpen}
        scrollBehavior="inside"
        size="md"
        onClose={onCloseModal}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-10 hidden min-h-10 bg-green-100 rounded-full md:flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  You Already Have an Active Plan
                </h2>
                <p className="text-xs text-gray-600">
                  Review your current plan and the new plan you selected
                </p>
              </div>
            </div>
          </ModalHeader>

          <ModalBody>
            {user?.packageDetails && (
              <div className="space-y-4">
                {/* Current Plan Details */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        clipRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        fillRule="evenodd"
                      />
                    </svg>
                    Current Active Plan
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-gray-600">Plan</span>
                        <p className="text-sm font-semibold text-gray-900">
                          {user.packageDetails.packageName}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-600">Price</span>
                        <p className="text-sm font-semibold text-green-600">
                          JMD {user.packageDetails.price?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-gray-600">Status</span>
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800">
                          {user.packageDetails.subStatus === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-600">Days Left</span>
                        <p className="text-sm font-semibold text-blue-600">
                          {user.packageDetails.daysLeft || 0} days
                        </p>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <span className="text-xs font-medium text-gray-600">Expires</span>
                      <p className="text-xs text-gray-900">
                        {user.packageDetails.endDate
                          ? new Date(user.packageDetails.endDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selected Plan Details */}
                {selectedInfo && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          clipRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          fillRule="evenodd"
                        />
                      </svg>
                      Plan You Selected
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{selectedInfo.name}</p>
                        <p className="text-xs text-gray-600">
                          JMD {selectedInfo.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600">Duration</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {selectedInfo.durationDays} days
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-4 w-4 text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          clipRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          fillRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-2">
                      <h3 className="text-xs font-medium text-blue-800">Your current plan is still active</h3>
                      <p className="mt-1 text-xs text-blue-700">
                        You can continue using your current subscription. To change plan, wait until it expires or contact support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              className="font-medium text-sm"
              color="default"
              size="md"
              variant="light"
              onPress={onCloseModal}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
