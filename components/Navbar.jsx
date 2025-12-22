"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { signOut } from "firebase/auth";
import { addToast } from "@heroui/toast";

import { auth } from "@/config/firebase";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false); // Dropdown state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  // Scroll effect
  useEffect(() => {
    // smooth scroll
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Check auth cookie
  useEffect(() => {
    const cookie = Cookies.get("tinashaii_user");

    setIsLoggedIn(!!cookie);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setPagesOpen(false);
      }
    };

    if (pagesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pagesOpen]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    {
      label: "Pages",
      dropdown: [
        {
          label: "Testimonial",
          href: "/testimonials",
          description: "Client reviews",
        },
        { label: "Pricing", href: "/pricing", description: "Our packages" },
        { label: "FAQ", href: "/faq", description: "Common questions" },
        { label: "Books", href: "/books", description: "Our books" },
      ],
    },
    { label: "Wellness Retreat ", href: "/#wellness-retreat" },
    { label: "Contact", href: "/contact" },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {}
    Cookies.remove("tinashaii_user");
    setIsLoggedIn(false);
    localStorage.removeItem("selectedPlan");
    localStorage.removeItem("pendingPackageDetails");
    addToast({
      title: "Success",
      description: "Logged out successfully",
      color: "success",
    });
    router.push("/");
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900">
        <nav
          className={`fixed top-0 w-full z-50 py-2 transition-all duration-300 ${
            scrolled
              ? "backdrop-blur-lg bg-black/30 dark:bg-black/20 shadow-lg border-b border-white/20"
              : "bg-transparent"
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-0">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link className="flex-shrink-0" href="/">
                <img
                  alt="Logo"
                  className="w-16 cursor-pointer rounded-full"
                  src="/logo.jpg"
                />
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex mx-auto items-center space-x-6">
                {navItems.map((item) =>
                  item.dropdown ? (
                    <div
                      key={item.label}
                      ref={dropdownRef}
                      className="relative group"
                    >
                      <button
                        className="px-4 py-2 cursor-pointer text-lg font-medium text-white flex items-center gap-2 rounded-lg hover:bg-white/10 transition-all duration-300 relative group"
                        onClick={() => setPagesOpen(!pagesOpen)}
                      >
                        {item.label}
                        <svg
                          className={`w-4 h-4 transition-all duration-300 ${
                            pagesOpen
                              ? "rotate-180 text-purple-300"
                              : "rotate-0"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19 9l-7 7-7-7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-white transition-all duration-300 group-hover:w-full" />
                      </button>

                      {/* Animated Dropdown */}
                      <AnimatePresence>
                        {pagesOpen && (
                          <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-black/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden z-50"
                            exit={{ opacity: 0, y: -10 }}
                            initial={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                          >
                            <div className="relative z-10 p-2">
                              {item.dropdown.map((sub) => (
                                <Link
                                  key={sub.label}
                                  className="group/item flex items-center gap-3 px-4 py-3 text-white rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                                  href={sub.href}
                                  onClick={() => setPagesOpen(false)}
                                >
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">
                                      {sub.label}
                                    </div>
                                    <div className="text-xs text-white/70 group-hover/item:text-white/90 transition-colors duration-300">
                                      {sub.description}
                                    </div>
                                  </div>
                                  <svg
                                    className="w-4 h-4 opacity-0 group-hover/item:opacity-100 transition-all duration-300 transform group-hover/item:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      d="M9 5l7 7-7 7"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                    />
                                  </svg>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={item.label}
                      className="px-4 py-2 text-lg font-medium text-white relative group rounded-lg hover:bg-white/10 transition-all duration-300"
                      href={item.href}
                    >
                      {item.label}
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-white transition-all duration-300 group-hover:w-3/4" />
                    </Link>
                  ),
                )}
              </div>

              {isLoggedIn ? (
                <button
                  className="ml-4 bg-gradient-to-r rounded-tl-3xl rounded-br-3xl from-[#E1CCAD] to-[#d6bfa0] md:block hidden cursor-pointer text-[#413625] px-6 py-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/20"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <button
                  className="ml-4 bg-gradient-to-r rounded-tl-3xl rounded-br-3xl from-[#E1CCAD] to-[#d6bfa0] md:block hidden cursor-pointer text-[#413625] px-6 py-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-white/20"
                  onClick={() => router.push("/auth/login")}
                >
                  Login
                </button>
              )}

              {/* Mobile Menu Btn */}
              <div className="md:hidden flex items-center">
                <button
                  className="text-white cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {mobileMenuOpen ? (
                      <path
                        d="M6 18L18 6M6 6l12 12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    ) : (
                      <path
                        d="M4 6h16M4 12h16M4 18h16"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Nav with Animation */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="md:hidden mt-4 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
                  exit={{ opacity: 0, y: -15 }}
                  initial={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  {navItems.map((item) =>
                    item.dropdown ? (
                      <div key={item.label} className="mb-2">
                        <button
                          className="w-full cursor-pointer text-left text-white px-4 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-between"
                          onClick={() => setPagesOpen(!pagesOpen)}
                        >
                          <span className="font-medium">{item.label}</span>
                          <svg
                            className={`w-4 h-4 transition-transform duration-300 ${
                              pagesOpen ? "rotate-180" : "rotate-0"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M19 9l-7 7-7-7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                            />
                          </svg>
                        </button>
                        <AnimatePresence>
                          {pagesOpen && (
                            <motion.div
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 ml-4 space-y-1"
                              exit={{ opacity: 0, y: -10 }}
                              initial={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.25 }}
                            >
                              {item.dropdown.map((sub) => (
                                <a
                                  key={sub.label}
                                  className="flex items-center gap-3 px-4 py-2 text-white/90 rounded-lg hover:bg-white/10 transition-all duration-300"
                                  href={sub.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  <div>
                                    <div className="text-sm font-medium">
                                      {sub.label}
                                    </div>
                                    <div className="text-xs text-white/70">
                                      {sub.description}
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <a
                        key={item.label}
                        className="block px-4 py-3 text-white/90 rounded-xl hover:bg-white/20 hover:text-white transition-all duration-300 font-medium mb-1"
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    ),
                  )}

                  {/* Mobile auth button */}
                  {isLoggedIn ? (
                    <button
                      className="mt-4 w-full bg-gradient-to-r from-[#E1CCAD] to-[#d6bfa0] cursor-pointer text-[#413625] px-6 py-3 rounded-tl-3xl rounded-br-3xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      className="mt-4 w-full bg-gradient-to-r from-[#E1CCAD] to-[#d6bfa0] cursor-pointer text-[#413625] px-6 py-3 rounded-tl-3xl rounded-br-3xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
                      onClick={() => router.push("/auth/login")}
                    >
                      Login
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </div>
    </div>
  );
}
