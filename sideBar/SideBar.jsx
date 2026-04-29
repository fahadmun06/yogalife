"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Users,
  ChevronLeft,
  ChevronRight,
  Package,
  Ticket,
} from "lucide-react";

import { setIsCollapse } from "../store/slices/generalSlice";
import { useSocket } from "../context/SocketProvider";

const menuItems = [
  // { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Profile", href: "/dashboard/profile" },
  { icon: Package, label: "Subscription", href: "/dashboard/subscription" },
  { icon: Ticket, label: "My Tickets", href: "/dashboard/tickets" },
];

export function Sidebar() {
  const pathname = usePathname();
  const navigate = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const dispatch = useDispatch();
  const isCollapse = useSelector((state) => state.general.isCollapse);
  const { user } = useSelector((state) => state.auth);
  const socket = useSocket();
  const [sidebarCounts, setSidebarCounts] = useState({});

  useEffect(() => {
    if (socket) {
      socket.on("sidebar_counts", (data) => {
        setSidebarCounts(data);
      });

      return () => {
        socket.off("sidebar_counts");
      };
    }
  }, [socket]);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;

      setIsMobile(mobile);
      if (mobile) {
        dispatch(setIsCollapse(true));
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    setHasMounted(true);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [dispatch]);

  if (!hasMounted) return null;

  return (
    <>
      {/* Overlay for mobile */}
      {!isCollapse && isMobile && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 bg-black/50 z-40 lg:hidden cursor-default"
          type="button"
          onClick={() => dispatch(setIsCollapse(true))}
        />
      )}

      <motion.div
        animate={{
          width: isCollapse ? (isMobile ? 0 : 80) : 256,
          x: isMobile && isCollapse ? -256 : 0,
        }}
        className="fixed left-0 top-0 h-screen bg-[#EBE0EF] dark:bg-dark border-r border-[#E2D4E8] dark:border-darkBorder z-50"
        initial={false}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Toggle Button - Border Floating Version */}
        {!isMobile && (
          <button
            className="absolute -right-3 top-12 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-lg border-2 border-white dark:border-darkBorder z-[60] transition-transform hover:scale-110 active:scale-95"
            onClick={() => dispatch(setIsCollapse(!isCollapse))}
          >
            {isCollapse ? (
              <ChevronRight size={14} strokeWidth={3} />
            ) : (
              <ChevronLeft size={14} strokeWidth={3} />
            )}
          </button>
        )}

        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-6 flex items-center justify-between">
            <AnimatePresence mode="wait">
              {!isCollapse && (
                <motion.div
                  animate={{ opacity: 1 }}
                  className="flex items-center w-full gap-2"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                >
                  <div className="w-full flex justify-center">
                    <Image
                      alt="Sanctuary Logo"
                      className="w-16 h-16 rounded-xl mx-auto  object-cover"
                      src={"/logo.jpg"}
                      width={32}
                      height={32}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative ${
                        isActive
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "text-gray-500 hover:bg-primary/5 hover:text-primary dark:text-gray-400 dark:hover:bg-white/5"
                      }`}
                      href={item.href}
                      onClick={() => {
                        if (isMobile) dispatch(setIsCollapse(true));
                      }}
                    >
                      <Icon
                        className={`w-5 h-5 flex-shrink-0 ${isActive ? "scale-110" : "group-hover:scale-110"} transition-transform`}
                      />

                      {!isCollapse && (
                        <motion.span
                          animate={{ opacity: 1, x: 0 }}
                          className="font-medium whitespace-nowrap"
                          initial={{ opacity: 0, x: -10 }}
                        >
                          {item.label}
                        </motion.span>
                      )}

                      {sidebarCounts[item.countKey] > 0 && (
                        <span
                          className={`ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            isActive
                              ? "bg-white text-primary"
                              : "bg-primary text-white"
                          }`}
                        >
                          {sidebarCounts[item.countKey]}
                        </span>
                      )}

                      {/* Tooltip for collapsed state */}
                      {isCollapse && !isMobile && (
                        <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[60]">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-darkBorder">
            {!isCollapse ? (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-500">System Online</span>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
