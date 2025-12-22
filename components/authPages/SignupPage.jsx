"use client";

import React from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Eye, EyeOff } from "lucide-react";

import { auth, db } from "@/config/firebase";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      addToast({
        title: "Error",
        description: "Passwords do not match",
        color: "danger",
      });

      return;
    }

    try {
      setLoading(true);
      console.log("Creating user...");

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timeout")), 30000),
      );

      const signupPromise = (async () => {
        const cred = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password,
        );

        console.log("User created:", cred.user.uid);

        await updateProfile(cred.user, { displayName: formData.name });
        console.log("Profile updated");

        const userDoc = {
          name: formData.name,
          email: formData.email,
          status: "active",
          isVerified: false,
          packageDetails: null,
          createdAt: new Date().toISOString(),
        };

        console.log("Creating Firestore document...");
        let firestoreSuccess = false;

        try {
          // Check if Firestore is available (not offline)
          if (navigator.onLine) {
            // Add timeout for Firestore operation
            const firestorePromise = setDoc(
              doc(db, "users", cred.user.uid),
              userDoc,
            );
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Firestore timeout")), 10000),
            );

            await Promise.race([firestorePromise, timeoutPromise]);
            console.log("Firestore document created");
            firestoreSuccess = true;
          } else {
            console.log("Offline mode - skipping Firestore");
          }
        } catch (firestoreError) {
          console.error("Firestore error:", firestoreError);
          console.log("Continuing without Firestore document...");
        }

        const normalized = {
          uid: cred.user.uid,
          name: userDoc.name,
          email: userDoc.email,
          status: userDoc.status,
          isVerified: userDoc.isVerified,
          packageDetails: userDoc.packageDetails,
        };

        console.log("Setting cookie...");
        Cookies.set("tinashaii_user", JSON.stringify(normalized), {
          expires: 7,
        });

        return { normalized, firestoreSuccess };
      })();

      const { normalized, firestoreSuccess } = await Promise.race([
        signupPromise,
        timeoutPromise,
      ]);

      console.log("Showing success toast...");
      addToast({
        title: "Success",
        description: firestoreSuccess
          ? "Account created successfully"
          : "Account created successfully",
        color: "success",
      });

      console.log("Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      console.error("Signup error:", err);
      addToast({
        title: "Error",
        description: err?.message || "Signup failed",
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
        className="w-full max-w-xl z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
      >
        <div className="auth-card bg-white/95 backdrop-blur-sm border-0 shadow-2xl p-8">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-[#764979] mb-2 text-center">
              Create Account
            </h1>
            <p className="text-gray-600 text-center mb-8">Join us today</p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <label
                  className="block text-[#764979] font-semibold mb-2"
                  htmlFor="name"
                >
                  Full Name
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
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  size="lg"
                  type="text"
                  value={formData.name}
                  variant="bordered"
                  onChange={handleChange}
                />
              </motion.div>

              <motion.div
                animate={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.5, duration: 0.6 }}
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
                  name="email"
                  placeholder="Enter your email"
                  size="lg"
                  type="email"
                  value={formData.email}
                  variant="bordered"
                  onChange={handleChange}
                />
              </motion.div>

              <motion.div
                animate={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.6, duration: 0.6 }}
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
                  name="password"
                  placeholder="Create a password"
                  size="lg"
                  type={passwordShown ? "text" : "password"}
                  value={formData.password}
                  variant="bordered"
                  onChange={handleChange}
                />
              </motion.div>

              <motion.div
                animate={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <label
                  className="block text-[#764979] font-semibold mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
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
                    confirmPasswordShown ? (
                      <EyeOff
                        className="cursor-pointer text-gray-500"
                        onClick={toggleConfirmPasswordVisibility}
                      />
                    ) : (
                      <Eye
                        className="cursor-pointer text-gray-500"
                        onClick={toggleConfirmPasswordVisibility}
                      />
                    )
                  }
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  size="lg"
                  type={confirmPasswordShown ? "text" : "password"}
                  value={formData.confirmPassword}
                  variant="bordered"
                  onChange={handleChange}
                />
              </motion.div>

              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <Button
                  className="button-3d w-full bg-[#764979] hover:bg-[#5a3a5e] text-white font-semibold py-5 h-12 text-lg"
                  disabled={loading}
                  isDisabled={loading}
                  isLoading={loading}
                  type="submit"
                >
                  Create Account
                </Button>
              </motion.div>
            </form>

            <motion.div
              animate={{ opacity: 1 }}
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  className="text-[#764979] font-semibold hover:underline"
                  href="/auth/login"
                >
                  Sign in here
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
