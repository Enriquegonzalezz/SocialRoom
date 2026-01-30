"use client";

import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import Link from 'next/link';
import { getImageUrl } from '@/lib/supabase-images';
import { useTranslation } from '@/app/hooks/useTranslation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ArrowIcon from '@/public/ArrowOutwardOutlined.svg';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

// Keys para las traducciones y filenames
const serviceKeys = ['offline', 'online', 'estrategia', 'eventos'] as const;
const serviceFilenames = ['OFFLINE.jpg', 'ONLINE.jpg', 'ESTRATEGIA.jpg', 'EVENTOS.jpg'];

interface ServiceData {
  title: string;
  description: string;
  filename: string;
}

// Componente de tarjeta reutilizable
const ServiceCard = ({ service, longestTitle }: { service: ServiceData; longestTitle: string }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleFontSize, setTitleFontSize] = useState('clamp(1.5rem, 8vw, 3.5rem)');

  useEffect(() => {
    const adjustTitleSize = () => {
      if (titleRef.current) {
        const container = titleRef.current.parentElement;
        if (!container) return;

        // Obtener el ancho disponible (restando padding)
        const padding = parseFloat(
          getComputedStyle(container).padding || 
          getComputedStyle(container).paddingLeft || 
          '1rem'
        );
        const availableWidth = container.clientWidth - (padding * 2);

        // Crear un elemento temporal para medir la palabra más larga
        const tempSpan = document.createElement('span');
        tempSpan.textContent = longestTitle;
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.font = getComputedStyle(titleRef.current).font;
        tempSpan.style.whiteSpace = 'nowrap';
        document.body.appendChild(tempSpan);
        
        const longestTextWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);

        // Si el texto más largo se desborda, reducir font-size
        if (longestTextWidth > availableWidth) {
          const ratio = availableWidth / longestTextWidth;
          const currentSize = parseFloat(getComputedStyle(titleRef.current).fontSize);
          const newSize = currentSize * ratio * 0.95; // 0.95 para margen de seguridad
          setTitleFontSize(`${newSize}px`);
        }
      }
    };

    // Ajustar al montar y en resize
    adjustTitleSize();
    window.addEventListener('resize', adjustTitleSize);
    return () => window.removeEventListener('resize', adjustTitleSize);
  }, []);

  return (
    <div className="group relative overflow-hidden transition-transform duration-500 hover:scale-[1.02] cursor-pointer">
      <div 
        className="relative w-full aspect-4/5 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${getImageUrl('others', service.filename)})` }}
      >
        {/* Overlay oscuro sutil */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Contenido de texto */}
        <div className="absolute inset-0 flex flex-col justify-end p-[clamp(1rem,5vw,2.5rem)]">
          <h3 
            ref={titleRef}
            className="font-bold text-white mb-[clamp(0.5rem,2vh,1rem)] font-helvetica tracking-tight whitespace-nowrap"
            style={{
              fontSize: titleFontSize,
              lineHeight: 'clamp(1.8rem, 9vw, 4rem)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {service.title}
          </h3>
          <p 
            className="text-white/90 font-light font-helvetica leading-relaxed"
            style={{
              fontSize: 'clamp(0.75rem, 2.5vw, 1.125rem)',
              lineHeight: 'clamp(1rem, 3.5vw, 1.75rem)',
              maxWidth: 'clamp(200px, 90%, 500px)',
            }}
          >
            {service.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function SocialRoomSection() {
  const { t, locale } = useTranslation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTextRef = useRef<HTMLDivElement>(null);

  // Generar servicios desde las traducciones
  const services: ServiceData[] = serviceKeys.map((key, index) => ({
    title: t(`socialRoom.${key}.title`),
    description: t(`socialRoom.${key}.description`),
    filename: serviceFilenames[index],
  }));

  // Encontrar la palabra más larga para calcular el font-size uniforme (solo para desktop)
  const longestTitle = services.reduce((longest, service) => 
    service.title.length > longest.length ? service.title : longest
  , '');

  // Animación de scroll horizontal del SVG (solo desktop)
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        if (scrollTextRef.current) {
          // Establecer opacidad inicial a 0 para evitar FOUC
          gsap.set(scrollTextRef.current, { opacity: 1 });

          // Animación de desplazamiento
          gsap.to(scrollTextRef.current, {
            x: "-150%",
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: scrollContainerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }
      });
    }, scrollContainerRef);

    return () => ctx.revert();
  }, []);

  // Detectar el índice activo del carrusel en móvil
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

  return (
   <section 
      ref={scrollContainerRef}
      className="relative w-full bg-[#f3f3f3] md:pt-20 md:pb-10 pt-8 overflow-hidden"
    >
      {/* --- MÓVIL: PNG ESTÁTICO --- */}
      <div 
        className="absolute top-0 left-0 right-0 md:hidden pointer-events-none z-0"
        style={{
          backgroundImage: 'url(/Soluciones.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          height: '40vh'
        }}
      />

      {/* --- DESKTOP: SVG ANIMADO --- */}
      <div 
        className="hidden md:block absolute top-10 left-[70%] pointer-events-none z-0 -mt-20"
        ref={scrollTextRef}
      >
        <img 
          src="/Soluciones (Stroke).png" 
          alt="Soluciones" 
          className="w-auto max-w-none h-[35vh] will-change-transform"
          onLoad={() => ScrollTrigger.refresh()}
        />
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="max-w-[1300px] mx-auto relative z-10">
        <h2 className="text-[32px] md:text-5xl font-bold text-black mb-8 md:mb-12 font-helvetica px-5 ">
          {t('socialRoom.scaleProject')}
        </h2>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-6"
          >
            {services.map((service, index) => (
              <div
                key={index}
                className="shrink-0 w-full snap-start pl-6 first:pl-6 "
              >
                <Link href={`/${locale}/services/${serviceKeys[index]}`} className="block">
                  <div className="flex flex-col bg-transparent overflow-hidden h-full">
                    {/* Imagen estática en móvil (sin video) */}
                    <div 
                      className="relative w-full bg-cover bg-center aspect-4/5 overflow-hidden"
                      style={{ backgroundImage: `url(${getImageUrl('others', service.filename)})` }}
                    >
                      <div className="absolute inset-0 bg-black/10" />
                    </div>  
                    
                    {/* Contenido con altura fija para alinear botones */}
                    <div className="pt-6 bg-transparent flex flex-col" style={{ minHeight: '180px' }}>
                      <h3 className="text-3xl font-bold text-black mb-4 font-helvetica">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-sm font-light font-thermal leading-relaxed">
                        {service.description}
                      </p>
                      <button className="flex items-center gap-2 text-black group mt-4">
                        <span className="text-[14px] font-light underline underline-offset-4 font-helvetica pb-1">{t('socialRoom.seeMore')}</span>
                         <Image 
                          src={ArrowIcon} 
                          alt="Arrow" 
                          width={20} 
                          height={20}
                          className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 invert group-hover:invert-0"
                        />
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Indicadores estilo Instagram */}
          <div className="flex justify-center items-center gap-1.5 pb-4">
            {(() => {
              const totalSlides = services.length;
              const maxDots = 5;
              
              if (totalSlides <= maxDots) {
                return services.map((_, index) => (
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
              
              const dots = [];
              const halfMax = Math.floor(maxDots / 2);
              
              let startIndex = Math.max(0, activeIndex - halfMax);
              let endIndex = Math.min(totalSlides - 1, activeIndex + halfMax);
              
              if (activeIndex < halfMax) {
                endIndex = Math.min(totalSlides - 1, maxDots - 1);
                startIndex = 0;
              } else if (activeIndex > totalSlides - halfMax - 1) {
                startIndex = Math.max(0, totalSlides - maxDots);
                endIndex = totalSlides - 1;
              }
              
              for (let i = startIndex; i <= endIndex; i++) {
                const distanceFromActive = Math.abs(i - activeIndex);
                let scale = 1;
                let opacity = 1;
                
                if (distanceFromActive === 0) {
                  scale = 1;
                  opacity = 1;
                } else if (distanceFromActive === 1) {
                  scale = 0.75;
                  opacity = 0.6;
                } else if (distanceFromActive === 2) {
                  scale = 0.5;
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
                        ? 'w-4 h-4 bg-[#202020]'
                        : 'w-3 h-3 bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                );
              }
              
              return dots;
            })()}
          </div>
        </div>

        {/* Tablet Carousel - 2 items at a time */}
        <div className="hidden md:block xl:hidden ml-4">
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-5 gap-6">
            {services.map((service, index) => (
              <div key={index} className={`shrink-0 w-[calc(50%-12px)] ${index % 2 === 0 ? 'snap-start' : ''} group/card`}>
                <Link href={`/${locale}/services/${serviceKeys[index]}`} className="block">
                  <div className="flex flex-col bg-transparent overflow-hidden h-full transition-transform duration-300 group-hover/card:scale-105">
                    {/* Imagen con hover para GIF/Video */}
                    <div 
                      className="relative w-full bg-cover bg-center aspect-[4/5] overflow-hidden max-h-[500px]"
                      style={{ backgroundImage: `url(${getImageUrl('others', service.filename)})` }}
                    >
                      <div className="absolute inset-0 bg-black/10" />
                      
                      {/* Video para Offline - aparece en hover */}
                      {serviceKeys[index] === 'offline' && (
                        <video
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 group-hover/card:scale-105"
                          src="/Offline. VIDEO mp4.mp4"
                          muted
                          loop
                          playsInline
                          preload="none"
                          onMouseEnter={(e) => {
                            const video = e.currentTarget;
                            if (video.paused) {
                              video.play().catch(() => {});
                            }
                          }}
                        />
                      )}
                      
                      {/* Video para Online - aparece en hover */}
                      {serviceKeys[index] === 'online' && (
                        <video
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 group-hover/card:scale-105"
                          src="/Online negro mp4.mp4"
                          muted
                          loop
                          playsInline
                          preload="none"
                          onMouseEnter={(e) => {
                            const video = e.currentTarget;
                            if (video.paused) {
                              video.play().catch(() => {});
                            }
                          }}
                        />
                      )}
                      
                      {/* Video para Eventos - aparece en hover */}
                      {serviceKeys[index] === 'eventos' && (
                        <video
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 group-hover/card:scale-105"
                          src="/Eventos-video.mp4"
                          muted
                          loop
                          playsInline
                          preload="none"
                          onMouseEnter={(e) => {
                            const video = e.currentTarget;
                            if (video.paused) {
                              video.play().catch(() => {});
                            }
                          }}
                        />
                      )}
                    </div>  
                    
                    {/* Contenido con altura fija para alinear botones */}
                    <div className="py-6 bg-transparent flex flex-col" style={{ minHeight: '180px' }}>
                      <h3 className="text-3xl font-bold text-black mb-4 font-helvetica">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-sm font-light font-thermal leading-relaxed mb-6">
                        {service.description}
                      </p>
                      <button className="flex items-center gap-2 text-black group mt-auto cursor-pointer">
                        <span className="text-[14px] font-light underline underline-offset-4 font-helvetica pb-1">{t('socialRoom.seeMore')}</span>
                         <Image 
                          src={ArrowIcon} 
                          alt="Arrow" 
                          width={20} 
                          height={20}
                          className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 invert group-hover:invert-0"
                        />
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Grid - 4 columns */}
        <div className="hidden xl:block px-5">
          <div className="grid grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="group/card">
                <Link href={`/${locale}/services/${serviceKeys[index]}`} className="block">
                  <div className="flex flex-col bg-transparent overflow-hidden h-full transition-transform duration-300 group-hover/card:scale-105">
                    {/* Imagen con hover para GIF/Video */}
                    <div 
                      className="relative w-full bg-cover bg-center aspect-[4/5] overflow-hidden"
                      style={{ backgroundImage: `url(${getImageUrl('others', service.filename)})` }}
                    >
                      <div className="absolute inset-0 bg-black/10" />
                      
                      {/* Video para Offline - aparece en hover */}
                      {serviceKeys[index] === 'offline' && (
                        <video
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 group-hover/card:scale-105"
                          src="/Offline. VIDEO mp4.mp4"
                          muted
                          loop
                          playsInline
                          preload="none"
                          onMouseEnter={(e) => {
                            const video = e.currentTarget;
                            if (video.paused) {
                              video.play().catch(() => {});
                            }
                          }}
                        />
                      )}
                      
                      {/* Video para Online - aparece en hover */}
                      {serviceKeys[index] === 'online' && (
                        <video
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 group-hover/card:scale-105"
                          src="/Online negro mp4.mp4"
                          muted
                          loop
                          playsInline
                          preload="none"
                          onMouseEnter={(e) => {
                            const video = e.currentTarget;
                            if (video.paused) {
                              video.play().catch(() => {});
                            }
                          }}
                        />
                      )}
                      
                      {/* Video para Eventos - aparece en hover */}
                      {serviceKeys[index] === 'eventos' && (
                        <video
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 group-hover/card:scale-105"
                          src="/Eventos-video.mp4"
                          muted
                          loop
                          playsInline
                          preload="none"
                          onMouseEnter={(e) => {
                            const video = e.currentTarget;
                            if (video.paused) {
                              video.play().catch(() => {});
                            }
                          }}
                        />
                      )}
                    </div>  
                    
                    {/* Contenido con altura fija para alinear botones */}
                    <div className="py-6 bg-transparent flex flex-col" style={{ minHeight: '180px' }}>
                      <h3 className="text-3xl font-bold text-black mb-4 font-helvetica">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-sm font-light font-thermal leading-relaxed mb-6">
                        {service.description}
                      </p>
                      <button className="flex items-center gap-2 text-black group mt-auto cursor-pointer">
                        <span className="text-[14px] font-light underline underline-offset-4 font-helvetica pb-1">{t('socialRoom.seeMore')}</span>
                         <Image 
                          src={ArrowIcon} 
                          alt="Arrow" 
                          width={20} 
                          height={20}
                          className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 invert group-hover:invert-0"
                        />
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

     
    </section>
  );
}
