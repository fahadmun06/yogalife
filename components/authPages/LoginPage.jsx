"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, EyeOff, Eye } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login({ email, password });

      if (result?.success) {
        const rawReturn = searchParams.get("returnUrl");
        if (rawReturn) {
          try {
            const decoded = decodeURIComponent(rawReturn);
            const url = new URL(decoded, window.location.origin);
            if (url.origin === window.location.origin) {
              router.push(url.pathname + url.search + url.hash);
              return;
            }
          } catch {
            /* fall through */
          }
        }

        const subStatus = result.data?.user?.subscriptionStatus;

        if (subStatus !== "free") {
          router.push("/premium");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "";

      if (errorMsg.includes("verified")) {
        router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#764979] to-[#5a3a5e] flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="auth-card relative bg-white/95 backdrop-blur-sm border-0 shadow-2xl p-8">
          <Link
            className="absolute top-10 bg-primary/95 text-white backdrop-blur-sm border-0 shadow-2xl p-1 rounded-full left-8"
            href="/"
          >
            <ArrowLeft />
          </Link>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-[#764979] mb-2 text-center">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Sign in to your account
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <label
                  className="block text-[#764979] font-semibold mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <Input
                  required
                  classNames={{
                    inputWrapper: `
                       rounded-2xl 
                        border-[1.5px] border-[#764979]
                        bg-gradient-to-br from-white to-slate-50
                        shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8),0_1px_3px_rgba(0,0,0,0.1)]
                        transition-all duration-300
                        focus:outline-none ring-0 w-full
                     `,
                    input: "text-black placeholder:text-gray-400 font-sans",
                  }}
                  id="email"
                  placeholder="Enter your email"
                  size="lg"
                  type="email"
                  value={email}
                  variant="bordered"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </motion.div>

              <motion.div
                animate={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <label
                  className="block text-[#764979] font-semibold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <Input
                  required
                  classNames={{
                    inputWrapper: `
                       rounded-2xl 
                        border-[1.5px] border-[#764979]
                        bg-gradient-to-br from-white to-slate-50
                        shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8),0_1px_3px_rgba(0,0,0,0.1)]
                        transition-all duration-300
                        focus:outline-none ring-0 w-full
                     `,
                    input: "text-black placeholder:text-gray-400 font-sans",
                  }}
                  endContent={
                    passwordShown ? (
                      <EyeOff
                        className="cursor-pointer text-gray-500"
                        onClick={togglePasswordVisibility}
                      />
                    ) : (
                      <Eye
                        className="cursor-pointer text-gray-500"
                        onClick={togglePasswordVisibility}
                      />
                    )
                  }
                  id="password"
                  placeholder="Enter your password"
                  size="lg"
                  type={passwordShown ? "text" : "password"}
                  value={password}
                  variant="bordered"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <Link
                    className="text-[#764979] text-sm font-semibold hover:underline"
                    href="/auth/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </motion.div>

              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Button
                  className="button-3d w-full bg-[#764979] hover:bg-[#5a3a5e] text-white font-semibold py-5 h-12 text-lg"
                  isDisabled={loading}
                  isLoading={loading}
                  type="submit"
                >
                  Sign In
                </Button>
              </motion.div>
            </form>

            <motion.div
              animate={{ opacity: 1 }}
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <p className="text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  className="text-[#764979] font-semibold hover:underline"
                  href="/auth/signup"
                >
                  Sign up here
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
