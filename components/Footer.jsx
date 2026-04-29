"use client";

import React, { useState, useEffect } from "react";
import {
  Instagram,
  Mail,
  Flower2,
  MessageCircle,
  Music2,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
} from "lucide-react";
import ApiFunction from "@/components/api/apiFuntions";
import { footerApi } from "@/components/api/ApiRoutesFile";

const iconMap = {
  Instagram: Instagram,
  Mail: Mail,
  MessageCircle: MessageCircle,
  Music2: Music2,
  Facebook: Facebook,
  Twitter: Twitter,
  Youtube: Youtube,
  Linkedin: Linkedin,
};

export default function Footer() {
  const [footerData, setFooterData] = useState(null);
  const { get } = ApiFunction();

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await get(footerApi.get);
        if (res && res.success) {
          setFooterData(res.data);
        }
      } catch (error) {
        console.error("Footer fetch error:", error);
      }
    };
    fetchFooter();
  }, []);

  // Merge database data with defaults to ensure no empty fields
  const defaults = {
    brand: { 
      logo: "/logo.jpg", 
      aboutTitle: "Butterfly Sanctuary", 
      tagline: "Butterfly Sanctuary Holistic Health | Pilates, Strength & Wellness Coaching" 
    },
    socialLinks: [
      { label: "Instagram", href: "https://www.instagram.com/", iconName: "Instagram" },
      { label: "TikTok", href: "https://www.tiktok.com/", iconName: "Music2" },
      { label: "WhatsApp", href: "https://wa.me/1876480188", iconName: "MessageCircle" },
      { label: "Email", href: "mailto:support@butterflysanctuaryja.com", iconName: "Mail" },
    ],
    supportLinks: [
      { name: "Contact Us", href: "/contact" },
      { name: "FAQ", href: "/faq" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
    contactInfo: { phone: "1-876-480-1887", email: "support@butterflysanctuaryja.com" },
    address: { line1: "37 Bellevue drive, Kingston, Jamaica", city: "", country: "" },
  };

  const data = {
    brand: {
      logo: footerData?.brand?.logo || defaults.brand.logo,
      aboutTitle: footerData?.brand?.aboutTitle || defaults.brand.aboutTitle,
      tagline: footerData?.brand?.tagline || defaults.brand.tagline,
    },
    contactInfo: {
      phone: footerData?.contactInfo?.phone || defaults.contactInfo.phone,
      email: footerData?.contactInfo?.email || defaults.contactInfo.email,
    },
    address: {
      line1: footerData?.address?.line1 || defaults.address.line1,
      city: footerData?.address?.city || defaults.address.city,
      country: footerData?.address?.country || defaults.address.country,
    },
    socialLinks: footerData?.socialLinks?.length > 0 ? footerData.socialLinks : defaults.socialLinks,
    supportLinks: footerData?.supportLinks?.length > 0 ? footerData.supportLinks : defaults.supportLinks,
  };

  return (
    <footer className="bg-gradient-to-br from-purple-950 via-purple-900 to-purple-800 text-white dark:from-black dark:via-black dark:to-black">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Logo & About Section */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 shadow-xl bg-white/10 backdrop-blur-sm">
              <img 
                src={data.brand.logo} 
                alt="Business Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {data.brand.aboutTitle}
              </h2>
            </div>
          </div>
          
          <p className="text-purple-100/80 dark:text-gray-400 text-sm leading-relaxed mb-6 italic">
            "{data.brand.tagline}"
          </p>

          <div className="flex space-x-3">
            {data.socialLinks.map((social, index) => {
              const IconComponent = iconMap[social.iconName] || Instagram;
              return (
                <a
                  key={index}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/10 dark:bg-white/5 rounded-full flex items-center justify-center hover:bg-purple-500 transition-all duration-300 hover:scale-110 shadow-lg"
                  href={social.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <IconComponent size={18} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-6 text-purple-200 dark:text-gray-200 border-b border-white/10 pb-2 inline-block">
            Support
          </h3>
          <ul className="space-y-4">
            {data.supportLinks.map((link, index) => (
              <li key={index}>
                <a
                  className="text-purple-200/80 dark:text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  href={link.href}
                >
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full group-hover:scale-150 transition-transform" />
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-6 text-purple-200 dark:text-gray-200 border-b border-white/10 pb-2 inline-block">
            Contact Info
          </h3>
          <ul className="space-y-5 text-purple-200/80 dark:text-gray-400">
            <li className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                <Phone className="opacity-80" size={16} />
              </div>
              <a
                className="hover:text-white transition-colors font-medium"
                href={`tel:${data.contactInfo.phone}`}
              >
                {data.contactInfo.phone}
              </a>
            </li>
            <li className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                <Mail className="opacity-80" size={16} />
              </div>
              <a
                className="hover:text-white transition-colors font-medium break-all"
                href={`mailto:${data.contactInfo.email}`}
              >
                {data.contactInfo.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Organization Address */}
        <div>
          <h3 className="text-lg font-semibold mb-6 text-purple-200 dark:text-gray-200 border-b border-white/10 pb-2 inline-block">
            Organization Address
          </h3>
          <div className="space-y-4 text-purple-200/80 dark:text-gray-400">
            <div className="flex items-start gap-3 group">
              <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-purple-500 transition-colors shrink-0">
                <MapPin className="opacity-80" size={16} />
              </div>
              <div className="leading-relaxed">
                <p>{data.address.line1}</p>
                <p>{data.address.city} {data.address.country}</p>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-white/10 italic text-xs text-purple-300/60">
              Join the waitlist for our next retreat
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 py-6 text-center text-xs text-purple-400/60 uppercase tracking-widest">
        {data.brand.aboutTitle || "Butterfly Sanctuary"} Sanctuary © {new Date().getFullYear()}
      </div>
    </footer>
  );
}
