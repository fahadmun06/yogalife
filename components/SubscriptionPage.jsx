"use client";

import { useState, useEffect } from "react";
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
import { Spinner } from "@heroui/spinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, AlertTriangle } from "lucide-react";

import ApiFunction from "./api/apiFuntions";
import { packageApi, stripeApi } from "./api/ApiRoutesFile";

import { useAuth } from "@/hooks/useAuth";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: 0.6,
      ease: "easeOut",
    },
  },
};

export default function SubscriptionPage() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { post, get } = ApiFunction();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState(null); // 'checkout' or 'trial'

  // Payment Methods & Upgrade States
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [defaultCardId, setDefaultCardId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedPkgId, setSelectedPkgId] = useState(null);

  const subStatus = user?.subscription?.status;
  const canTrial =
    !user?.subscription?.trial?.isClaimed ||
    subStatus === "expired" ||
    subStatus === "canceled" ||
    subStatus === "free" ||
    subStatus === "none";

  const showTrialButton =
    !subStatus || ["free", "expired", "canceled", "none"].includes(subStatus);

  const selectedInfo = selectedPlan
    ? packages.find((p) => p.name.toLowerCase() === selectedPlan.toLowerCase())
    : null;

  useEffect(() => {
    fetchPackages();
    handlePaymentSuccess();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPaymentData();
    }
  }, [isAuthenticated]);

  const fetchPaymentData = async () => {
    try {
      const pmRes = await get(stripeApi.getPaymentMethods);
      const fetchedPms = pmRes.data?.data || pmRes.data || [];
      const defaultId = pmRes.data?.defaultId || null;
      setPaymentMethods(fetchedPms);
      if (defaultId) {
        setDefaultCardId(defaultId);
      } else if (fetchedPms.length > 0) {
        setDefaultCardId(fetchedPms[0].id);
      }
    } catch (err) {
      console.error("Error fetching payment methods:", err);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await get(packageApi.getAll);

      if (res.success) {
        setPackages(res.data);
      }
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  const handlePaymentSuccess = async () => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const sessionId = params.get("session_id");

    if (success === "true" && sessionId) {
      try {
        const res = await post(stripeApi.confirmSubscription, { sessionId });

        if (res.success) {
          toast.success("Subscription confirmed! Welcome aboard.");
          router.push("/dashboard");
        }
      } catch {
        toast.error("Failed to confirm subscription.");
      }
    }
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  const handleConfirmUpgrade = async () => {
    if (!defaultCardId) return;

    try {
      setActionLoading(true);
      const res = await post(stripeApi.upgradeWithSavedCard, {
        packageId: selectedPkgId,
        paymentMethodId: defaultCardId,
      });

      if (res.success) {
        toast.success("Upgrade successful!");
        setIsConfirmModalOpen(false);
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Payment failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setActionLoading(true);
      await post(stripeApi.cancelSubscription);
      toast.success("Subscription canceled successfully");
      setIsCancelModalOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to cancel subscription",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleTrialAction = async () => {
    if (!isAuthenticated) return router.push("/auth/login");

    const status = user?.subscription?.status;
    if (status === "paused") {
      setLoading(true);
      setActionType("trial");
      try {
        const res = await post(stripeApi.resumeTrial);
        if (res.success) {
          updateUser(res.data);
          toast.success("Trial resumed!");
        }
      } catch {
        toast.error("Failed to resume trial.");
      } finally {
        setLoading(false);
        setActionType(null);
      }
      return;
    }

    if (status === "trialing") {
      setLoading(true);
      setActionType("trial");
      try {
        const res = await post(stripeApi.pauseTrial);
        if (res.success) {
          updateUser(res.data);
          toast.success("Trial paused.");
        }
      } catch {
        toast.error("Failed to pause trial.");
      } finally {
        setLoading(false);
        setActionType(null);
      }
      return;
    }

    // Otherwise, open modal to select a plan for the 7-day trial
    setIsTrialModalOpen(true);
  };

  const getTrialButtonLabel = () => {
    const status = user?.subscription?.status;
    const isClaimed = user?.subscription?.trial?.isClaimed;

    if (
      !isClaimed ||
      status === "expired" ||
      status === "canceled" ||
      status === "none" ||
      status === "free"
    )
      return "START YOUR 7 DAY FREE TRIAL";
    if (status === "trialing") return "PAUSE YOUR TRIAL";
    if (status === "paused") return "RESUME YOUR TRIAL";

    return "START YOUR 7 DAY FREE TRIAL";
  };

  const handlePlanSelection = async (pkg) => {
    if (!isAuthenticated) return router.push("/auth/login");

    try {
      setLoading(true);
      setActionType("checkout");
      setSelectedPlan(pkg.name);
      setIsTrialModalOpen(false);

      if (
        user?.subscription?.status === "active" ||
        user?.subscription?.status === "trialing"
      ) {
        const isCurrent =
          (user?.subscription?.billing?.planId?._id ||
            user?.subscription?.billing?.planId) === pkg._id;

        if (isCurrent) {
          setIsCancelModalOpen(true);
          setLoading(false);
          setActionType(null);
          return;
        }

        if (paymentMethods.length > 0 && defaultCardId) {
          setSelectedPkgId(pkg._id);
          setIsConfirmModalOpen(true);
          setLoading(false);
          setActionType(null);
          return;
        }
      }

      const res = await post(stripeApi.createSubscriptionSession, {
        packageId: pkg._id,
        trialEnabled: canTrial,
      });

      if (res.success && res.id) {
        const stripe = await stripePromise;
        if (!stripe) throw new Error("Stripe failed to initialize");
        await stripe.redirectToCheckout({ sessionId: res.id });
      } else {
        throw new Error(res.message || "Checkout failed");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Checkout error",
      );
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  const PricingCard = ({ pkg, isPopular = false }) => {
    const isCurrent =
      (user?.subscription?.billing?.planId?._id ||
        user?.subscription?.billing?.planId) === pkg._id &&
      (subStatus === "active" || subStatus === "trialing");

    const hasActiveSubscription =
      subStatus === "active" || subStatus === "trialing";

    return (
      <motion.div
        key={pkg._id}
        className={`w-full max-w-[340px] bg-[#EFE6F5] rounded-[32px] p-2 md:p-2.5 shadow-[12px_12px_24px_#d9cddc,-12px_-12px_24px_#ffffff] h-full flex flex-col relative ${isPopular ? "md:scale-105 z-10" : ""}`}
        variants={cardVariants}
      >
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#DCCAE5] shadow-[3px_3px_6px_#d1c2d3,-3px_-3px_6px_#ffffff] text-[#4A3B4C] text-[10.5px] font-bold tracking-[0.15em] uppercase py-1.5 px-6 rounded-full z-20 whitespace-nowrap font-sans">
            Most Popular
          </div>
        )}
        <div className="border-[1.5px] border-[#d1c2d3]/50 rounded-[24px] h-full flex flex-col items-center px-6 py-8 pb-6 text-center bg-[#EFE6F5]">
          <h2 className="text-[17px] font-playfair font-semibold text-[#4A3B4C] tracking-[0.2em] uppercase">
            {pkg.name}
          </h2>
          <div className="flex items-center justify-center w-full my-4 opacity-70">
            <div className="h-[1px] w-8 bg-[#4A3B4C]" />
            <div className="w-[5px] h-[5px] rotate-45 bg-[#4A3B4C] mx-3" />
            <div className="h-[1px] w-8 bg-[#4A3B4C]" />
          </div>
          <div className="mb-4 relative w-full flex flex-col items-center gap-1">
            <div className="flex items-baseline gap-2">
              <p className="text-[42px] font-bold text-[#4A3B4C] font-playfair leading-none">
                {pkg.price?.toLocaleString()}
              </p>
              <span className="text-lg font-semibold text-[#4A3B4C] font-sans tracking-wide">
                {pkg.currency || "JMD"}
              </span>
            </div>
            <p className="text-xs font-bold text-[#4A3B4C]/60 uppercase tracking-widest">
              per {pkg.durationType?.replace("ly", "")}
            </p>
          </div>

          {pkg.description && (
            <p className="text-sm text-[#4A3B4C]/70 mb-6 font-medium leading-relaxed">
              {pkg.description}
            </p>
          )}

          <ul className="text-[14.5px] font-medium text-[#4A3B4C]/90 space-y-3 mb-8 w-full text-left font-sans tracking-wide flex-grow">
            {pkg.features?.map((feature, fIdx) => (
              <li key={fIdx} className="flex items-start gap-3">
                <div className="w-[20px] h-[20px] rounded-full bg-[#E5D7E6] flex items-center justify-center shrink-0 mt-0.5">
                  <svg
                    className="w-3 h-3 text-[#4A3B4C]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {feature}
              </li>
            ))}
          </ul>

          <button
            className={`w-full mt-auto flex items-center justify-center cursor-pointer py-3.5 rounded-[24px] font-playfair font-semibold text-[17px] tracking-wide transition-all duration-300 ${isCurrent ? "bg-red-500 text-white shadow-md hover:bg-red-600" : isPopular ? "bg-[#B9A1C6] text-white shadow-[3px_3px_8px_#d1c2d3,-3px_-3px_8px_#ffffff] hover:bg-[#AA90AC]" : "bg-[#EBE0EC] border border-[#A78AB7] text-[#4A3B4C] shadow-[3px_3px_6px_#d1c2d3,-3px_-3px_6px_#ffffff] hover:shadow-[4px_4px_8px_#d1c2d3,-4px_-4px_8px_#ffffff]"}`}
            disabled={loading}
            onClick={() => handlePlanSelection(pkg)}
          >
            {loading &&
            actionType === "checkout" &&
            selectedPlan === pkg.name ? (
              <Spinner color="current" size="sm" />
            ) : isCurrent ? (
              "CANCEL PLAN"
            ) : hasActiveSubscription ? (
              "UPGRADE"
            ) : canTrial ? (
              "START 7 DAY FREE TRIAL"
            ) : (
              "CHOOSE PLAN"
            )}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-[90vh] bg-[#F4EDF5] py-20 px-4 md:px-8 flex flex-col items-center justify-center overflow-hidden">
      <div className="relative z-10 w-full max-w-[1100px] flex flex-col items-center">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-14 text-center flex items-center justify-center gap-4 relative"
          initial={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-3xl md:text-5xl lg:text-[44px] tracking-wide font-semibold text-[#4A3B4C] font-playfair">
            Subscription Options
          </h1>
        </motion.div>
        <motion.div
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch justify-items-center justify-center w-full gap-8 mb-16"
          initial="hidden"
          variants={containerVariants}
        >
          {packages.map((pkg) => (
            <PricingCard
              key={pkg._id}
              isPopular={pkg.durationType === "quarterly"}
              pkg={pkg}
            />
          ))}
        </motion.div>

        {showTrialButton && (
          <motion.div
            animate="visible"
            className="w-full max-w-[560px] mt-2 mb-8 h-fit"
            initial="hidden"
            variants={buttonVariants}
          >
            <button
              className="w-[95%] mx-auto flex items-center justify-center cursor-pointer bg-[#EBE0EC] border border-[#A78AB7] text-[#4A3B4C] px-8 py-4 text-lg font-playfair font-bold tracking-[0.15em] rounded-[16px] transition-all duration-300 shadow-[4px_4px_8px_#d1c2d3,-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#d1c2d3,-6px_-6px_12px_#ffffff] active:shadow-[inset_3px_3px_6px_#d1c2d3,inset_-3px_-3px_6px_#ffffff] uppercase"
              disabled={loading}
              onClick={handleTrialAction}
            >
              {loading && actionType === "trial" ? (
                <Spinner color="primary" size="md" />
              ) : (
                getTrialButtonLabel()
              )}
            </button>
          </motion.div>
        )}
      </div>

      {/* Already Active Plan Modal */}
      <Modal
        isOpen={isModalOpen}
        scrollBehavior="inside"
        backdrop="blur"
        size="md"
        onClose={onCloseModal}
      >
        <ModalContent className="bg-white">
          <ModalHeader className="border-b border-gray-100">
            <h2 className="text-xl font-semibold text-[#4A3B4C] font-playfair">
              Existing Subscription
            </h2>
          </ModalHeader>
          <ModalBody className="py-6">
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <h3 className="text-sm font-bold text-[#4A3B4C] mb-2 uppercase tracking-widest">
                  Active Plan
                </h3>
                <p className="text-lg font-semibold text-purple-800">
                  {user?.subscription?.billing?.planId?.name || "Premium Plan"}
                </p>
                <p className="text-xs text-[#4A3B4C]/60 mt-1">
                  Expiring:{" "}
                  {new Date(
                    user?.subscription?.billing?.endDate,
                  ).toLocaleDateString()}
                </p>
              </div>
              <p className="text-sm text-[#4A3B4C]/70 text-center">
                Your current plan is still active. To change plans, please wait
                until the end of your current cycle.
              </p>
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-gray-100">
            <Button color="primary" variant="flat" onPress={onCloseModal}>
              Got it
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Select Plan Modal (For Trial) */}
      <Modal
        isOpen={isTrialModalOpen}
        scrollBehavior="inside"
        size="5xl"
        onClose={() => setIsTrialModalOpen(false)}
      >
        <ModalContent className="bg-[#F8F4F9]">
          <ModalHeader className="flex flex-col items-center pt-8">
            <h2 className="text-3xl font-playfair font-bold text-[#4A3B4C]">
              Select Your Trial Plan
            </h2>
            <p className="text-[#4A3B4C]/60 text-sm mt-1">
              Choose the plan you want to experience for 7 days
            </p>
          </ModalHeader>
          <ModalBody className="py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch justify-items-center">
              {packages.map((pkg) => (
                <PricingCard
                  key={pkg._id}
                  isPopular={pkg.durationType === "quarterly"}
                  pkg={pkg}
                />
              ))}
            </div>
          </ModalBody>
          <ModalFooter className="pb-8">
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsTrialModalOpen(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirm Upgrade Modal */}
      <Modal
        backdrop="blur"
        isOpen={isConfirmModalOpen}
        size="md"
        className="font-poppins"
        onClose={() => setIsConfirmModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 items-center text-center">
            <h2 className="text-2xl font-black">Confirm Upgrade</h2>
            <p className="text-zinc-500 font-medium text-sm mt-1">
              Are you sure you want to upgrade with this card?
            </p>
          </ModalHeader>
          <ModalBody className="py-2 space-y-4">
            {paymentMethods.find((pm) => pm.id === defaultCardId) && (
              <div className="p-5 rounded-2xl border-2 border-[#764979] bg-[#764979]/5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#764979] text-white">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <p className="font-black capitalize text-lg text-zinc-900 dark:text-white">
                    {
                      paymentMethods.find((pm) => pm.id === defaultCardId).card
                        .brand
                    }{" "}
                    ••••{" "}
                    {
                      paymentMethods.find((pm) => pm.id === defaultCardId).card
                        .last4
                    }
                  </p>
                  <p className="text-sm font-semibold text-zinc-500">
                    Expires{" "}
                    {
                      paymentMethods.find((pm) => pm.id === defaultCardId).card
                        .exp_month
                    }
                    /
                    {
                      paymentMethods.find((pm) => pm.id === defaultCardId).card
                        .exp_year
                    }
                  </p>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter className="flex-col gap-3 mt-4">
            <Button
              fullWidth
              className="bg-[#764979] text-white font-bold rounded-xl py-6"
              isLoading={actionLoading}
              onPress={handleConfirmUpgrade}
            >
              Confirm & Pay
            </Button>
            <Button
              fullWidth
              className="font-bold rounded-xl py-6 text-zinc-500 bg-zinc-100 dark:bg-zinc-800"
              isDisabled={actionLoading}
              variant="light"
              onPress={() => {
                setIsConfirmModalOpen(false);
                router.push("/dashboard/subscription");
              }}
            >
              Change Card
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        backdrop="blur"
        isOpen={isCancelModalOpen}
        size="md"
        className="font-poppins"
        onClose={() => setIsCancelModalOpen(false)}
      >
        <ModalContent className="rounded-[2.5rem] p-4">
          <ModalHeader className="flex flex-col gap-1 items-center text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-2">
              <AlertTriangle className="text-red-500" size={28} />
            </div>
            <h2 className="text-xl font-bold">Cancel Subscription</h2>
          </ModalHeader>
          <ModalBody className="text-center py-2 space-y-2">
            <p className="text-zinc-500 font-medium text-sm">
              Are you sure you want to cancel your subscription? You will lose
              access to premium features at the end of your billing cycle.
            </p>
          </ModalBody>
          <ModalFooter className="flex-col gap-3 mt-4">
            <Button
              fullWidth
              className="bg-red-500 text-white font-bold rounded-xl py-6"
              isLoading={actionLoading}
              onPress={handleCancel}
            >
              Yes, Cancel Subscription
            </Button>
            <Button
              fullWidth
              className="font-bold rounded-xl py-6 text-zinc-500 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200"
              isDisabled={actionLoading}
              variant="light"
              onPress={() => setIsCancelModalOpen(false)}
            >
              Keep Subscription
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
