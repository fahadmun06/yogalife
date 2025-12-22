"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CancelPage() {
  const router = useRouter();

  useEffect(() => {
    // Show cancel toast
    const toast = document.createElement("div");

    toast.className =
      "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <span>Payment canceled. You can try again at any time.</span>
      </div>
    `;
    document.body.appendChild(toast);

    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push("/pricing");
    }, 3000);

    // Cleanup
    return () => {
      clearTimeout(timer);
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    };
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-semibold mb-4 text-red-700">
        Payment canceled
      </h1>
      <p className="text-gray-700 max-w-xl">
        Your payment was canceled. You can try again at any time.
      </p>
      <p className="text-sm text-gray-500 mt-4">
        Redirecting to subscription page...
      </p>
    </div>
  );
}
