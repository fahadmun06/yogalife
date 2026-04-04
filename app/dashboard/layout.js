"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import { Sidebar } from "@/sideBar/SideBar";
import { Navbar } from "@/sideBar/navbar";

export default function DashboardLayout({ children }) {
  const isCollapse = useSelector((state) => state.general.isCollapse);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex min-h-screen font-poppins bg-[#F4EDF5] dark:bg-zinc-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar />
        <motion.main
          animate={{
            marginLeft: isMobile ? "0px" : isCollapse ? "80px" : "256px",
          }}
          className="flex-1 mt-16 p-6 md:p-10 overflow-y-auto flex flex-col"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="mx-auto flex-1 w-full">{children}</div>
        </motion.main>
      </div>
    </div>
  );
}
