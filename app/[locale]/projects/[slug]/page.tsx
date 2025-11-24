'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from '@/app/hooks/useTranslation';

gsap.registerPlugin(ScrollTrigger);

// Datos de los proyectos (puedes moverlos a un archivo separado después)
const projectsData: Record<string, any> = {
  'auge': {
    title: 'Auge',
    subtitle: 'Brand Experience Design',
    category: 'branding • design • strategy',
    year: '2025',
    client: 'Auge Studio',
    role: 'Creative Direction',
    heroImage: '/auge1.png',
    sections: [
      {
        type: 'image',
        src: '/auge2.png',
        alt: 'Auge Project 2',
      },
      {
        type: 'image',
        src: '/auge3.png',
        alt: 'Auge Project 3',
      },
      {
        type: 'image',
        src: '/auge4.png',
        alt: 'Auge Project 4',
      },
    ],
  },
  'leap': {
    title: 'Leap',
    subtitle: 'Innovation Platform',
    category: 'design • development • innovation',
    year: '2024',
    client: 'Leap Inc.',
    role: 'Full Stack Development',
    heroImage: '/leap1.webp',
    sections: [
      {
        type: 'image',
        src: '/leap2.webp',
        alt: 'Leap Project 2',
      },
      {
        type: 'image',
        src: '/leap3.webp',
        alt: 'Leap Project 3',
      },
      {
        type: 'image',
        src: '/leap4.webp',
        alt: 'Leap Project 4',
      },
    ],
  },
  'leble': {
    title: 'Leble',
    subtitle: 'Web Experience',
    category: 'web • design • development',
    year: '2024',
    client: 'Leble Studios',
    role: 'UX/UI Design',
    heroImage: '/leble1.png',
    sections: [
      {
        type: 'image',
        src: '/leble2.png',
        alt: 'Leble Project 2',
      },
      {
        type: 'image',
        src: '/leble3.png',
        alt: 'Leble Project 3',
      },
      {
        type: 'image',
        src: '/leble4.png',
        alt: 'Leble Project 4',
      },
    ],
  },
  'lgm': {
    title: 'LGM',
    subtitle: 'Strategic Branding',
    category: 'strategy • design • branding',
    year: '2025',
    client: 'LGM Group',
    role: 'Brand Strategy',
    heroImage: '/lgm1.png',
    sections: [
      {
        type: 'image',
        src: '/supper1.png',
        alt: 'LGM Project 2',
      },
      {
        type: 'image',
        src: '/supper2.png',
        alt: 'LGM Project 3',
      },
      {
        type: 'image',
        src: '/supper3.png',
        alt: 'LGM Project 4',
      },
    ],
  },
  'enfoque': {
    title: 'Enfoque',
    subtitle: 'Focus Strategy Design',
    category: 'focus • strategy • design',
    year: '2025',
    client: 'Enfoque Studio',
    role: 'Strategic Design',
    heroImage: '/enfoque1.png',
    sections: [
      {
        type: 'image',
        src: '/enfoque2.png',
        alt: 'Enfoque Project 2',
      },
      {
        type: 'image',
        src: '/enfoque3.png',
        alt: 'Enfoque Project 3',
      },
      {
        type: 'image',
        src: '/enfoque4.png',
        alt: 'Enfoque Project 4',
      },
    ],
  },
  'supper': {
    title: 'Supper',
    subtitle: 'Premium Brand Experience',
    category: 'premium • branding • design',
    year: '2025',
    client: 'Supper Inc.',
    role: 'Brand Development',
    heroImage: '/supper1.png',
    sections: [
      {
        type: 'image',
        src: '/supper2.png',
        alt: 'Supper Project 2',
      },
      {
        type: 'image',
        src: '/supper3.png',
        alt: 'Supper Project 3',
      },
      {
        type: 'image',
        src: '/supper4.png',
        alt: 'Supper Project 4',
      },
    ],
  },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { locale } = useTranslation();
  const slug = params.slug as string;
  const project = projectsData[slug];

  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!project) return;

    // Animar hero
    if (heroRef.current) {
      gsap.from(heroRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      });
    }

    // Animar secciones con scroll trigger
    sectionsRef.current.forEach((section, index) => {
      if (section) {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 100,
          duration: 1,
          ease: 'power3.out',
        });
      }
    });
  }, [project]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project not found</h1>
          <button
            onClick={() => router.push(`/${locale}/projects`)}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      {/* Hero Section */}
      <section className="relative h-screen">
        <Image
          src={project.heroImage}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div ref={heroRef} className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 lg:px-16 pb-20">
          <p className="text-white/80 text-sm md:text-base mb-4 uppercase tracking-wider">
            {project.category}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold text-white mb-6 leading-none">
            {project.title}
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 font-light">
            {project.subtitle}
          </p>
        </div>

        {/* Back button */}
        <button
          onClick={() => router.push(`/${locale}/projects`)}
          className="fixed top-8 left-6 md:left-12 z-50 flex items-center gap-2 text-white hover:text-white/70 transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" />
          </svg>
          <span className="text-sm uppercase tracking-wider">Back</span>
        </button>
      </section>

      {/* Project Info */}
      <section className="px-6 md:px-12 lg:px-16 py-20 border-b border-black/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl">
          <div>
            <p className="text-sm uppercase tracking-wider text-black/50 mb-2">Year</p>
            <p className="text-2xl font-light">{project.year}</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-wider text-black/50 mb-2">Client</p>
            <p className="text-2xl font-light">{project.client}</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-wider text-black/50 mb-2">Role</p>
            <p className="text-2xl font-light">{project.role}</p>
          </div>
        </div>
      </section>

      {/* Content Sections - Alternating Image/Text */}
      {project.sections.map((section: any, index: number) => (
        <section
          key={index}
          ref={(el) => {
            if (el) sectionsRef.current[index] = el;
          }}
          className="px-6 md:px-12 lg:px-16 py-20"
        >
          {section.type === 'text' ? (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-black">
                {section.title}
              </h2>
              <p className="text-xl md:text-2xl font-light leading-relaxed text-black/80">
                {section.content}
              </p>
            </div>
          ) : (
            <div className="relative w-full h-[60vh] md:h-[80vh]">
              <Image
                src={section.src}
                alt={section.alt}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
        </section>
      ))}

      {/* Next Project CTA */}
      <section className="px-6 md:px-12 lg:px-16 py-32 text-center">
        <button
          onClick={() => router.push(`/${locale}/projects`)}
          className="group inline-flex flex-col items-center gap-4"
        >
          <span className="text-6xl md:text-8xl font-bold text-black group-hover:text-black/70 transition-colors">
            View All Projects
          </span>
          <svg 
            width="60" 
            height="60" 
            viewBox="0 0 60 60" 
            fill="none" 
            className="text-black group-hover:translate-x-2 transition-transform"
          >
            <path 
              d="M10 30H50M50 30L30 10M50 30L30 50" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </section>
    </main>
  );
}
