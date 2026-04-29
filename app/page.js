import HeroNew from "@/components/NewSimpleUI/HeroNew";
import ServicesSectionNew from "@/components/NewSimpleUI/ServicesSectionNew";
import AboutNew from "@/components/NewSimpleUI/AboutNew";
import WhyChooseUsNew from "@/components/NewSimpleUI/WhyChooseUsNew";
import ButterflySection from "@/components/NewSimpleUI/ButterflySection";
import ContactSectionNew from "@/components/NewSimpleUI/ContactSectionNew";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import RetreatHero from "@/components/RetreatHero";
import NewRetroSection from "@/components/NewSimpleUI/NewRetroSection";
import TransformationGallery from "@/components/TransformationGallery";
import BooksGallery from "@/components/BooksGallery";
import SubscriptionPage from "@/components/SubscriptionPage";

export const metadata = {
  title: "Butterfly Sanctuary Holistic Health | Pilates, Strength & Wellness Coaching",
  description: "The Butterfly Sanctuary Holistic Health is a holistic wellness platform founded by a Jamaican Certified Holistic Practitioner, focused on Pilates-based strength, mobility, and holistic wellness.",
};

export default function Home() {
  return (
    <div className="relative">
      <HeroNew />
      <ServicesSectionNew />
      <AboutNew />
      <WhyChooseUsNew />
      <ButterflySection />
      <SubscriptionPage />
      <ContactSectionNew />
      <Testimonials isPage={false} />
      <TransformationGallery />
      {/* <BooksGallery /> */}
      <RetreatHero />
      <Blog />
    </div>
  );
}
