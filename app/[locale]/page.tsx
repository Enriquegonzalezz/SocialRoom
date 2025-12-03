import HeroSection from '../components/HeroSection';
import SocialRoomSection from '../components/SocialRoomSection';
import ThreeSliderSectionV2 from '../components/ThreeSliderSectionV2';
import FeaturedWork from '../components/FeaturedWork';
import TeamSection from '../components/TeamSection';
import ServicesCarouselSection from '../components/ServicesCarouselSection';
import ContactFooterSection from '../components/ContactFooterSection';
import ScrollReset from '../components/ScrollReset';
import { getImageUrl } from '@/lib/supabase-images';

// Proyectos para FeaturedWork
const projects = [
  {
    id: 'auge',
    title: 'Auge',
    category: 'branding',
    imageUrl: getImageUrl('auge', 'auge-26.jpg'),
    href: '/projects/auge',
  },
  {
    id: 'leap',
    title: 'Leap',
    category: 'design',
    imageUrl: getImageUrl('L4h', 'Mesa de trabajo 54.png'),
    href: '/projects/leap',
  },
  {
    id: 'leble',
    title: 'Leble',
    category: 'development',
    imageUrl: getImageUrl('leble', 'leble-01.jpg'),
    href: '/projects/leble',
  },
  {
    id: 'lgm',
    title: 'LGM',
    category: 'strategy',
    imageUrl: getImageUrl('lgm', 'LGM-01.jpg'),
    href: '/projects/lgm',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <ScrollReset />
      <div data-section="hero">
        <HeroSection />
      </div>
      <div data-section="socialroom">
        <SocialRoomSection />
      </div>
      
      {/* ThreeSliderSectionV2 solo en desktop (lg y superior) */}
      <div data-section="threeslider" className="hidden lg:block">
        <ThreeSliderSectionV2 />
      </div>
      
      {/* FeaturedWork solo en móvil y tablet (menor a lg) */}
      <div className="block lg:hidden">
        <FeaturedWork projects={projects} />
      </div>
      
      <div data-section="team">
        <TeamSection />
      </div>
      <div data-section="servicescarousel">
        <ServicesCarouselSection />
      </div>
      <div data-section="contact">
        <ContactFooterSection />
      </div>
    </main>
  );
}
