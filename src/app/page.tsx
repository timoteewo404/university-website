import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";
import { ScholarshipPopup } from "@/components/ScholarshipPopup";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
      <ScholarshipPopup />
    </div>
  );
}
