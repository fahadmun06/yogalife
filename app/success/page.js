"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import Cookies from "js-cookie";

import { useUser } from "@/context/UserContext";
import { db } from "@/config/firebase";
import PageLoader from "@/components/PageLoader";

export default function SuccessPage() {
  const router = useRouter();
  const { user, refreshUser } = useUser();
  const [updating, setUpdating] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLScfDRhlC2YxHuHLhJ1edCF-mwxvctWmpDO_fhBSAi-rXlrasA/viewform";
  // const FORM_URL =
  //   "https://docs.google.com/forms/d/e/1FAIpQLScfDRhlC2YxHuHLhJ1edCF-mwxvctWmpDO_fhBSAi-rXlrasA/viewform?usp=sf_link";

  useEffect(() => {
    const updateUserPackage = async () => {
      try {
        const sessionId = new URLSearchParams(window.location.search).get(
          "session_id"
        );

        if (sessionId) {
          try {
            const res = await fetch("/api/confirm-session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ session_id: sessionId }),
            });
            const data = await res.json();
            if (res.ok && data?.packageDetails) {
              if (user?.uid) {
                const updatedUser = {
                  ...user,
                  packageDetails: data.packageDetails,
                  isPremium: true,
                };
                Cookies.set("tinashaii_user", JSON.stringify(updatedUser), {
                  expires: 7,
                });
                await refreshUser?.();
              }
              localStorage.removeItem("selectedPlan");
              setUpdating(false);
              return;
            }
          } catch (e) {
            console.warn("success: confirm-session failed, falling back", e);
          }
        }

        const selectedPlan = localStorage.getItem("selectedPlan");
        if (!selectedPlan) {
          setUpdating(false);
          return;
        }

        const planDetails = JSON.parse(selectedPlan);

        const startDate = new Date();
        const trialEndDate = new Date();
        const finalEndDate = new Date();
        trialEndDate.setDate(startDate.getDate() + 7);
        finalEndDate.setDate(startDate.getDate() + 7 + planDetails.duration);
        const trialDaysLeft = Math.ceil(
          (trialEndDate - startDate) / (1000 * 60 * 60 * 24)
        );
        const totalDaysLeft = Math.ceil(
          (finalEndDate - startDate) / (1000 * 60 * 60 * 24)
        );
        const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const packageDetails = {
          subscriptionId,
          packageName: planDetails.packageName,
          price: planDetails.price,
          duration: planDetails.duration,
          planType: planDetails.planType,
          isPremium: true,
          planStatus: "trial",
          startDate: startDate.toISOString(),
          trialEndDate: trialEndDate.toISOString(),
          endDate: finalEndDate.toISOString(),
          daysLeft: totalDaysLeft,
          trialDaysLeft,
          subStatus: "active",
          paymentStatus: "completed",
          currency: "JMD",
          createdAt: new Date().toISOString(),
          userId: user?.uid || null,
          paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          stripeSessionId: sessionId || null,
        };

        if (user?.uid) {
          try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
              packageDetails,
              isPremium: true,
              lastUpdated: new Date().toISOString(),
              subscriptionHistory: {
                [new Date().toISOString()]: {
                  action: "subscription_created",
                  planType: packageDetails.planType,
                  price: packageDetails.price,
                  currency: packageDetails.currency,
                  status: "trial",
                  trialDaysLeft: packageDetails.trialDaysLeft,
                },
              },
            });
            const updatedUser = { ...user, packageDetails, isPremium: true };
            Cookies.set("tinashaii_user", JSON.stringify(updatedUser), {
              expires: 7,
            });
            await refreshUser?.();
          } catch (e) {
            console.error("success: Firestore update failed (fallback)", e);
          }
        } else {
          localStorage.setItem(
            "pendingPackageDetails",
            JSON.stringify(packageDetails)
          );
        }

        localStorage.removeItem("selectedPlan");
        setUpdating(false);
      } catch (error) {
        console.error("error updating user package", error);
        setUpdating(false);
      }
    };

    updateUserPackage();
  }, [user]);

  useEffect(() => {
    if (!updating) {
      setRedirecting(true);
      window.open(FORM_URL, "_blank", "noopener,noreferrer");

      const timer = setTimeout(() => {
        router.push("/pricing");
      }, 3000);

      return () => clearTimeout(timer);
      setRedirecting(false);
    }
  }, [updating, router]);

  const handleOpenForm = () => {
    window.open(FORM_URL, "_blank", "noopener,noreferrer");
    setRedirecting(true);
    setTimeout(() => {
      router.push("/pricing");
    }, 3000);
    setRedirecting(false);
  };

  if (updating) {
    return (
      <PageLoader
        isVisible={true}
        message="Processing your payment..."
        overlay={true}
      />
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
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4 text-green-800">
          Payment Successful! 🎉
        </h1>
        <p className="text-green-700 mb-4">
          Your 7-day free trial has started! You now have premium access.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-primary text-sm">
            <strong>Trial Period:</strong> 7 days free, then your subscription
            becomes active
          </p>
        </div>
        <p className="text-sm text-green-600">
          Your account has been updated successfully!
        </p>
      </div>

      <div className="max-w-md w-full">
        <button
          onClick={handleOpenForm}
          disabled={redirecting}
          className="inline-block cursor-pointer md:w-full max-w-sm bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
        >
          {redirecting ? "Redirecting..." : "Open Health Assessment Form"}
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Click to open the health assessment form. You&apos;ll be redirected
          back to pricing shortly.
        </p>

        <p className="text-xs text-primary mt-2">
          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            disabled={redirecting}
            className="underline hover:no-underline text-primary cursor-pointer"
          >
            Or click here to open form manually
          </a>
        </p>
      </div>
    </div>
  );
}
