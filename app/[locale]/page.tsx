import HeroSection from '../components/HeroSection';
import SocialRoomSection from '../components/SocialRoomSection';
import ThreeSliderSectionV2 from '../components/ThreeSliderSectionV2';
import FeaturedWork from '../components/FeaturedWork';
import TeamSection from '../components/TeamSection';
import ServicesCarouselSection from '../components/ServicesCarouselSection';
import ContactFooterSection from '../components/ContactFooterSection';
import FloatingProjectsButton from '../components/FloatingProjectsButton';
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
  {
    id: 'enfoque',
    title: 'Enfoque',
    category: 'focus',
    imageUrl: getImageUrl('enfoque', 'Mesa de trabajo 42.png'),
    href: '/projects/enfoque',
  },
  {
    id: 'supper',
    title: 'Supper',
    category: 'premium',
    imageUrl: getImageUrl('supper', 'Mesa de trabajo 97.png'),
    href: '/projects/supper',
  },
  {
    id: 'kitckly',
    title: 'Kitckly',
    category: 'food & beverage',
    imageUrl: getImageUrl('kitckly', 'Mesa de trabajo 45.png'),
    href: '/projects/kitckly',
  },
];

export default function Home() {
  // Debug: mostrar URLs en consola
  if (typeof window !== 'undefined') {
    console.log('📸 Projects URLs:', projects.map(p => ({ id: p.id, url: p.imageUrl })));
  }

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
