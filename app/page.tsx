import Image from "next/image";
import HeroSection from "./components/sections/Herosection/HeroSection";
import FlavorSection from "./components/sections/FlavourSection/FlavourSection";
import AboutSection from "./components/sections/AboutSection/AboutSection";
import TeaSection from "./components/sections/TeaSection/TeaSection";
import FeaturesSection from "./components/sections/FeatureSection/FeatureSection";
import PureDriedTeaSection from "./components/sections/PureDriedTeaSection/PureDriedTeaSection";
import LeafPowderSection from "./components/sections/LeafPowderSection/LeafPowderSection";
import TeaPowderSection from "./components/sections/TeaPowderSection/TeaPowderSection";
import NewsletterSignup from "./components/sections/NewsLetterSignup/NewsLetterSignup";
import Footer from "./components/footer/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <FlavorSection />
      <AboutSection />
      <TeaSection />
      <FeaturesSection />
      <PureDriedTeaSection />
      <LeafPowderSection/>
      <TeaPowderSection/>
      <NewsletterSignup />
      <Footer />
    </main>
    
  );
}