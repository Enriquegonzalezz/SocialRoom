import HeroSection from '../components/HeroSection';
import SocialRoomSection from '../components/SocialRoomSection';
import ThreeSliderSectionV2 from '../components/ThreeSliderSectionV2';
import TeamSection from '../components/TeamSection';
import ServicesCarouselSection from '../components/ServicesCarouselSection';
import ContactFooterSection from '../components/ContactFooterSection';
import FloatingProjectsButton from '../components/FloatingProjectsButton';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <SocialRoomSection />
      <ThreeSliderSectionV2 />
      <TeamSection />
      <ServicesCarouselSection />
      <ContactFooterSection />
      <FloatingProjectsButton />
    </main>
  );
}
