"use client";

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/app/hooks/useTranslation';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/supabase-images';
import Image from 'next/image';
import ArrowIcon from '@/public/ArrowOutwardOutlined.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCreative, Parallax } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { gsap } from 'gsap';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-creative';
import 'swiper/css/parallax';
import { ArrowOutwardOutlined } from '@mui/icons-material';


// Proyectos destacados
const projects = [
  {
    id: 'auge',
    title: 'Auge',
    category: 'Branding',
    description: 'Unificamos su salud de todos los venezolanos en un solo lugar',
    imageUrl: getImageUrl('auge', 'auge-26.webp'),
  },
  {
    id: 'leap',
    title: 'Leap',
    category: 'Design',
    description: 'Plataforma digital innovadora para el futuro',
    imageUrl: getImageUrl('L4h', 'banner leap.webp'),
  },
  {
    id: 'leble',
    title: 'Leble',
    category: 'Development',
    description: 'Experiencia de usuario excepcional',
    imageUrl: getImageUrl('leble', 'portada leble.webp'),
  },
  {
    id: 'El maizal',
    title: 'El maizal',
    category: 'Strategy',
    description: 'Estrategia digital completa',
    imageUrl: getImageUrl('maizal', 'arepa de pernil.webp'),
  },
  
  

];

