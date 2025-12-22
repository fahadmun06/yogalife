import HeroNew from "@/components/NewSimpleUI/HeroNew";
import ServicesSectionNew from "@/components/NewSimpleUI/ServicesSectionNew";
import AboutNew from "@/components/NewSimpleUI/AboutNew";
import WhyChooseUsNew from "@/components/NewSimpleUI/WhyChooseUsNew";
import ContactSectionNew from "@/components/NewSimpleUI/ContactSectionNew";
import Testimonials from "@/components/Testimonials";
import Blog from "@/components/Blog";
import RetreatHero from "@/components/RetreatHero";
import TransformationGallery from "@/components/TransformationGallery";
import BooksGallery from "@/components/BooksGallery";
import SubscriptionPage from "@/components/SubscriptionPage";
import NewRetroSection from "@/components/NewSimpleUI/NewRetroSection";

export const metadata = {
  title: "Tinashaii",
  description: "Take Your Yoga to the Next Level",
};

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* <Hero /> */}
      <HeroNew />
      {/* <Services /> */}
      <ServicesSectionNew />
      <AboutNew />
      <WhyChooseUsNew />
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
