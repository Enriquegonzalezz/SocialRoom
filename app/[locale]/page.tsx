import HeroSection from '../components/HeroSection';
import SocialRoomSection from '../components/SocialRoomSection';
import ThreeSliderSectionV2 from '../components/ThreeSliderSectionV2';
import FeaturedWork from '../components/FeaturedWork';
import TeamSection from '../components/TeamSection';
import ServicesCarouselSection from '../components/ServicesCarouselSection';
import ContactFooterSection from '../components/ContactFooterSection';
import FloatingProjectsButton from '../components/FloatingProjectsButton';

// Proyectos para FeaturedWork
const projects = [
  {
    id: 'auge',
    title: 'Auge',
    category: 'branding',
    imageUrl: '/auge1.png',
    href: '/projects/auge',
  },
  {
    id: 'leap',
    title: 'Leap',
    category: 'design',
    imageUrl: '/leap1.webp',
    href: '/projects/leap',
  },
  {
    id: 'leble',
    title: 'Leble',
    category: 'development',
    imageUrl: '/leble1.png',
    href: '/projects/leble',
  },
  {
    id: 'lgm',
    title: 'LGM',
    category: 'strategy',
    imageUrl: '/lgm1.png',
    href: '/projects/lgm',
  },
  {
    id: 'enfoque',
    title: 'Enfoque',
    category: 'focus',
    imageUrl: '/enfoque1.png',
    href: '/projects/enfoque',
  },
  {
    id: 'supper',
    title: 'Supper',
    category: 'premium',
    imageUrl: '/supper1.png',
    href: '/projects/supper',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <SocialRoomSection />
      
      {/* ThreeSliderSectionV2 solo en desktop (lg y superior) */}
      <div className="hidden lg:block">
        <ThreeSliderSectionV2 />
      </div>
      
      {/* FeaturedWork solo en móvil y tablet (menor a lg) */}
      <div className="block lg:hidden">
        <FeaturedWork projects={projects} />
      </div>
      
      <TeamSection />
      <ServicesCarouselSection />
      <ContactFooterSection />
      <FloatingProjectsButton />
    </main>
  );
}