export default function PastClients() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // Animar textos con GSAP cuando cambia el slide
  const animateSlideContent = () => {
    gsap.fromTo(
      '.swiper-slide-active .slide-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
    gsap.fromTo(
      '.swiper-slide-active .slide-description',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' }
    );
  };

  // Detectar el índice activo del carrusel
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = carousel.offsetWidth;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProjectClick = (projectId: string) => {
    router.push(`/${locale}/projects/${projectId}`);
  };

  return (
    <section className="w-full relative">
      {/* Background para mobile */}
      <div className="md:hidden absolute inset-0" style={{ background: 'linear-gradient(to bottom, #1a2b4a 0%, #1a2b4a 55%, #f4f4f4 55%, #f4f4f4 100%)' }} />
      
      {/* Contenedor principal */}
      <div className=" mx-auto py-8 md:py-0 relative past-clients-container">
        
        {/* Layout Mobile - Carrusel */}
        <div className="lg:hidden">
          {/* Título */}
          <div className="mb-8 px-6">
            <h2 className="text-white text-2xl font-bold font-helvetica">
              {t('projects.our')}
            </h2>
            <h2 className="text-[#4a90e2] text-6xl font-bold mb-6 font-helvetica tracking-tighter whitespace-nowrap text-[clamp(2rem,14vw,10rem)]">
              {t('projects.title')}
            </h2>
            
            {/* Botón "Casos de éxito" */}
            <button
              onClick={() => router.push(`/${locale}/projects`)}
              className="group flex justify-center items-center gap-3 px-10 py-6 my-8 border-2 border-white text-white hover:bg-white hover:text-[#1a2b4a] transition-all duration-300 mx-auto"
            >
              <span className="text-[16px] font-light font-helvetica underline decoration-white underline-offset-5">{t('projects.successCases')}</span>
              <Image 
                src={ArrowIcon} 
                alt="Arrow" 
                width={20} 
                height={20}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 invert group-hover:invert-0"
              />
            </button>
          </div>

          {/* Carrusel de proyectos */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-6"
          >
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="shrink-0 w-full snap-start pl-6 first:pl-6 last:pr-6"
            >
              {/* Card del proyecto */}
              <div className="flex flex-col bg-transparent rounded-none overflow-hidden cursor-pointer group" onClick={() => handleProjectClick(project.id)}>
                
                {/* Imagen */}
                <div className="relative w-full h-[250px] md:h-[400px] overflow-hidden">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 "
                  />
                </div>

                {/* Contenido */}
                <div className="py-6 bg-transparent">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1a2b4a] mb-2 font-helvetica">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base font-light font-helvetica leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
          </div>

          {/* Indicadores de puntos estilo Instagram */}
          <div className="flex justify-center items-center gap-1.5 mt-8">
          {(() => {
            const totalSlides = projects.length;
            const maxDots = 5;
            
            // Si hay menos de 5 slides, mostrar todos
            if (totalSlides <= maxDots) {
              return projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const carousel = carouselRef.current;
                    if (carousel) {
                      const cardWidth = carousel.offsetWidth;
                      carousel.scrollTo({
                        left: cardWidth * index,
                        behavior: 'smooth',
                      });
                    }
                  }}
                  className={`transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-2 h-2 bg-[#202020]'
                      : 'w-2 h-2 bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ));
            }
            
            // Lógica para mostrar solo 5 puntos con escala
            const dots = [];
            const halfMax = Math.floor(maxDots / 2); // 2
            
            let startIndex = Math.max(0, activeIndex - halfMax);
            let endIndex = Math.min(totalSlides - 1, activeIndex + halfMax);
            
            // Ajustar si estamos cerca del inicio o final
            if (activeIndex < halfMax) {
              endIndex = Math.min(totalSlides - 1, maxDots - 1);
              startIndex = 0;
            } else if (activeIndex > totalSlides - halfMax - 1) {
              startIndex = Math.max(0, totalSlides - maxDots);
              endIndex = totalSlides - 1;
            }
            
            for (let i = startIndex; i <= endIndex; i++) {
              const distanceFromActive = Math.abs(i - activeIndex);
              
              // Calcular escala basada en la distancia del punto activo
              let scale = 1;
              let opacity = 1;
              
              if (distanceFromActive === 0) {
                scale = 1; // Punto activo - tamaño completo
                opacity = 1;
              } else if (distanceFromActive === 1) {
                scale = 0.75; // Puntos adyacentes
                opacity = 0.6;
              } else if (distanceFromActive === 2) {
                scale = 0.5; // Puntos en los extremos
                opacity = 0.4;
              }
              
              dots.push(
                <button
                  key={i}
                  onClick={() => {
                    const carousel = carouselRef.current;
                    if (carousel) {
                      const cardWidth = carousel.offsetWidth;
                      carousel.scrollTo({
                        left: cardWidth * i,
                        behavior: 'smooth',
                      });
                    }
                  }}
                  style={{
                    transform: `scale(${scale})`,
                    opacity: opacity,
                  }}
                  className={`transition-all duration-300 ${
                    i === activeIndex
                    ? 'w-2 h-2 bg-[#202020]'
                    : 'w-2 h-2 bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              );
            }
            
            return dots;
          })()}
          </div>
        </div>

        {/* Layout Desktop - Espacio para maquetación personalizada */}
        <div className="hidden lg:flex min-h-screen">
          {/* Lado izquierdo - 33% Fondo azul */}
          <div className="w-[35%]" style={{background: 'linear-gradient(to top, #1a2b4a 0%, #1a2b4a 90%, #f4f4f4 90%, #f4f4f4 100%)'}}>
            <div className="flex items-center justify-center h-full px-12 mt-4">
              <div className="flex flex-col items-center text-center">
                {/* Título NUESTROS */}
                <h2 className="text-white text-[38px] font-bold font-helvetica mb-2">
                  {t('projects.our')}
                </h2>
                {/* Título PROYECTOS dividido en líneas */}
                <h2 className="text-[#4a90e2] font-bold mb-12 font-helvetica tracking-tighter" style={{ fontSize: 'clamp(3rem, 13vw, 7rem)', lineHeight: '0.85' }}>
                  {t('projects.title').substring(0, 3)}<br/>{t('projects.title').substring(3, 6)}<br/>{t('projects.title').substring(6)}
                </h2>
                
                {/* Botón "Casos de éxito" */}
                <button
                  onClick={() => router.push(`/${locale}/projects`)}
                  className="group flex items-center gap-3 px-10 py-6 border-2 border-white text-white hover:bg-white hover:text-[#1a2b4a] transition-all duration-300"
                >
                  <span className="I text-base font-light font-helvetica underline decoration-white underline-offset-5">{t('projects.successCases')}</span>
                  <Image 
                    src={ArrowIcon} 
                    alt="Arrow" 
                    width={20} 
                    height={20}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1  group-hover:invert-0"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Lado derecho - 67% Contenido */}
          <div className="flex-1 bg-[#f4f4f4] flex items-center justify-center px-16 lg:px-24 xl:px-32 overflow-visible">
            <div className="relative w-full max-w-[680px] lg:max-w-[720px] xl:max-w-[800px] overflow-visible">
              <Swiper
                modules={[Navigation, EffectCreative, Parallax]}
                effect="creative"
                parallax={true}
                speed={800}
                slidesPerView={1}
                watchSlidesProgress={true}
                creativeEffect={{
                  prev: {
                    translate: ['120%', '100%', -300],
                    rotate: [0, 0, 0],
                    opacity: 0,
                    scale: 0.9,
                  },
                  next: {
                    translate: ['-32%', '-15%', -100],
                    rotate: [0, 0, 0],
                    opacity: 0.95,
                    scale: 1,
                  },
                }}
                onSwiper={(swiper: SwiperType) => {
                  swiperRef.current = swiper;
                }}
                onSlideChange={() => {
                  animateSlideContent();
                }}
                className="w-full overflow-visible"
                style={{ overflow: 'visible' }}
              >
                {projects.map((project) => (
                  <SwiperSlide key={project.id}>
                    {({ isActive }: { isActive: boolean }) => (
                      <div className="cursor-pointer" onClick={() => handleProjectClick(project.id)}>
                        {/* Imagen con parallax - Tamaño fijo para todas las tarjetas */}
                        <div className="relative w-full max-w-[680px] h-[430px] md:h-[430px] lg:h-[450px] xl:h-[480px] overflow-hidden mb-6 md:mb-8 mx-auto">
                          <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${project.imageUrl})` }}
                            data-swiper-parallax="-100"
                          />
                        </div>

                        {/* Contenido del proyecto - Solo visible en tarjeta activa */}
                        {isActive && (
                          <div className="bg-transparent w-full max-w-[680px] mx-auto">
                            <h3 className="slide-title text-2xl md:text-3xl font-bold text-black mb-2 md:mb-3 font-helvetica">
                              {project.title}
                            </h3>
                            <p className="slide-description text-gray-600 text-sm md:text-base font-light leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                              {project.description}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Controles de navegación - Siempre visibles fuera del Swiper */}
              <div className="w-full max-w-[680px] mx-auto flex justify-end gap-4 -mt-12 relative z-50">
                <button
                 ref={prevButtonRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    swiperRef.current?.slidePrev();
                  
                    
                  }}
                  className="w-12 h-12 bg-black text-white hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center relative z-50"
                  aria-label="Previous slide"
                >
                 <ArrowOutwardOutlined className='w-10 h-10 -rotate-90'/>
                </button>
                <button
                 ref={nextButtonRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    swiperRef.current?.slideNext();
                  }}
                  className="w-12 h-12 bg-black text-white hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center relative z-50"
                  aria-label="Next slide"
                >
                 <ArrowOutwardOutlined  className='w-10 h-10 rotate-90'/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
