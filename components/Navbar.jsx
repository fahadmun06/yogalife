/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import {
  Drawer,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
} from "@heroui/drawer";
import { LogOut, Settings, ChevronDown, Menu, X } from "lucide-react";
import NotificationBell from "./allComponents/notifications/NotificationBell";
import SearchModal from "./SearchModal";

import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false); // Dropdown state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  // console.log("user", user);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dark mode toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Close pages dropdown when clicking outside
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

  // Command + K shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isPremium = user && user?.subscriptionStatus !== "free";

  const isPremiumUser = pathname.startsWith("/premium");
  // console.log("isPremiumUser", isPremiumUser);
  // console.log("user", user);
  // console.log("isPremium", isPremium);
  const navItems = isPremium
    ? [
        { label: "Home", href: "/premium" },
        { label: "Your Studio", href: "/premium/workouts" },
        { label: "Search", onClick: () => setSearchModalOpen(true) },
        { label: "Account", href: "/dashboard/profile" },
      ]
    : [
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

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-lg bg-primary/50 dark:bg-primary/20 shadow-lg border-b border-white/20 py-2"
            : "bg-transparent py-3"
        }`}
      >
        <div
          className={`container mx-auto px-4 sm:px-6 ${isPremiumUser ? "lg:px-16 font-poppins " : "lg:px-0"}`}
        >
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
            <div className="hidden lg:flex mx-auto items-center xl:space-x-8 lg:space-x-4">
              {navItems.map((item) =>
                item.dropdown ? (
                  <div
                    key={item.label}
                    ref={dropdownRef}
                    className="relative group"
                  >
                    <button
                      className={`px-3 py-2 cursor-pointer text-[17px] font-medium flex items-center gap-1.5 rounded-lg transition-all duration-300 relative group ${
                        scrolled
                          ? "text-white hover:bg-white/10"
                          : "text-black hover:bg-black/5"
                      }`}
                      onClick={() => setPagesOpen(!pagesOpen)}
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-all duration-300 ${
                          pagesOpen ? "rotate-180 text-purple-300" : "rotate-0"
                        }`}
                      />
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-white transition-all duration-300 group-hover:w-full" />
                    </button>

                    {/* Dropdown Menu */}
                    <div
                      className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-black/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden z-50 transition-all duration-300 ${
                        pagesOpen
                          ? "opacity-100 translate-y-0 visible"
                          : "opacity-0 -translate-y-2 invisible"
                      }`}
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
                    </div>
                  </div>
                ) : item.onClick ? (
                  <button
                    key={item.label}
                    className={`px-3 py-2 text-[17px] font-medium relative group rounded-lg transition-all duration-300 flex items-center gap-2 ${
                      scrolled
                        ? "text-white hover:bg-white/10"
                        : "text-black hover:bg-black/5"
                    }`}
                    onClick={item.onClick}
                  >
                    {item.label}
                    <span
                      className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300 ${"w-0 bg-gradient-to-r from-primary to-white group-hover:w-3/4"}`}
                    />
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    className={`px-3 py-2 text-[17px] font-medium relative group rounded-lg transition-all duration-300 flex items-center gap-2 ${
                      isPremiumUser && pathname === item.href
                        ? "text-[#6D735C]"
                        : scrolled
                          ? "text-white hover:bg-white/10"
                          : "text-black hover:bg-black/5"
                    }`}
                    href={item.href}
                  >
                    {item.label}
                    <span
                      className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 transition-all duration-300 ${
                        isPremiumUser && pathname === item.href
                          ? "w-3/4 bg-[#6D735C]"
                          : "w-0 bg-gradient-to-r from-primary to-white group-hover:w-3/4"
                      }`}
                    />
                  </Link>
                ),
              )}
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <div className="relative ml-2 lg:block hidden">
                    <div className="flex gap-4 items-center">
                      <NotificationBell />
                      <Dropdown
                        placement="bottom-end"
                        className="font-poppins cursor-pointer"
                      >
                        <DropdownTrigger>
                          <Avatar
                            isBordered
                            as="button"
                            className="transition-transform cursor-pointer font-poppins shadow-lg hover:scale-110 active:scale-95"
                            color="primary"
                            name={user?.firstName}
                            size="sm"
                            src={user?.profile}
                          />
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Profile Actions"
                          variant="flat"
                          onAction={(key) => {
                            if (key === "logout") handleLogout();
                            if (
                              key === "dashboard" &&
                              pathname?.startsWith("/premium")
                            ) {
                              router.push("/premium/profile");
                            } else {
                              router.push("/dashboard/profile");
                            }
                          }}
                        >
                          <DropdownItem
                            key="profile"
                            startContent={<Settings className="w-4 h-4" />}
                          >
                            Settings
                          </DropdownItem>
                          <DropdownItem
                            key="logout"
                            color="danger"
                            startContent={<LogOut className="w-4 h-4" />}
                          >
                            Log Out
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>

                  {/* Mobile Indicators */}
                  <div className="lg:hidden flex items-center gap-3 mr-1">
                    <NotificationBell />
                  </div>
                </>
              ) : (
                <Button
                  className="ml-2 button bg-white hover:bg-primary hover:text-white lg:block hidden cursor-pointer text-[#413625] font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 px-6"
                  onClick={() => router.push("/auth/login")}
                >
                  Login
                </Button>
              )}

              {/* Mobile Menu Btn */}
              <div className="lg:hidden flex items-center">
                <button
                  className={`${scrolled ? "text-white" : "text-black"} cursor-pointer p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all duration-300 active:scale-90`}
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <Drawer
        backdrop="blur"
        className="bg-white/95 backdrop-blur-xl border-l border-slate-200"
        isOpen={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        placement="right"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 pt-8 px-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <img
                      alt="Logo"
                      className="w-12 h-12 rounded-full border border-slate-200 shadow-sm"
                      src="/logo.jpg"
                    />
                  </Link>
                </div>

                {isAuthenticated && (
                  <div className="mt-8 flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Avatar
                      isBordered
                      className="w-12 h-12"
                      color="primary"
                      name={user?.firstName}
                      src={user?.profile}
                    />
                    <div className="flex-1 overflow-hidden">
                      <h3 className="text-slate-900 font-bold truncate">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                )}
              </DrawerHeader>
              <DrawerBody className="px-4 py-6">
                <div className="space-y-1">
                  {navItems.map((item) =>
                    item.dropdown ? (
                      <div key={item.label} className="mb-2">
                        <button
                          className="w-full cursor-pointer text-left text-slate-800 px-5 py-4 rounded-2xl hover:bg-slate-100 transition-all duration-300 flex items-center justify-between group"
                          onClick={() => setPagesOpen(!pagesOpen)}
                        >
                          <span className="font-semibold text-lg">
                            {item.label}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 transition-transform duration-500 ${
                              pagesOpen
                                ? "rotate-180 text-primary"
                                : "rotate-0 text-slate-300"
                            }`}
                          />
                        </button>
                        <div
                          className={`overflow-hidden ml-4 space-y-1 mt-1 border-l border-slate-100 transition-all duration-300 ease-in-out ${
                            pagesOpen
                              ? "max-h-[500px] opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.label}
                              className="flex items-center gap-4 px-5 py-3 text-slate-600 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all duration-300"
                              href={sub.href}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                              <div>
                                <div className="text-base font-medium">
                                  {sub.label}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {sub.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : item.onClick ? (
                      <button
                        key={item.label}
                        className="flex items-center w-full px-5 py-4 rounded-2xl transition-all duration-300 font-semibold text-lg mb-1 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          item.onClick();
                        }}
                      >
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        key={item.label}
                        className={`flex items-center px-5 py-4 rounded-2xl transition-all duration-300 font-semibold text-lg mb-1 ${
                          isPremiumUser && pathname === item.href
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ),
                  )}
                </div>

                {/* Mobile auth actions */}
                <div className="mt-8 pt-8 border-t border-slate-100 space-y-3">
                  {isAuthenticated ? (
                    <>
                      <Link
                        className="flex items-center justify-center gap-2 w-full px-6 py-4 text-slate-700 font-bold rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all duration-300 border border-slate-100"
                        href="/dashboard/profile"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Settings className="w-5 h-5" />
                        Account Settings
                      </Link>
                      <button
                        className="flex items-center justify-center gap-2 w-full bg-red-50 hover:bg-red-100 cursor-pointer text-red-500 px-6 py-4 rounded-full font-bold transition-all duration-300 border border-red-100 active:scale-95"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      className="w-full bg-primary text-white cursor-pointer px-6 py-4 rounded-full font-bold shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all duration-300 active:scale-95 border border-primary/20"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push("/auth/login");
                      }}
                    >
                      Login to Account
                    </button>
                  )}
                </div>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
}
