'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { useTranslation } from '@/app/hooks/useTranslation';
import { getImageUrl } from '@/lib/supabase-images';

// Datos de proyectos
const projectsData: Record<string, {
  title: string;
  subtitle: string;
  category: string;
  year: string;
  client: string;
  role: string;
  heroImage: string;
  description: string;
  images: string[];
}> = {
  'auge': {
    title: 'Auge',
    subtitle: 'Branding & Strategy',
    category: 'branding • design • strategy',
    year: '2025',
    client: 'Auge',
    role: 'Brand Development',
    heroImage: getImageUrl('auge', 'auge-26.jpg'),
    description: 'Proyecto de branding integral para Auge, desarrollando una identidad visual moderna y coherente.',
    images: [
      getImageUrl('auge', 'auge-01.jpg'),
      getImageUrl('auge', 'auge-02.jpg'),
      getImageUrl('auge', 'auge-03.jpg'),
      getImageUrl('auge', 'auge-04.jpg'),
    ],
  },
  'leap': {
    title: 'Leap',
    subtitle: 'Design & Innovation',
    category: 'design • development • innovation',
    year: '2024',
    client: 'Leap 4 Health',
    role: 'UX/UI Design',
    heroImage: getImageUrl('L4h', 'Mesa de trabajo 54.png'),
    description: 'Diseño de experiencia de usuario innovadora para Leap 4 Health.',
    images: [
      getImageUrl('L4h', 'Mesa de trabajo 54.png'),
      getImageUrl('L4h', 'Mesa de trabajo 55.png'),
      getImageUrl('L4h', 'Mesa de trabajo 56.png'),
      getImageUrl('L4h', 'Mesa de trabajo 57.png'),
    ],
  },
  'leble': {
    title: 'Leble',
    subtitle: 'Web Design & Development',
    category: 'web • design • development',
    year: '2024',
    client: 'Leble',
    role: 'Full Stack Development',
    heroImage: getImageUrl('leble', 'leble-01.jpg'),
    description: 'Desarrollo web completo para Leble con diseño moderno y funcionalidad avanzada.',
    images: [
      getImageUrl('leble', 'leble-01.jpg'),
      getImageUrl('leble', 'leble-02.jpg'),
      getImageUrl('leble', 'leble-03.jpg'),
      getImageUrl('leble', 'leble-04.jpg'),
    ],
  },
  'lgm': {
    title: 'LGM',
    subtitle: 'Strategic Branding',
    category: 'strategy • design • branding',
    year: '2025',
    client: 'LGM',
    role: 'Brand Strategy',
    heroImage: getImageUrl('lgm', 'LGM-01.jpg'),
    description: 'Estrategia de marca integral para LGM, creando una identidad sólida y diferenciadora.',
    images: [
      getImageUrl('lgm', 'LGM-01.jpg'),
      getImageUrl('lgm', 'LGM-02.jpg'),
      getImageUrl('lgm', 'LGM-03.jpg'),
      getImageUrl('lgm', 'LGM-04.jpg'),
    ],
  },
  // 'enfoque': {
  //   title: 'Enfoque',
  //   subtitle: 'Focus Strategy Design',
  //   category: 'focus • strategy • design',
  //   year: '2025',
  //   client: 'Enfoque Studio',
  //   role: 'Strategic Design',
  //   heroImage: getImageUrl('enfoque', 'Mesa de trabajo 42.png'),
  //   description: `Enfóque es un ecosistema fitness desarrollado a partir de la idea de entrenar enfocado, tanto en el cuerpo como en la mente y en los objetivos personales.`,
  //   images: [
  //     getImageUrl('enfoque', 'Mesa de trabajo 40.png'),
  //     getImageUrl('enfoque', 'Mesa de trabajo 42.png'),
  //   ],
  // },
  // 'supper': {
  //   title: 'Supper',
  //   subtitle: 'Premium Brand Experience',
  //   category: 'premium • branding • design',
  //   year: '2025',
  //   client: 'Supper Inc.',
  //   role: 'Brand Development',
  //   heroImage: getImageUrl('supper', 'Mesa de trabajo 97.png'),
  //   description: 'Experiencia de marca premium con diseño exclusivo y desarrollo de calidad.',
  //   images: [
  //     getImageUrl('supper', 'Mesa de trabajo 97.png'),
  //   ],
  // },
  // 'kitckly': {
  //   title: 'Kitckly',
  //   subtitle: 'Food & Beverage Brand',
  //   category: 'food & beverage • branding • design',
  //   year: '2025',
  //   client: 'Kitckly',
  //   role: 'Brand & Design',
  //   heroImage: getImageUrl('kitckly', 'Mesa de trabajo 48.png'),
  //   description: 'Kitckly es una marca de alimentos y bebidas que combina calidad, innovación y experiencia culinaria.',
  //   images: [
  //     getImageUrl('kitckly', 'Mesa de trabajo 33.png'),
  //   ],
  // },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { locale } = useTranslation();
  const slug = params.slug as string;
  const project = projectsData[slug];

  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!project) return;

    // Animar inmediatamente sin delay
    // Animar hero image
    if (heroRef.current) {
      gsap.from(heroRef.current, {
        opacity: 0,
        scale: 1.1,
        duration: 0.8,
        ease: 'power3.out',
      });
    }

    // Animar título
    if (titleRef.current && titleRef.current.textContent) {
      const letters = titleRef.current.textContent.split('');
      titleRef.current.innerHTML = letters
        .map((letter) => `<span class="inline-block">${letter === ' ' ? '&nbsp;' : letter}</span>`)
        .join('');

      if (titleRef.current.children.length > 0) {
        gsap.from(titleRef.current.children, {
          y: 100,
          opacity: 0,
          duration: 0.6,
          stagger: 0.03,
          ease: 'power3.out',
          delay: 0.1,
        });
      }
    }
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Proyecto no encontrado</h1>
          <button
            onClick={() => router.push(`/${locale}/projects`)}
            className="px-6 py-3 bg-black text-white hover:bg-black/80 transition-colors"
          >
            Volver a proyectos
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      {/* Header con logo */}
      <section className="relative px-6 md:px-12 lg:px-16 pt-8">
        <button 
          onClick={() => router.push(`/${locale}`)}
          className="cursor-pointer hover:opacity-70 transition-opacity"
        >
          <Image
            src="/socialroomnegro.svg"
            alt="Social Room"
            width={120}
            height={40}
            className="w-24 md:w-32"
          />
        </button>
      </section>

      {/* Hero Section */}
      <section className="px-6 md:px-12 lg:px-16 pt-12 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Título del proyecto */}
          <h1 
            ref={titleRef}
            className="text-[80px] md:text-[120px] lg:text-[160px] font-bold leading-none tracking-tight text-black font-helvetica mb-8 overflow-hidden"
          >
            {project.title}
          </h1>

          {/* Hero Image */}
          <div ref={heroRef} className="relative w-full aspect-video mb-12 overflow-hidden rounded-2xl">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Project Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div>
              <h3 className="text-sm font-bold text-black/50 mb-2 font-helvetica">CATEGORÍA</h3>
              <p className="text-lg text-black font-helvetica">{project.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-black/50 mb-2 font-helvetica">AÑO</h3>
              <p className="text-lg text-black font-helvetica">{project.year}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-black/50 mb-2 font-helvetica">CLIENTE</h3>
              <p className="text-lg text-black font-helvetica">{project.client}</p>
            </div>
          </div>

          {/* Description */}
          <div className="max-w-3xl mb-20">
            <p className="text-xl md:text-2xl text-black/80 leading-relaxed font-helvetica font-light">
              {project.description}
            </p>
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-1 gap-8">
            {project.images.map((image, index) => (
              <div key={index} className="relative w-full aspect-video overflow-hidden rounded-2xl">
                <Image
                  src={image}
                  alt={`${project.title} - ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Back Button */}
      <section className="px-6 md:px-12 lg:px-16 pb-20">
        <button
          onClick={() => router.push(`/${locale}/projects`)}
          className="group flex items-center gap-4 text-black hover:gap-6 transition-all duration-300"
        >
          <svg 
            width="60" 
            height="60" 
            viewBox="0 0 60 60" 
            fill="none" 
            className="text-black group-hover:-translate-x-2 transition-transform"
          >
            <path 
              d="M50 30H10M10 30L30 50M10 30L30 10" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-2xl font-helvetica">Volver a proyectos</span>
        </button>
      </section>
    </main>
  );
}
