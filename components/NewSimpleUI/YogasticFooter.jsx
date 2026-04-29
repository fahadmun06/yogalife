/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Newsletter from "../Newsletter";
import ApiFunction from "@/components/api/apiFuntions";
import { footerApi } from "@/components/api/ApiRoutesFile";

const iconClassMap = {
  Instagram: "fab fa-instagram",
  Mail: "fas fa-envelope",
  MessageCircle: "fab fa-whatsapp",
  Music2: "fab fa-tiktok",
  Facebook: "fab fa-facebook-f",
  Twitter: "fab fa-twitter",
  Youtube: "fab fa-youtube",
  Linkedin: "fab fa-linkedin-in",
};

const YogasticFooter = () => {
  const [email, setEmail] = useState("");
  const pathname = usePathname();
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
    ],
    contactInfo: { phone: "1-876-480-1887", email: "support@butterflysanctuaryja.com" },
    address: { line1: "Kingston", city: "Jamaica", country: "" },
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

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setEmail("");
  };

  return (
    <div
      className="footer-wrapper"
      style={{
        background: "linear-gradient(to bottom, #FFF 50%, #764979 50%)",
      }}
    >
      <Newsletter />

      {/* Footer Section */}
      <section className="footer-section bg-primary">
        <div className="container">
          {/* Decorative Background Image */}
          <img
            alt=""
            className="footer-bg-design"
            src="https://designingmedia.com/yogastic/wp-content/uploads/2023/03/footer-design-1.png"
          />

          <div className="footer-grid">
            {/* Logo Column */}
            <div className="footer-col">
              <Link className="footer-logo" href="/">
                <img
                  alt="Business Logo"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/10 shadow-lg"
                  src={data.brand.logo}
                />
              </Link>
            </div>

            {/* About Us Column */}
            <div className="footer-col">
              <h3 className="footer-heading font-playfair">{data.brand.aboutTitle}</h3>
              <div className="footer-text leading-relaxed">
                {data.brand.tagline}
              </div>
              <div className="social-icons">
                {data.socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    className="social-icon"
                    href={social.href}
                    target="_blank"
                  >
                    <i className={iconClassMap[social.iconName] || "fas fa-link"} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Support Column */}
            <div className="footer-col">
              <h3 className="footer-heading font-playfair">Support</h3>
              <ul className="footer-links">
                {data.supportLinks.map((link, index) => (
                  <li key={index}>
                    <Link href={link.href}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info Column */}
            <div className="footer-col">
              <h3 className="footer-heading font-playfair">Contact Info</h3>
              <ul className="contact-info">
                <li className="contact-item">
                  <i className="fas fa-phone-alt" />
                  <span>{data.contactInfo.phone}</span>
                </li>
                <li className="contact-item">
                  <i className="fas fa-envelope" />
                  <span>{data.contactInfo.email}</span>
                </li>
                <li className="contact-item">
                  <i className="fas fa-map-marker-alt" />
                  <span>{data.address.line1}, {data.address.city} {data.address.country}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .footer-wrapper {
          width: 100%;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 15px;
        }

        /* Footer Section */
        .footer-section {
          padding: 80px 0 40px;
          position: relative;
          overflow: hidden;
        }

        .footer-bg-design {
          position: absolute;
          top: 0;
          right: 0;
          width: 377px;
          height: 462px;
          opacity: 0.1;
          pointer-events: none;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: auto 1fr 1fr 1fr;
          gap: 60px;
          align-items: start;
          position: relative;
          z-index: 2;
        }

        .footer-col {
          color: white;
        }

        .footer-logo {
          display: inline-block;
        }

        .footer-heading {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 25px;
          color: #f0e6d8;
        }

        .footer-text {
          color: #e0e0e0;
          line-height: 1.7;
          margin-bottom: 30px;
          font-size: 15px;
        }

        /* Social Icons */
        .social-icons {
          display: flex;
          gap: 12px;
        }

        .social-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        /* Footer Links */
        .footer-links {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: #e0e0e0;
          text-decoration: none;
          font-size: 15px;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: #f0e6d8;
        }

        /* Contact Info */
        .contact-info {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 18px;
          color: #e0e0e0;
          font-size: 15px;
          line-height: 1.6;
        }

        .contact-item i {
          color: #f0e6d8;
          font-size: 16px;
          margin-top: 3px;
          min-width: 16px;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }

          .footer-bg-design {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .footer-section {
            padding: 60px 0 30px;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 30px;
            text-align: center;
          }

          .social-icons {
            justify-content: center;
          }
        }
      `}</style>

      {/* FontAwesome CDN for Icons */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        rel="stylesheet"
      />
    </div>
  );
};

export default YogasticFooter;
