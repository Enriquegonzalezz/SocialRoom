import HeroSection from './components/HeroSection';
import SocialRoomSection from './components/SocialRoomSection';
import TeamSection from './components/TeamSection';
import ServicesCarouselSection from './components/ServicesCarouselSection';
import ContactFooterSection from './components/ContactFooterSection';
import InfiniteBrands from './components/Infinitebrands';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <SocialRoomSection />
      <InfiniteBrands />
      <TeamSection />
      <ServicesCarouselSection />
      <ContactFooterSection />
    </main>
  );
}