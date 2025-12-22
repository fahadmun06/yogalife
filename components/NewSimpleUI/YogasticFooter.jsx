"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Newsletter from "../Newsletter";

const YogasticFooter = () => {
  const [email, setEmail] = useState("");
  const pathname = usePathname();

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
              <a className="footer-logo" href="#">
                <img
                  alt="Tinashaii Logo"
                  className="w-22 rounded-full"
                  src="/logo.jpg"
                />
              </a>
            </div>

            {/* About Us Column */}
            <div className="footer-col">
              <h3 className="footer-heading">About Us</h3>
              <div className="footer-text">
                I can’t wait for you to join me in this sanctuary, where
                wellness becomes a lifestyle, not a quick fix.
              </div>
              <div className="social-icons">
                <Link
                  className="social-icon"
                  href="https://www.instagram.com/tinashaii_?igsh=c3A5aGVpc2I4cWFp&utm_source=qr"
                  target="_blank"
                >
                  <i className="fab fa-instagram" />
                </Link>
                <Link
                  className="social-icon"
                  href="https://www.tiktok.com/@tinashaiichin?_t=ZM-8zVjkr9WH8K&_r=1"
                  target="_blank"
                >
                  <i className="fab fa-tiktok" />
                </Link>
                <Link
                  className="social-icon"
                  href="https://wa.me/1876480188"
                  target="_blank"
                >
                  <i className="fab fa-whatsapp" />
                </Link>
                <Link
                  className="social-icon"
                  href="mailto:tinashaii@butterflysanctuaryja.com"
                  target="_blank"
                >
                  <i className="fas fa-envelope" />
                </Link>
              </div>
            </div>

            {/* Support Column */}
            <div className="footer-col">
              <h3 className="footer-heading">Support</h3>
              <ul className="footer-links">
                <li>
                  <Link href={pathname?.startsWith("/") ? "/contact" : "#"}>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href={pathname?.startsWith("/") ? "/faq" : "#"}>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#">Terms & Conditions</Link>
                </li>
                <li>
                  <Link href="#">Cookies & Privacy Policy</Link>
                </li>
                <li>
                  <Link href="#">Refunds & Returns Policy</Link>
                </li>
              </ul>
            </div>

            {/* Contact Info Column */}
            <div className="footer-col">
              <h3 className="footer-heading">Contact Info</h3>
              <ul className="contact-info">
                <li className="contact-item">
                  <i className="fas fa-phone-alt" />
                  <span>1-876-480-1887</span>
                </li>
                <li className="contact-item">
                  <i className="fas fa-envelope" />
                  <span>tinashaii@butterflysanctuaryja.com</span>
                </li>
                <li className="contact-item">
                  <i className="fas fa-map-marker-alt" />
                  <span>37 Bellevue drive, Kingston, Jamaica</span>
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

        /* Newsletter Section */
        .newsletter-section {
          background: linear-gradient(135deg, #f4f1ec 0%, #ede7dc 100%);
          padding: 80px 0 100px;
          position: relative;
          animation: fadeInUp 0.6s ease-out;
        }

        .newsletter-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
        }

        .newsletter-content {
          padding-right: 40px;
        }

        .subscribe-tag {
          color: #8b5a8b;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 2px;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        .newsletter-title {
          font-size: 42px;
          font-weight: 700;
          color: #333;
          line-height: 1.3;
          margin-bottom: 40px;
          font-family: "Georgia", serif;
        }

        .subscribe-form {
          display: flex;
          gap: 0;
          max-width: 500px;
        }

        .email-input {
          flex: 1;
          padding: 18px 25px;
          border: none;
          border-radius: 50px 0 0 50px;
          background: white;
          font-size: 16px;
          outline: none;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .email-input::placeholder {
          color: #999;
        }

        .subscribe-btn {
          padding: 18px 35px;
          background: #8b5a8b;
          color: white;
          border: none;
          border-radius: 0 50px 50px 0;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .subscribe-btn:hover {
          background: #7d4e7d;
          transform: translateY(-2px);
        }

        .newsletter-image-col {
          position: relative;
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

        .logo-img {
          width: 125px;
          height: 104px;
          object-fit: contain;
        }

        .footer-heading {
          font-size: 20px;
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

        /* Animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .newsletter-inner {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 30px;
          }

          .newsletter-content {
            padding-right: 0;
          }

          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px;
          }

          .footer-bg-design {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .newsletter-section {
            padding: 60px 0 80px;
          }

          .newsletter-title {
            font-size: 32px;
          }

          .subscribe-form {
            flex-direction: column;
            gap: 15px;
            max-width: 100%;
          }

          .email-input,
          .subscribe-btn {
            border-radius: 50px;
          }

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

        @media (max-width: 480px) {
          .newsletter-title {
            font-size: 28px;
          }

          .container {
            padding: 0 20px;
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
