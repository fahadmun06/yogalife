"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const router = useRouter();
  const { updatePassword, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await updatePassword({ currentPassword, newPassword });
      if (result?.success) {
        router.push("/");
      }
    } catch (err) {
      console.error("Change password error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#764979] to-[#5a3a5e] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl p-8 rounded-[32px]"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#764979]/10 rounded-full flex items-center justify-center text-[#764979]">
            <ShieldCheck size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[#764979] mb-2 text-center">
          Change Password
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Secure your account by updating your password
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#764979] font-semibold mb-1">
              Current Password
            </label>
            <Input
              required
              placeholder="Enter current password"
              type={showCurrent ? "text" : "password"}
              variant="bordered"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
              classNames={{
                inputWrapper: "rounded-2xl border-[#764979]",
              }}
            />
          </div>

          <div>
            <label className="block text-[#764979] font-semibold mb-1">
              New Password
            </label>
            <Input
              required
              placeholder="Enter new password"
              type={showNew ? "text" : "password"}
              variant="bordered"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              endContent={
                <button type="button" onClick={() => setShowNew(!showNew)}>
                  {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
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
              type={showNew ? "text" : "password"}
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

          <Button
            variant="light"
            className="w-full text-[#764979] font-semibold h-12 rounded-2xl"
            onClick={() => router.push("/")}
          >
            Cancel
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
