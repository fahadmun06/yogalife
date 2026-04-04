"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const result = await forgotPassword(email);
      if (result?.success) {
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }
    } catch (err) {
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#764979] to-[#5a3a5e] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl p-8 rounded-[32px]"
      >
        <Link
          href="/auth/login"
          className="inline-flex items-center text-[#764979] hover:underline mb-6"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Login
        </Link>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#764979]/10 rounded-full flex items-center justify-center text-[#764979]">
            <Mail size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[#764979] mb-2 text-center">
          Forgot Password
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Enter your email address and we'll send you a recovery code
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[#764979] font-semibold mb-2">
              Email Address
            </label>
            <Input
              required
              placeholder="Enter your email"
              size="lg"
              variant="bordered"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              classNames={{
                inputWrapper: "rounded-2xl border-[#764979]",
              }}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#764979] hover:bg-[#5a3a5e] text-white font-semibold py-6 h-12 text-lg rounded-2xl shadow-lg"
            isLoading={loading}
            isDisabled={loading}
          >
            Send Recovery Code
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
