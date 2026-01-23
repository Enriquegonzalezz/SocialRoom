import HeroSection from '../components/HeroSection';
import SocialRoomSection from '../components/SocialRoomSection';
import PastClients from '../components/PastClients';
import FeaturedWork from '../components/FeaturedWork';
import TeamSection from '../components/TeamSection';
import ServicesCarouselSection from '../components/ServicesCarouselSection';
import ContactFooterSection from '../components/ContactFooterSection';

import InfiniteBrands from '../components/Infinitebrands';
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
      <div data-section="hero">
        <HeroSection />
      </div>
      <div data-section="socialroom">
        <SocialRoomSection />
      </div>
      
      {/* PastClients - Carrusel de proyectos */}
      <div data-section="threeslider">
        <PastClients />
      </div>
      
      
      <div data-section="brands">
        <InfiniteBrands />
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
