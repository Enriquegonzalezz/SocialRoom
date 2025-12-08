'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/hooks/useTranslation';
import { getImageUrl } from '@/lib/supabase-images';

// Lazy load FeaturedWork para reducir carga inicial
const FeaturedWork = dynamic(() => import('../../components/FeaturedWork'), {
  loading: () => (
    <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>
  ),
});

const projects = [
  {
    id: '1',
    title: 'Auge',
    category: 'branding • design • strategy',
    imageUrl: getImageUrl('auge', 'auge-26.jpg'),
    href: '/projects/auge',
  },
  {
    id: '2',
    title: 'Leap',
    category: 'design • development • innovation',
    imageUrl: getImageUrl('L4h', 'Mesa de trabajo 54.png'),
    href: '/projects/leap',
  },
  {
    id: '3',
    title: 'Leble',
    category: 'web • design • development',
    imageUrl: getImageUrl('leble', 'leble-01.jpg'),
    href: '/projects/leble',
  },
  {
    id: '4',
    title: 'LGM',
    category: 'strategy • design • branding',
    imageUrl: getImageUrl('lgm', 'LGM-01.jpg'),
    href: '/projects/lgm',
  },
  // {
  //   id: '5',
  //   title: 'Enfoque',
  //   category: 'focus • strategy • design',
  //   imageUrl: getImageUrl('enfoque', 'Mesa de trabajo 42.png'),
  //   href: '/projects/enfoque',
  // },
  // {
  //   id: '6',
  //   title: 'Supper',
  //   category: 'premium • branding • design',
  //   imageUrl: getImageUrl('supper', 'Mesa de trabajo 97.png'),
  //   href: '/projects/supper',
  // },
  // {
  //   id: '7',
  //   title: 'Kitckly',
  //   category: 'food & beverage • branding • design',
  //   imageUrl: getImageUrl('kitckly', 'Mesa de trabajo 48.png'),
  //   href: '/projects/kitckly',
  // },
];

export default function ProjectsPage() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animar inmediatamente sin delays
    // Animar letras del título PROJECTS
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
        });
      }
    }

    // Animar número y flecha
    if (numberRef.current) {
      gsap.from(numberRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.6,
        delay: 0.1,
        ease: 'power3.out',
      });
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      {/* Header Section - Estilo Lusion */}
      <section className="relative px-6 md:px-12 lg:px-16 pt-20 ">
        {/* Logo en la esquina superior izquierda */}
        <button 
          onClick={() => router.push(`/${locale}`)}
          className="absolute top-8 left-6 md:left-12 lg:left-16 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <Image
            src="/socialroomnegro.svg"
            alt="Social Room"
            width={120}
            height={40}
            className="w-24 md:w-32"
          />
        </button>

        {/* Título grande PROJECTS */}
        <div className="flex items-center justify-between mt-16">
          <h1 
            ref={titleRef}
            className="text-[80px] sm:text-[120px] md:text-[180px] lg:text-[240px] font-bold leading-none tracking-tight text-black font-helvetica overflow-hidden"
            style={{ wordBreak: 'keep-all', overflowWrap: 'normal' }}
          >
            {t('projects.title')}
          </h1>
          
          {/* Número y flecha a la derecha */}
          <div ref={numberRef} className="flex flex-col items-end gap-4">
            <span className="text-6xl md:text-7xl lg:text-8xl font-light text-black font-helvetica">
              {projects.length}
            </span>
            <svg 
              width="60" 
              height="60" 
              viewBox="0 0 60 60" 
              fill="none" 
              className="text-black"
            >
              <path 
                d="M10 30H50M50 30L30 10M50 30L30 50" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Featured Work Section */}
      <FeaturedWork projects={projects} />
    </main>
  );
}
