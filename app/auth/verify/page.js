"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@heroui/button";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { InputOtp } from "@heroui/input-otp";

import { useAuth } from "@/hooks/useAuth";

function VerifyContent() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, resendVerificationCode } = useAuth();

  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const emailParam = searchParams.get("email");

    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length < 6) {
      toast.error("Please enter the 6-digit code");

      return;
    }

    setLoading(true);
    try {
      const result = await verifyEmail(email, code);

      if (result?.success) {
        router.push("/auth/login");
      }
    } catch (err) {
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email is required to resend code");

      return;
    }

    setResending(true);
    try {
      const result = await resendVerificationCode(email);

      if (result?.success) {
        setTimer(60);
      }
    } catch (err) {
      console.error("Resend error:", err);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#764979] to-[#5a3a5e] flex items-center justify-center p-4">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl p-8 rounded-[32px]"
        initial={{ opacity: 0, y: 20 }}
      >
        <Link
          className="inline-flex items-center text-[#764979] hover:underline mb-6"
          href="/auth/signup"
        >
          <ArrowLeft className="mr-2" size={18} /> Back to Signup
        </Link>

        <h1 className="text-3xl font-bold text-[#764979] mb-2 text-center">
          Verify Email
        </h1>
        <p className="text-gray-600 text-center mb-4">
          We&apos;ve sent a 6-digit verification code to{" "}
          <span className="font-semibold text-[#764979]">{email}</span>
        </p>

        {/* Temporary Alert for Email Issues */}
        {searchParams.get("tempCode") && (
          <div className="mb-6 p-5 bg-purple-50 border border-purple-100 rounded-3xl text-purple-900 shadow-sm transition-all duration-300">
            <div className="flex items-center gap-2 mb-3 text-purple-700">
              <div className="p-1 px-2.5 bg-purple-100 rounded-lg text-xs font-bold uppercase tracking-wider">
                Support Notice
              </div>
            </div>
            <p className="text-[13px] leading-relaxed mb-4 text-purple-800/80 font-medium">
              We&apos;re currently experiencing a temporary issue with our email
              delivery system. Our technical team is working hard to restore
              full service. In the meantime, please use the code below to
              complete your verification. We apologize for any inconvenience.
            </p>
            <div className="p-4 bg-white/60 rounded-2xl border border-purple-100 flex flex-col items-center gap-1 shadow-inner">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em]">
                Your Verification Code
              </span>
              <span className="text-2xl font-black tracking-[0.3em] text-[#764979] drop-shadow-sm">
                {searchParams.get("tempCode")}
              </span>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-[#764979] font-semibold mb-2"
              htmlFor="code"
            >
              Verification Code
            </label>
            <InputOtp
              required
              className="mx-auto"
              classNames={{
                inputWrapper: "rounded-2xl border-[#764979]",
                input: "text-center tracking-[0.5em] font-bold text-xl",
              }}
              color="primary"
              id="code"
              maxLength={6}
              name="code"
              size="lg"
              value={code}
              variant="underlined"
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <Button
            className="w-full bg-[#764979] hover:bg-[#5a3a5e] text-white font-semibold py-6 h-12 text-lg rounded-2xl shadow-lg"
            isDisabled={loading}
            isLoading={loading}
            type="submit"
          >
            Verify Account
          </Button>
        </form>

        <div className="mt-8 text-center text-gray-600">
          <p>Didn&apos;t receive the code?</p>
          <button
            className="text-[#764979] font-bold hover:underline mt-2 disabled:opacity-50"
            disabled={resending || timer > 0}
            onClick={handleResend}
          >
            {resending
              ? "Resending..."
              : timer > 0
                ? `Resend in ${timer}s`
                : "Resend Code"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#764979] flex items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
