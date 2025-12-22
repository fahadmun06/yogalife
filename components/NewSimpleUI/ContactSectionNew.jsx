"use client";

import { addToast } from "@heroui/toast";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ Yup Validation Schema
const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10,15}$/, "Enter a valid phone number"),
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email"),
  message: yup.string().required("Message is required"),
});

export default function ContactSectionNew() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const inputVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    addToast({
      title: "Success",
      description: "Form submitted successfully",
      color: "success",
    });
    reset();
  };

  return (
    <section className="md:h-[80vh] bg-white overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        {/* Left Side - Form */}
        <div
          className="flex bg-[#E1CCAD] items-center justify-center h-full py-20 md:py-0 px-8"
          style={{
            backgroundImage:
              "url('https://designingmedia.com/yogastic/wp-content/uploads/2022/07/contact-section-design-1.png')",
            backgroundSize: "200px",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <motion.div
            className="w-full max-w-lg"
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <h4 className="text-primary font-medium tracking-wider">
              GET IN TOUCH
            </h4>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mt-2 leading-snug">
              Get a Free Consultation Now
            </h2>

            <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field }) => (
                    <motion.div
                      className="flex flex-col"
                      custom={0}
                      initial="hidden"
                      variants={inputVariants}
                      viewport={{ once: true }}
                      whileInView="visible"
                    >
                      <input
                        {...field}
                        className={`w-full border rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary transition-all hover:scale-[1.02] focus:scale-[1.03] ${
                          errors.firstName
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="First Name"
                        type="text"
                      />
                      {errors.firstName && (
                        <span className="text-xs text-red-500 mt-1">
                          {errors.firstName.message}
                        </span>
                      )}
                    </motion.div>
                  )}
                />

                {/* Last Name */}
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field }) => (
                    <motion.div
                      className="flex flex-col"
                      custom={1}
                      initial="hidden"
                      variants={inputVariants}
                      viewport={{ once: true }}
                      whileInView="visible"
                    >
                      <input
                        {...field}
                        className={`w-full border rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary transition-all hover:scale-[1.02] focus:scale-[1.03] ${
                          errors.lastName ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Last Name"
                        type="text"
                      />
                      {errors.lastName && (
                        <span className="text-xs text-red-500 mt-1">
                          {errors.lastName.message}
                        </span>
                      )}
                    </motion.div>
                  )}
                />

                {/* Phone */}
                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <motion.div
                      className="flex flex-col"
                      custom={2}
                      initial="hidden"
                      variants={inputVariants}
                      viewport={{ once: true }}
                      whileInView="visible"
                    >
                      <input
                        {...field}
                        className={`w-full border rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary transition-all hover:scale-[1.02] focus:scale-[1.03] ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Phone"
                        type="text"
                      />
                      {errors.phone && (
                        <span className="text-xs text-red-500 mt-1">
                          {errors.phone.message}
                        </span>
                      )}
                    </motion.div>
                  )}
                />

                {/* Email */}
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <motion.div
                      className="flex flex-col"
                      custom={3}
                      initial="hidden"
                      variants={inputVariants}
                      viewport={{ once: true }}
                      whileInView="visible"
                    >
                      <input
                        {...field}
                        className={`w-full border rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary transition-all hover:scale-[1.02] focus:scale-[1.03] ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Email"
                        type="email"
                      />
                      {errors.email && (
                        <span className="text-xs text-red-500 mt-1">
                          {errors.email.message}
                        </span>
                      )}
                    </motion.div>
                  )}
                />
              </div>

              {/* Message */}
              <Controller
                control={control}
                name="message"
                render={({ field }) => (
                  <motion.div
                    className="flex flex-col"
                    custom={4}
                    initial="hidden"
                    variants={inputVariants}
                    viewport={{ once: true }}
                    whileInView="visible"
                  >
                    <textarea
                      {...field}
                      className={`w-full border rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-primary transition-all hover:scale-[1.02] focus:scale-[1.03] ${
                        errors.message ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Message"
                      rows="5"
                    />
                    {errors.message && (
                      <span className="text-xs text-red-500 mt-1">
                        {errors.message.message}
                      </span>
                    )}
                  </motion.div>
                )}
              />

              {/* Button */}
              <motion.button
                className="bg-primary cursor-pointer rounded-tl-3xl rounded-br-3xl hover:bg-primary/80 text-white font-medium px-6 py-3 transition-all"
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Right Side - Image */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <img
            alt="Contact Section"
            className="w-full h-[80vh] object-cover"
            src="img2.jpg"
          />
        </motion.div>
      </div>
    </section>
  );
}
