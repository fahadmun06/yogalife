import HeroNew from "@/components/NewSimpleUI/HeroNew";
import ServicesSectionNew from "@/components/NewSimpleUI/ServicesSectionNew";
import AboutNew from "@/components/NewSimpleUI/AboutNew";
import WhyChooseUsNew from "@/components/NewSimpleUI/WhyChooseUsNew";
import ButterflySection from "@/components/NewSimpleUI/ButterflySection";
import ContactSectionNew from "@/components/NewSimpleUI/ContactSectionNew";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import RetreatHero from "@/components/RetreatHero";
import TransformationGallery from "@/components/TransformationGallery";
import BooksGallery from "@/components/BooksGallery";
import SubscriptionPage from "@/components/SubscriptionPage";

export const metadata = {
  title: "Tinashaii | Take Your Yoga to the Next Level",
  description: "Join Tinashaii for premium yoga sessions, personalized nutrition plans, and transformative wellness coaching.",
};

export default function Home() {
  return (
    <div className="relative">
      {/* <Hero /> */}
      <HeroNew />
      {/* <Services /> */}
      <ServicesSectionNew />
      <AboutNew />
      <WhyChooseUsNew />
      <ButterflySection />
      {/* <PricingSectionNew /> */}
      <SubscriptionPage />
      <ContactSectionNew />
      <Testimonials isPage={false} />
      <TransformationGallery />
      <BooksGallery />
      {/* <NewRetroSection /> */}
      <RetreatHero />
      <Blog />
    </div>
  );
}
