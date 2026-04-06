"use client";
import PageHero from "../NewSimpleUI/PageHero";
import ContactSectionNew from "../NewSimpleUI/ContactSectionNew";
import DiscountSection from "../DiscountSection";

const ContactPage = () => {
  return (
    <div>
      <PageHero
        breadcrumb={[{ label: "Contact", link: "/contact" }]}
        title="Contact"
      />
      <ContactSectionNew />
      <DiscountSection />
    </div>
  );
};

export default ContactPage;
