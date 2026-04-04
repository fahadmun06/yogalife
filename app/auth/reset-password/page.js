"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { InputOtp } from "@heroui/input-otp";

import { useAuth } from "@/hooks/useAuth";

function ResetPasswordContent() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [step, setStep] = useState(1); // 1: Verify OTP, 2: Reset Password
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { forgetVerify, resetPassword } = useAuth();

  useEffect(() => {
    const emailParam = searchParams.get("email");

    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (code.length < 6) {
      toast.error("Please enter the 6-digit recovery code");
      return;
    }

    setLoading(true);
    try {
      const result = await forgetVerify(email, code);
      if (result?.success) {
        setResetToken(result.data.resetToken);
        setStep(2);
      }
    } catch (err) {
      console.error("OTP verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword({ email, token: resetToken, password });
      if (result?.success) {
        router.push("/auth/login");
      }
    } catch (err) {
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#764979] to-[#5a3a5e] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl p-8 rounded-[32px]"
      >
        <Link
          href={step === 1 ? "/auth/forgot-password" : "#"}
          onClick={(e) => {
            if (step === 2) {
              e.preventDefault();
              setStep(1);
            }
          }}
          className="inline-flex items-center text-[#764979] hover:underline mb-6"
        >
          <ArrowLeft size={18} className="mr-2" /> {step === 1 ? "Back" : "Back to Verification"}
        </Link>

        <h1 className="text-3xl font-bold text-[#764979] mb-2 text-center">
          {step === 1 ? "Verify Code" : "Create New Password"}
        </h1>
        <p className="text-gray-600 text-center mb-8">
          {step === 1 
            ? `Enter the 6-digit code sent to ${email}`
            : "Verification successful. Please enter your new password."}
        </p>

        {step === 1 ? (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label
                className="block text-[#764979] font-semibold mb-2 text-center"
                htmlFor="code"
              >
                Recovery Code
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
                onChange={(e) => setCode(e.target.value)}
                size="lg"
                value={code}
                variant="underlined"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#764979] hover:bg-[#5a3a5e] text-white font-semibold py-6 h-12 text-lg rounded-2xl shadow-lg"
              isLoading={loading}
              isDisabled={loading}
            >
              Verify Code
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-[#764979] font-semibold mb-1">
                New Password
              </label>
              <Input
                required
                placeholder="Create new password"
                type={showPassword ? "text" : "password"}
                variant="bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
                classNames={{
                  inputWrapper: "rounded-2xl border-[#764979]",
                }}
              />
            </div>

            <div>
              <label className="block text-[#764979] font-semibold mb-1">
                Confirm New Password
              </label>
              <Input
                required
                placeholder="Confirm new password"
                type={showPassword ? "text" : "password"}
                variant="bordered"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                classNames={{
                  inputWrapper: "rounded-2xl border-[#764979]",
                }}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#764979] hover:bg-[#5a3a5e] text-white font-semibold py-6 h-12 text-lg rounded-2xl shadow-lg mt-4"
              isLoading={loading}
              isDisabled={loading}
            >
              Update Password
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
