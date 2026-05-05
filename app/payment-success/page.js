"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ApiFunction from "../../components/api/apiFuntions";

import { useAuth } from "@/hooks/useAuth";
import PageLoader from "@/components/PageLoader";

export default function SuccessPage() {
  const router = useRouter();
  const { user, refreshSession } = useAuth();
  const { post } = ApiFunction();
  const [updating, setUpdating] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [skipSubscriptionSuccessUi, setSkipSubscriptionSuccessUi] =
    useState(false);
  const [bookError, setBookError] = useState(null);
  const ranRef = useRef(false);
  const FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLScfDRhlC2YxHuHLhJ1edCF-mwxvctWmpDO_fhBSAi-rXlrasA/viewform";

  useEffect(() => {
    if (!user || ranRef.current) return;
    ranRef.current = true;

    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");
        const kind = params.get("kind");

        if (!sessionId) {
          setUpdating(false);
          return;
        }

        if (kind === "book") {
          setSkipSubscriptionSuccessUi(true);
          const response = await post("/stripe/confirm-subscription", {
            session_id: sessionId,
          });

          if (response.success && response.data?.redirectUrl != null) {
            toast.success("Book unlocked!");
            if (refreshSession) await refreshSession();
            const url = response.data.redirectUrl;
            if (url.startsWith("http://") || url.startsWith("https://")) {
              window.location.replace(url);
            } else {
              router.replace(url);
            }
            return;
          }

          const msg =
            response?.message ||
            response?.error ||
            "Could not confirm purchase";
          toast.error(msg);
          setBookError(msg);
          setSkipSubscriptionSuccessUi(false);
          setUpdating(false);
          return;
        }

        const response = await post("/stripe/confirm-subscription", {
          session_id: sessionId,
          type: "subscription",
        });

        if (response.success) {
          toast.success("Subscription confirmed!");
          if (refreshSession) await refreshSession();
          setUpdating(false);
          return;
        }

        toast.error(response.error || "Failed to confirm subscription");
        setUpdating(false);
      } catch (error) {
        console.error("Error in confirmation effect:", error);
        toast.error("An unexpected error occurred during confirmation");
        setBookError("Something went wrong confirming your payment.");
        setSkipSubscriptionSuccessUi(false);
        setUpdating(false);
      }
    };

    run();
  }, [user, post, refreshSession, router]);

  useEffect(() => {
    if (bookError) return;
    if (skipSubscriptionSuccessUi || updating) return;

    setRedirecting(true);
    window.open(FORM_URL, "_blank", "noopener,noreferrer");

    const timer = setTimeout(() => {
      router.push("/dashboard/subscription");
    }, 3000);

    return () => clearTimeout(timer);
  }, [updating, skipSubscriptionSuccessUi, bookError, router]);

  const handleOpenForm = () => {
    window.open(FORM_URL, "_blank", "noopener,noreferrer");
    setRedirecting(true);
    setTimeout(() => {
      router.push("/dashboard/subscription");
    }, 3000);
  };

  if (updating || skipSubscriptionSuccessUi) {
    return (
      <PageLoader
        isVisible={true}
        message="Processing your payment..."
        overlay={true}
      />
    );
  }

  if (bookError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-8 text-center font-poppins">
        <p className="text-red-600 mb-4 max-w-md">{bookError}</p>
        <button
          type="button"
          className="text-primary underline"
          onClick={() => router.push("/")}
        >
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-green-100 p-6 rounded-lg shadow-lg max-w-md mb-6">
        <div className="flex items-center justify-center mb-4">
          <svg
            className="w-16 h-16 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              clipRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              fillRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4 text-green-800">
          Payment Successful! 🎉
        </h1>
        <p className="text-green-700 mb-4">
          Your premium access has been activated!
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-primary text-sm">
            <strong>Status:</strong> Active
          </p>
        </div>
        <p className="text-sm text-green-600">
          Your account has been updated successfully!
        </p>
      </div>

      <div className="max-w-md w-full">
        <button
          className="inline-block cursor-pointer md:w-full max-w-sm bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          disabled={redirecting}
          onClick={handleOpenForm}
        >
          {redirecting ? "Redirecting..." : "Open Health Assessment Form"}
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Click to open the health assessment form. You&apos;ll be redirected to
          your dashboard shortly.
        </p>
        <p className="text-xs text-primary mt-2">
          <a
            className="underline hover:no-underline text-primary cursor-pointer"
            href={FORM_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            Or click here to open form manually
          </a>
        </p>
      </div>
    </div>
  );
}
