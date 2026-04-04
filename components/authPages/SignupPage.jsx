/* eslint-disable jsx-a11y/label-has-associated-control */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { axiosInstance } from "../api/axiosInstance";

import { useAuth } from "@/hooks/useAuth";

// Validation Schema
const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  dob: yup.string().required("Date of birth is required"),
  age: yup
    .number()
    .typeError("Age must be a number")
    .required("Age is required"),
  gender: yup.string().required("Gender is required"),
  weight: yup
    .number()
    .typeError("Weight must be a number")
    .required("Weight is required"),
  weightUnit: yup
    .string()
    .oneOf(["kg", "lbs"], "Invalid unit")
    .required("Required"),
  height: yup
    .number()
    .typeError("Height must be a number")
    .required("Height is required"),
  heightUnit: yup
    .string()
    .oneOf(["cm", "ft"], "Invalid unit")
    .required("Required"),
});

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      dob: "",
      age: "",
      gender: "",
      weight: "",
      weightUnit: "kg",
      height: "",
      heightUnit: "cm",
    },
    mode: "onChange",
  });

  // Load saved data on mount
  useEffect(() => {
    const savedData = sessionStorage.getItem("signup_form_data");

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);

        Object.keys(parsed).forEach((key) => {
          setValue(key, parsed[key]);
        });
      } catch (e) {
        console.error("Error parsing saved signup data", e);
      }
    }
  }, [setValue]);

  // Save data on change
  const currentValues = watch();

  useEffect(() => {
    sessionStorage.setItem("signup_form_data", JSON.stringify(currentValues));
  }, [currentValues]);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordShown(!confirmPasswordShown);
  };

  const calculateAge = (dobString) => {
    if (!dobString) return "";
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  };

  // Watch DOB to auto-calculate age
  const watchedDob = watch("dob");

  useEffect(() => {
    if (watchedDob) {
      const age = calculateAge(watchedDob);

      setValue("age", age);
    }
  }, [watchedDob, setValue]);

  const nextStep = async () => {
    // Validate fields for Step 1
    const isStepValid = await trigger([
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword",
    ]);

    if (!isStepValid) return;

    try {
      setIsCheckingEmail(true);
      const res = await axiosInstance.post("/auth/check-email", {
        email: currentValues.email,
      });

      if (res.data.success) {
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Email validation failed");
      // if email is already registered, show the error message
      setError("email", {
        type: "manual",
        message: error.response?.data?.message || "Email validation failed",
      });
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await register({
        ...data,
        type: "user",
      });

      if (result?.success) {
        toast.success("Registration successful! Check next page for code.");
        sessionStorage.removeItem("signup_form_data");
        router.push(
          `/auth/verify?email=${encodeURIComponent(data.email)}&tempCode=${result.data.code}`,
        );
      }
    } catch (error) {
      const backendErrors = error.response?.data?.errors;

      if (Array.isArray(backendErrors)) {
        backendErrors.forEach((err) => {
          setError(err.field, {
            type: "server",
            message: err.message,
          });
        });
      } else {
        toast.error(error.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const getInputClassNames = (error) => ({
    inputWrapper: `
      rounded-2xl 
      border-[1.5px] ${error ? "border-red-500" : "border-[#764979]"}
      bg-gradient-to-br from-white to-slate-50
      shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8),0_1px_3px_rgba(0,0,0,0.1)]
      transition-all duration-300
      focus:outline-none ring-0 w-full
    `,
    input: "text-black placeholder:text-gray-400 font-sans",
  });

  const getSelectClassNames = (error) => ({
    trigger: `
      rounded-2xl 
      border-[1.5px] ${error ? "border-red-500" : "border-[#764979]"}
      bg-gradient-to-br from-white to-slate-50
      shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.8),0_1px_3px_rgba(0,0,0,0.1)]
      transition-all duration-300
      focus:outline-none ring-0 w-full h-12 uppercase
    `,
    value: "text-black font-sans uppercase",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#764979] to-[#5a3a5e] flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        animate="visible"
        className="w-full max-w-xl z-10"
        initial="hidden"
        variants={{
          hidden: { opacity: 0, y: 24 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
        }}
      >
        <div className="auth-card bg-white/95 backdrop-blur-sm border-0 shadow-2xl p-8 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            {step === 2 && (
              <button
                className="text-[#764979] hover:bg-purple-50 p-2 rounded-full transition-colors"
                onClick={prevStep}
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div className="flex-1 text-center">
              <h1 className="text-3xl font-bold text-[#764979]">
                {step === 1 ? "Create Account" : "Tell Us About Yourself"}
              </h1>
              <p className="text-gray-500 mt-1 uppercase font-semibold text-xs">
                {step === 1 ? "Step 1 of 2" : "Step 2 of 2"}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                animate="visible"
                className="space-y-5"
                exit="exit"
                initial="hidden"
                variants={containerVariants}
                onSubmit={(e) => {
                  e.preventDefault();
                  nextStep();
                }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <label className="block text-[#764979] font-bold mb-1.5 ml-1 text-sm uppercase">
                      First Name
                    </label>
                    <Controller
                      control={control}
                      name="firstName"
                      render={({ field }) => (
                        <Input
                          {...field}
                          classNames={getInputClassNames(errors.firstName)}
                          placeholder="First name"
                          size="lg"
                          variant="bordered"
                        />
                      )}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label className="block text-[#764979] font-bold mb-1.5 ml-1 text-sm uppercase">
                      Last Name
                    </label>
                    <Controller
                      control={control}
                      name="lastName"
                      render={({ field }) => (
                        <Input
                          {...field}
                          classNames={getInputClassNames(errors.lastName)}
                          placeholder="Last name"
                          size="lg"
                          variant="bordered"
                        />
                      )}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                  <label className="block text-[#764979] font-bold mb-1.5 ml-1 text-sm uppercase">
                    Email Address
                  </label>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <Input
                        {...field}
                        classNames={getInputClassNames(errors.email)}
                        placeholder="Enter your email"
                        size="lg"
                        type="email"
                        variant="bordered"
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {errors.email.message}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-[#764979] font-bold mb-1.5 ml-1 text-sm uppercase">
                    Password
                  </label>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <Input
                        {...field}
                        classNames={getInputClassNames(errors.password)}
                        endContent={
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                          >
                            {passwordShown ? (
                              <EyeOff className="text-gray-500" size={20} />
                            ) : (
                              <Eye className="text-gray-500" size={20} />
                            )}
                          </button>
                        }
                        placeholder="Create a password"
                        size="lg"
                        type={passwordShown ? "text" : "password"}
                        variant="bordered"
                      />
                    )}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {errors.password.message}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-[#764979] font-bold mb-1.5 ml-1 text-sm uppercase">
                    Confirm Password
                  </label>
                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <Input
                        {...field}
                        classNames={getInputClassNames(errors.confirmPassword)}
                        endContent={
                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {confirmPasswordShown ? (
                              <EyeOff className="text-gray-500" size={20} />
                            ) : (
                              <Eye className="text-gray-500" size={20} />
                            )}
                          </button>
                        }
                        placeholder="Confirm your password"
                        size="lg"
                        type={confirmPasswordShown ? "text" : "password"}
                        variant="bordered"
                      />
                    )}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </motion.div>

                <Button
                  className="w-full bg-[#764979] text-white font-bold h-12 rounded-2xl mt-4 shadow-lg active:scale-[0.98] transition-transform"
                  isLoading={isCheckingEmail}
                  type="submit"
                >
                  Continue
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                animate="visible"
                className="space-y-5"
                exit="exit"
                initial="hidden"
                variants={containerVariants}
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="grid grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <label className="block text-[#764979] font-bold mb-1.5 ml-1 text-sm uppercase">
                      Date of Birth
                    </label>
                    <Controller
                      control={control}
                      name="dob"
                      render={({ field }) => (
                        <Input
                          {...field}
                          classNames={getInputClassNames(errors.dob)}
                          size="lg"
                          type="date"
                          variant="bordered"
                        />
                      )}
                    />
                    {errors.dob && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {errors.dob.message}
                      </p>
                    )}
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label className="block text-[#764979] font-bold mb-1.5 ml-1 text-sm uppercase">
                      Age
                    </label>
                    <Controller
                      control={control}
                      name="age"
                      render={({ field }) => (
                        <Input
                          {...field}
                          classNames={getInputClassNames(errors.age)}
                          placeholder="e.g. 25"
                          size="lg"
                          type="number"
                          variant="bordered"
                        />
                      )}
                    />
                    {errors.age && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {errors.age.message}
                      </p>
                    )}
                  </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                  <label className="block text-[#764979] font-bold mb-1.5 ml-1 text-sm uppercase">
                    Gender
                  </label>
                  <Controller
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <Select
                        classNames={getSelectClassNames(errors.gender)}
                        placeholder="Select gender"
                        selectedKeys={field.value ? [field.value] : []}
                        variant="bordered"
                        onSelectionChange={(keys) =>
                          field.onChange(Array.from(keys)[0])
                        }
                      >
                        <SelectItem key="male" value="male">
                          Male
                        </SelectItem>
                        <SelectItem key="female" value="female">
                          Female
                        </SelectItem>
                        <SelectItem key="other" value="other">
                          Other
                        </SelectItem>
                      </Select>
                    )}
                  />
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      {errors.gender.message}
                    </p>
                  )}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants}>
                    <label className="block text-[#764979] font-bold mb-1.5 ml-1 text-sm uppercase">
                      Weight
                    </label>
                    <Controller
                      control={control}
                      name="weight"
                      render={({ field }) => (
                        <Input
                          {...field}
                          classNames={getInputClassNames(errors.weight)}
                          endContent={
                            <Controller
                              control={control}
                              name="weightUnit"
                              render={({ field: unitField }) => (
                                <Select
                                  aria-label="Weight Unit"
                                  className="min-w-18 max-w-18"
                                  classNames={{
                                    trigger:
                                      "border-0 bg-transparent shadow-none h-8 px-0",
                                    value: "text-xs font-bold text-[#764979]",
                                  }}
                                  selectedKeys={[unitField.value]}
                                  onSelectionChange={(keys) =>
                                    unitField.onChange(Array.from(keys)[0])
                                  }
                                >
                                  <SelectItem key="kg" value="kg">
                                    kg
                                  </SelectItem>
                                  <SelectItem key="lbs" value="lbs">
                                    lbs
                                  </SelectItem>
                                </Select>
                              )}
                            />
                          }
                          placeholder="0.0"
                          size="lg"
                          type="number"
                          variant="bordered"
                        />
                      )}
                    />
                    {errors.weight && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {errors.weight.message}
                      </p>
                    )}
                    {errors.weightUnit && (
                      <p className="text-red-500 text-[10px] mt-0.5 ml-1">
                        Unit: {errors.weightUnit.message}
                      </p>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="block text-[#764979] font-bold mb-1.5 ml-1 text-sm uppercase">
                      Height
                    </label>
                    <Controller
                      control={control}
                      name="height"
                      render={({ field }) => (
                        <Input
                          {...field}
                          classNames={getInputClassNames(errors.height)}
                          endContent={
                            <Controller
                              control={control}
                              name="heightUnit"
                              render={({ field: unitField }) => (
                                <Select
                                  aria-label="Height Unit"
                                  className="min-w-18 max-w-18"
                                  classNames={{
                                    trigger:
                                      "border-0 bg-transparent shadow-none h-8 px-0",
                                    value: "text-xs font-bold text-[#764979]",
                                  }}
                                  selectedKeys={[unitField.value]}
                                  onSelectionChange={(keys) =>
                                    unitField.onChange(Array.from(keys)[0])
                                  }
                                >
                                  <SelectItem key="cm" value="cm">
                                    cm
                                  </SelectItem>
                                  <SelectItem key="ft" value="ft">
                                    ft
                                  </SelectItem>
                                </Select>
                              )}
                            />
                          }
                          placeholder="0.0"
                          size="lg"
                          type="number"
                          variant="bordered"
                        />
                      )}
                    />
                    {errors.height && (
                      <p className="text-red-500 text-xs mt-1 ml-1">
                        {errors.height.message}
                      </p>
                    )}
                    {errors.heightUnit && (
                      <p className="text-red-500 text-[10px] mt-0.5 ml-1">
                        Unit: {errors.heightUnit.message}
                      </p>
                    )}
                  </motion.div>
                </div>

                <Button
                  className="w-full bg-[#764979] text-white font-bold h-12 rounded-2xl mt-4 shadow-lg active:scale-[0.98] transition-transform"
                  isLoading={loading}
                  type="submit"
                >
                  Create Account
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <motion.div className="mt-6 text-center" variants={itemVariants}>
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
        </div>
      </motion.div>
    </div>
  );
}
