"use client";

import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, EyeOff } from "lucide-react";
import { Eye } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

import { auth, db } from "../../config/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("Logging in...");

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 30000),
      );

      const loginPromise = (async () => {
        const cred = await signInWithEmailAndPassword(auth, email, password);

        console.log("User logged in:", cred.user.uid);

        const fbUser = cred.user;
        const snap = await getDoc(doc(db, "users", fbUser.uid));
        const profile = snap.exists() ? snap.data() : {};

        console.log("Profile fetched:", profile);

        const normalized = {
          uid: fbUser.uid,
          name: profile?.name || fbUser.displayName || "",
          email: fbUser.email || "",
          status: profile?.status || "active",
          isVerified: fbUser.emailVerified || profile?.isVerified || false,
          packageDetails: profile?.packageDetails || null,
        };

        console.log("Setting cookie...");
        Cookies.set("tinashaii_user", JSON.stringify(normalized), {
          expires: 7,
        });

        return normalized;
      })();

      const normalized = await Promise.race([loginPromise, timeoutPromise]);

      console.log("Showing success toast...");
      addToast({
        title: "Success",
        description: "Logged in successfully",
        color: "success",
      });

      console.log("Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      addToast({
        title: "Error",
        description: err?.message || "Login failed",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#764979] to-[#5a3a5e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Left Decorative Image */}
      <motion.img
        alt="left design"
        animate={{ opacity: 1, x: 0 }}
        className="absolute left-0 top-10 hidden md:block"
        height={236}
        initial={{ opacity: 0, x: -80 }}
        src="https://designingmedia.com/yogastic/wp-content/uploads/2022/07/hero-left-design-1.png"
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        width={233}
      />

      {/* Right Decorative Image */}
      <motion.img
        alt="right design"
        animate={{ opacity: 1, x: 0 }}
        className="absolute right-0 top-20 hidden md:block"
        height={267}
        initial={{ opacity: 0, x: 80 }}
        src="https://designingmedia.com/yogastic/wp-content/uploads/2022/07/hero-right-design-1.png"
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
        width={193}
      />

      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl  z-10"
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
                    input: "text-black placeholder:text-gray-400",
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
                    input: "text-black placeholder:text-gray-400",
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
              </motion.div>

              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Button
                  className="button-3d  w-full bg-[#764979] hover:bg-[#5a3a5e] text-white font-semibold py-5 h-12 text-lg"
                  disabled={loading}
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
                Don't have an account?{" "}
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
