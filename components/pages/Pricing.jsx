"use client";
import PageHero from "../NewSimpleUI/PageHero";
import DiscountSection from "../DiscountSection";
import SubscriptionPage from "../SubscriptionPage";

const PricingPage = () => {
  return (
    <div>
      <PageHero
        breadcrumb={[{ label: "Pricing", link: "/pricing" }]}
        subtitle="Choose a plan that fits your needs"
        title="Pricing"
      />


      {/* Current Subscription Status */}
      {/* <div className="container mx-auto px-4 py-8">
        <SubscriptionStatus />
      </div> */}

      {/* <PricingSectionNew /> */}
      <SubscriptionPage />
      <DiscountSection />
    </div>
  );
};

export default PricingPage;
