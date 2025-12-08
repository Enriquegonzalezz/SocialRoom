'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from '@/app/hooks/useTranslation';
import { getImageUrl } from '@/lib/supabase-images';
import { preloadImagesWithDelay } from '@/lib/image-preloader';
import ImageSkeleton from '@/app/components/ImageSkeleton';

gsap.registerPlugin(ScrollTrigger);

// Datos de los proyectos con descripción e imágenes de Supabase
const projectsData: Record<string, any> = {
  'auge': {
    title: 'Auge',
    subtitle: 'Brand Experience Design',
    category: 'branding • design • strategy',
    year: '2025',
    client: 'Auge Studio',
    role: 'Creative Direction',
    heroImage: getImageUrl('auge', 'auge-08.jpg'),
    description: `En Auge, nuestra filosofía se cimenta en una estructura simple, pero profunda, que garantiza la excelencia en cada creación. Esta estructura se sintetiza en las cuatro letras de nuestro nombre, reflejando una precisión arquitectónica y una transparencia total en el arte de la orfebrería moderna.

Nuestro compromiso es con la disciplina del diseño y la consistencia de la mano experta. Rechazamos el brillo efímero por la permanencia del detalle. Las ideas audaces que imaginas no solo son materializadas; son cinceladas bajo la exigencia de la perfección para convertirse en un legado personal.`,
    images: [
      getImageUrl('auge', 'auge-01.jpg'),
      getImageUrl('auge', 'auge-02.jpg'),
      getImageUrl('auge', 'auge-03.jpg'),
      getImageUrl('auge', 'auge-04.jpg'),
      getImageUrl('auge', 'auge-05.jpg'),
      getImageUrl('auge', 'auge-06.jpg'),
      getImageUrl('auge', 'auge-07.jpg'),
      getImageUrl('auge', 'auge-26.jpg'),
      getImageUrl('auge', 'auge-09.jpg'),
      getImageUrl('auge', 'auge-10.jpg'),
    ],
  },
  'leap': {
    title: 'Leap',
    subtitle: 'Innovation Platform',
    category: 'design • development • innovation',
    year: '2024',
    client: 'Leap Inc.',
    role: 'Full Stack Development',
    heroImage: getImageUrl('L4h', 'Mesa de trabajo 54.png'),
    description: 'Nuestro lenguaje gráfico fue creado para ser visto y sentido. Con formas audaces, contrastes marcados y composiciones dinámicas, transforma cada aplicación en una declaración visual. 2025 Más que una cuestión estética, es identidad en movimiento, visible, expresiva y fiel a la esencia de la marca. El estilo fotográfico de L4H refleja con autenticidad los valores y la energía de nuestra comunidad. Vibrante, audaz y lleno de actitud, no solo captura imágenes — comunica transformación. Con encuadres libres y ángulos inesperados, la fotografía nos posiciona como participantes activos junto a nuestros héroes 2025',
    images: [
      getImageUrl('L4h', 'Mesa de trabajo 54.png'),
      getImageUrl('L4h', 'Mesa de trabajo 55.png'),
      getImageUrl('L4h', 'Mesa de trabajo 56.png'),
      getImageUrl('L4h', 'Mesa de trabajo 57.png'),
      getImageUrl('L4h', 'Mesa de trabajo 58.png'),
      getImageUrl('L4h', 'Mesa de trabajo 59.png'),
      getImageUrl('L4h', 'Mesa de trabajo 60.png'),
      getImageUrl('L4h', 'Mesa de trabajo 61.png'),
      getImageUrl('L4h', 'Mesa de trabajo 63.png'),
      getImageUrl('L4h', 'Mesa de trabajo 64.png'),
      getImageUrl('L4h', 'Mesa de trabajo 65.png'),
      getImageUrl('L4h', 'Mesa de trabajo 66.png'),
      getImageUrl('L4h', 'Mesa de trabajo 67.png'),
      getImageUrl('L4h', 'Mesa de trabajo 68.png'),
      getImageUrl('L4h', 'Mesa de trabajo 69.png'),
      getImageUrl('L4h', 'Mesa de trabajo 70.png'),
      getImageUrl('L4h', 'Mesa de trabajo 71.png'),
      getImageUrl('L4h', 'Mesa de trabajo 72.png'),
      getImageUrl('L4h', 'Mesa de trabajo 73.png'),
      getImageUrl('L4h', 'Mesa de trabajo 74.png'),
      getImageUrl('L4h', 'Mesa de trabajo 75.png'),
    ],
  },
  'leble': {
    title: 'Leble',
    subtitle: 'Web Experience',
    category: 'web • design • development',
    year: '2024',
    client: 'Leble Studios',
    role: 'UX/UI Design',
    heroImage: getImageUrl('leble', 'leble-01.jpg'),
    description: 'Experiencia web excepcional con diseño intuitivo y desarrollo robusto.',
    images: [
      getImageUrl('leble', 'leble-01.jpg'),
      getImageUrl('leble', 'leble-02.jpg'),
      getImageUrl('leble', 'leble-03.jpg'),
      getImageUrl('leble', 'leble-04.jpg'),
      getImageUrl('leble', 'leble-05.jpg'),
      getImageUrl('leble', 'leble-06.jpg'),
      getImageUrl('leble', 'leble-07.jpg'),
      getImageUrl('leble', 'leble-08.jpg'),
      getImageUrl('leble', 'leble-09.jpg'),
      getImageUrl('leble', 'leble-10.jpg'),
      getImageUrl('leble', 'leble-11.jpg'),
      getImageUrl('leble', 'leble-12.jpg'),
      getImageUrl('leble', 'leble-13.jpg'),
      getImageUrl('leble', 'leble-14.jpg'),
      getImageUrl('leble', 'leble-15.jpg'),
    ],
  },
  'lgm': {
    title: 'LGM',
    subtitle: 'Strategic Branding',
    category: 'strategy • design • branding',
    year: '2025',
    client: 'LGM Group',
    role: 'Brand Strategy',
    heroImage: getImageUrl('lgm', 'LGM-01.jpg'),
    description: 'Estrategia de marca que define la identidad corporativa con precisión.',
    images: [
      getImageUrl('lgm', 'LGM-01.jpg'),
      getImageUrl('lgm', 'LGM-02.jpg'),
      getImageUrl('lgm', 'LGM-03.jpg'),
      getImageUrl('lgm', 'LGM-04.jpg'),
      getImageUrl('lgm', 'LGM-05.jpg'),
      getImageUrl('lgm', 'LGM-06.jpg'),
      getImageUrl('lgm', 'LGM-07.jpg'),
      getImageUrl('lgm', 'LGM-08.jpg'),
      getImageUrl('lgm', 'LGM-09.jpg'),
      getImageUrl('lgm', 'LGM-10.jpg'),
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
  //   description: `Enfóque es un ecosistema fitness desarrollado a partir de la idea de entrenar enfocado, tanto en el cuerpo como en la mente y en los objetivos personales. El nombre adoptado para la marca refleja claramente su propuesta y lo que quiere ofrecer: un espacio que ayuda a las personas a dirigir su atención hacia lo que importa, sin distracciones.

  // La propuesta es ofrecer un ambiente accesible pero bien estructurado, que entregue organización, claridad y enfoque. Se aleja de los excesos de lenguaje y distracciones, alineando cuerpo y mente con los objetivos personales de cada consumidor.

  // Así se construye un público sólido y fiel que vivirá la experiencia del ecosistema de marca.`,
  //   images: [
  //     getImageUrl('enfoque', 'Mesa de trabajo 40.png'),
  //     getImageUrl('enfoque', 'Mesa de trabajo 42.png'),
  //     getImageUrl('enfoque', 'Mesa de trabajo 43.png'),
  //     getImageUrl('enfoque', 'Mesa de trabajo 44.png'),
  //     getImageUrl('enfoque', 'Mesa de trabajo 45.png'),
  //     getImageUrl('enfoque', 'Mesa de trabajo 46.png'),
  //     getImageUrl('enfoque', 'Mesa de trabajo 47.png'),
  //     getImageUrl('enfoque', 'Mesa de trabajo 48.png'),
  //     getImageUrl('enfoque', 'Mesa de trabajo 49.png'),
  //     getImageUrl('enfoque', 'Mesa de trabajo 50.png'),
  //     getImageUrl('enfoque', 'Mesa de trabajo 51.png'),
  //     getImageUrl('enfoque', 'Mesa de trabajo 52.png'),
  //     getImageUrl('enfoque', 'Mesa de trabajo 53.png'),
  //     getImageUrl('enfoque', 'Mesa de trabajo 54.png'),
  //     getImageUrl('enfoque', 'Mesa de trabajo 55.png'),
  //     getImageUrl('enfoque', 'Mesa de trabajo 56.png'),
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
  //   description: 'Kitckly es una marca de alimentos y bebidas que combina calidad, innovación y experiencia culinaria. Nuestro enfoque es crear una identidad visual que refleje la esencia de la marca y conecte con el público objetivo.',
  //   images: [
  //     getImageUrl('kitckly', 'Mesa de trabajo 33.png'),
  //     getImageUrl('kitckly', 'Mesa de trabajo 34.png'),
  //     getImageUrl('kitckly', 'Mesa de trabajo 35.png'),
  //     getImageUrl('kitckly', 'Mesa de trabajo 36.png'),
  //     getImageUrl('kitckly', 'Mesa de trabajo 37.png'),
  //     getImageUrl('kitckly', 'Mesa de trabajo 38.png'),
  //     getImageUrl('kitckly', 'Mesa de trabajo 39.png'),
  //     getImageUrl('kitckly', 'Mesa de trabajo 40.png'),
  //     getImageUrl('kitckly', 'Mesa de trabajo 41.png'),
  //     getImageUrl('kitckly', 'Mesa de trabajo 42.png'),
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
  const descriptionRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!project) return;

    // Precargar imágenes con delay para no sobrecargar
    if (project.images && project.images.length > 0) {
      preloadImagesWithDelay(project.images, 80).catch(err => 
        console.warn('Error preloading images:', err)
      );
    }

    // Animar hero
    if (heroRef.current) {
      gsap.from(heroRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      });
    }

    // Animar descripción
    if (descriptionRef.current) {
      gsap.from(descriptionRef.current, {
        scrollTrigger: {
          trigger: descriptionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
      });
    }

    // Animar imágenes con scroll trigger
    imagesRef.current.forEach((image, index) => {
      if (image) {
        gsap.from(image, {
          scrollTrigger: {
            trigger: image,
            start: 'top 80%',
            end: 'top 60%',
            toggleActions: 'play none none none',
          },
          opacity: 0,
          y: 100,
          duration: 1,
          ease: 'power3.out',
          delay: index * 0.1,
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

      {/* Description Section */}
      {project.description && (
        <section className="px-6 md:px-12 lg:px-16 py-20 border-b border-black/10">
          <div
            ref={descriptionRef}
            className="max-w-4xl mx-auto"
          >
            <p className="text-lg md:text-xl font-light leading-relaxed text-black/80 whitespace-pre-line">
              {project.description}
            </p>
          </div>
        </section>
      )}

      {/* Images Gallery Section */}
      {project.images && project.images.length > 0 && (
        <section className="px-6 md:px-12 lg:px-16 py-20">
          <div className="space-y-12">
            {project.images.map((imageUrl: string, index: number) => (
              <div
                key={index}
                ref={(el) => {
                  if (el) imagesRef.current[index] = el;
                }}
                className="relative w-full rounded-lg overflow-hidden bg-gray-100"
                style={{
                  aspectRatio: '16 / 9',
                }}
              >
                <ImageSkeleton
                  src={imageUrl}
                  alt={`${project.title} - Image ${index + 1}`}
                  className="w-full h-full"
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

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
