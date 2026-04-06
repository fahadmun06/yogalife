"use client";
import ServicesSectionNew from "../NewSimpleUI/ServicesSectionNew";
import ContactSectionNew from "../NewSimpleUI/ContactSectionNew";
import WhyChooseUsNew from "../NewSimpleUI/WhyChooseUsNew";
import PageHero from "../NewSimpleUI/PageHero";

const ServicePage = () => {
  return (
    <div>
      <PageHero
        breadcrumb={[{ label: "Services", link: "/services" }]}
        subtitle="Practice Whereever You Want Whenever You Need"
        title="Services"
      />
      <ServicesSectionNew />

      <ContactSectionNew />
      <WhyChooseUsNew />
    </div>
  );
};

export default ServicePage;
