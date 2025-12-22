"use client";

import React, { useState } from "react";
import {
  Instagram,
  Mail,
  Flower2,
  MessageCircle,
  Music2,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  const socialLinks = [
    {
      icon: <Instagram size={18} />,
      href: "https://www.instagram.com/tinashaii_?igsh=c3A5aGVpc2I4cWFp&utm_source=qr",
      label: "Instagram",
    },
    {
      icon: <Music2 size={18} />,
      href: "https://www.tiktok.com/@tinashaiichin?_t=ZM-8zVjkr9WH8K&_r=1",
      label: "TikTok",
    },
    {
      icon: <MessageCircle size={18} />,
      href: "https://wa.me/1876480188",
      label: "WhatsApp",
    },
    {
      icon: <Mail size={18} />,
      href: "mailto:tinashaii@butterflysanctuaryja.com",
      label: "Email",
    },
  ];

  const supportLinks = [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Terms & Conditions", href: "#" },
    { name: "Cookies & Privacy Policy", href: "#" },
    { name: "Refunds & Returns Policy", href: "#" },
  ];

  return (
    <footer className="bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white dark:from-black dark:via-black dark:to-black">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Flower2
              className="text-purple-300 dark:text-purple-400"
              size={28}
            />
            <h2 className="text-2xl font-bold text-purple-200 dark:text-white">
              Tinashaii
            </h2>
          </div>
          <p className="text-purple-200/80 dark:text-gray-400 text-sm leading-relaxed mb-6">
            Wellness, guidance, and support for your healing journey.
          </p>
          <div className="flex space-x-3">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                aria-label={social.label}
                className="w-10 h-10 bg-white/10 dark:bg-white/5 rounded-full flex items-center justify-center hover:bg-purple-500 transition-all duration-300"
                href={social.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-100 dark:text-gray-200">
            Support
          </h3>
          <ul className="space-y-3">
            {supportLinks.map((link, index) => (
              <li key={index}>
                <a
                  className="text-purple-200/80 dark:text-gray-400 hover:text-white transition-colors"
                  href={link.href}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-100 dark:text-gray-200">
            Contact Info
          </h3>
          <ul className="space-y-3 text-purple-200/80 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <Phone className="opacity-80" size={16} />
              <a
                className="hover:text-white transition-colors"
                href="tel:+18764801887"
              >
                1-876-480-1887
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="opacity-80" size={16} />
              <a
                className="hover:text-white transition-colors"
                href="mailto:tinashaii@butterflysanctuaryja.com"
              >
                tinashaii@butterflysanctuaryja.com
              </a>
            </li>
          </ul>
        </div>

        {/* Organization Address */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-100 dark:text-gray-200">
            Organization Address
          </h3>
          <div className="space-y-2 text-purple-200/80 dark:text-gray-400">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 opacity-80" size={16} />
              <div>
                <p>37 Bellevue drive</p>
                <p>Kingston</p>
                <p>Jamaica</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-purple-700/40 dark:border-gray-700/40" />

      {/* Bottom */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-purple-300 dark:text-gray-400">
        <p>© 2025 Tinashaii. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a className="hover:text-white" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-white" href="#">
            Terms
          </a>
          <a className="hover:text-white" href="#">
            Cookies
          </a>
        </div>
      </div>
    </footer>
  );
}
