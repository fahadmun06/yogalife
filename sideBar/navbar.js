"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  LaptopIcon,
  LogOut,
  Menu,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

// import { useAuth } from './routes/useAuth';
import { useTheme } from "next-themes";
// import { useGeneralContext } from '../context/generalContext';
// import { useUserContext } from '../context/userContext';
import { useDispatch, useSelector } from "react-redux";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";

import { logout } from "../store/slices/authSlice";
import { setIsCollapse } from "../store/slices/generalSlice";
import NotificationBell from "../components/allComponents/notifications/NotificationBell";
import { useAuth } from "../hooks/useAuth";

const themes = [
  { key: "light", label: "Light", icon: <SunIcon className="w-4 h-4" /> },
  { key: "dark", label: "Dark", icon: <MoonIcon className="w-4 h-4" /> },
  { key: "system", label: "System", icon: <LaptopIcon className="w-4 h-4" /> },
];

export function Navbar({ hideclass = "" }) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  // const { isCollapse, setIsCollapse } = useGeneralContext();
  const dispatch = useDispatch();
  const isCollapse = useSelector((state) => state.general.isCollapse);
  const [isDark, setIsDark] = useState(false);
  const { user } = useAuth();
  // const { handleUserLogout, user } = useUserContext();
  // console.log("user", user);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (theme === "system") {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      setIsDark(systemDark);
    } else {
      setIsDark(theme === "dark");
    }
  }, [theme]);

  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async (key) => {
    if (key === "sign-out") {
      dispatch(logout()); // Use Redux logout action
      router.push("/auth/login");
    }
    if (key === "home") {
      const isPremium = user?.subscriptionStatus !== "free";

      isPremium ? router.push("/premium") : router.push("/");
    }
  };
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const currentActiveTheme =
    themes.find((t) => t.key === theme) ||
    themes.find((t) => t.key === resolvedTheme);

  const profilePicture = user?.profile
    ? user?.profile
    : user?.name?.charAt(0)?.toUpperCase();
  // console.log('user', user);

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
        ? "Good Afternoon"
        : hour < 22
          ? "Good Evening"
          : "Good Night";

  return (
    <motion.div
      animate={{
        y: 0,
        opacity: 1,
        left: isMobile ? 0 : isCollapse ? 80 : 256,
      }}
      className={`fixed border-b border-[#E2D4E8] dark:border-darkBorder top-0 right-0 z-40 ${"backdrop-blur-lg bg-[#EBE0EF] dark:bg-dark "} ${hideclass} `}
      initial={{ y: -20, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between p-4 h-16">
        <div className="flex items-center gap-4">
          <Button
            isIconOnly
            className="flex lg:hidden screen-hide"
            variant="light"
            onPress={() => dispatch(setIsCollapse(!isCollapse))}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* <div className="hidden lg:flex flex-col ml-2">
            <h2 className="text-[16px] font-bold text-foreground tracking-tight line-clamp-1 capitalize">
              {greeting}, {user?.firstName} {user?.lastName}{" "}
              <span className="inline-block origin-bottom-right hover:rotate-12 transition-transform cursor-default">
                👋
              </span>
            </h2>
            <p className="text-[11px] text-default-500 font-semibold lowercase">
              Today is{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div> */}
        </div>

        <div className="flex items-center justify-end ms-auto h-full sm:px-4 lg:px-6">
          <div className="flex items-center gap-4">
            {/* <div>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    aria-label="Theme Switcher"
                    className="rounded-full"
                    variant="faded"
                  >
                    {currentActiveTheme?.icon}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Select Theme"
                  selectedKeys={[theme || resolvedTheme || "system"]}
                  selectionMode="single"
                  onAction={(key) => setTheme(key)}
                >
                  {themes.map(({ key, label, icon }) => (
                    <DropdownItem key={key} startContent={icon}>
                      {label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div> */}

            {/* Notification Bell */}
            <NotificationBell />

            <Dropdown className="font-poppins">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  size="sm"
                  src={profilePicture}
                />
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Profile Actions"
                variant="flat"
                onAction={(key) => handleLogout(key)}
              >
                {/* <DropdownItem isReadOnly className="capitalize">
                  {user?.firstName} {user?.lastName}
                </DropdownItem> */}

                <DropdownItem
                  key="home"
                  className="capitalize"
                  startContent={<Home className="w-4 h-4" />}
                >
                  Home
                </DropdownItem>

                <DropdownItem
                  key="sign-out"
                  color="danger"
                  startContent={<LogOut className="w-4 h-4" />}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
