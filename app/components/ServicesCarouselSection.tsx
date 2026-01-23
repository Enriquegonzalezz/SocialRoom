"use client";

import { useRef, useLayoutEffect } from 'react';
import { useTranslation } from '@/app/hooks/useTranslation';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/supabase-images';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Image from 'next/image';
import ArrowIcon from '@/public/ArrowOutwardOutlined.svg';

gsap.registerPlugin(ScrollTrigger);


// Keys y filenames para los servicios
const serviceKeys = ['studio', 'podcast'] as const;
const serviceFilenames = ['STUDIO.jpg', 'PODCAST2.jpg'];

export default function ServicesCarouselSection() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTextRef = useRef<HTMLDivElement>(null);

  // Generar servicios desde las traducciones
  const services = serviceKeys.map((key, index) => ({
    title: t(`servicesCarousel.${key}.title`),
    description: t(`servicesCarousel.${key}.description`),
    filename: serviceFilenames[index],
  }));

  const handleServiceClick = () => {
    router.push(`/${locale}/theroom`);
  };

  // Animación de scroll horizontal del SVG (solo desktop)
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        if (scrollTextRef.current) {
          // Establecer opacidad inicial a 0 para evitar FOUC
          gsap.set(scrollTextRef.current, { opacity: 0 });

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

  return (
    <section 
      ref={scrollContainerRef}
      data-section="services-carousel" 
      className="w-full bg-black py-14 relative overflow-hidden"
    >
      {/* --- MÓVIL: PNG ESTÁTICO --- */}
      <div 
        className="absolute inset-0 md:hidden pointer-events-none  z-0"
        style={{
          backgroundImage: "url('/Otros servicios.png')",
          backgroundSize: '80%',
          backgroundPosition: 'center -75px',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* --- DESKTOP: SVG ANIMADO --- */}
      <div 
        className="hidden md:block absolute top-10 left-[70%] pointer-events-none z-0 -mt-20"
        ref={scrollTextRef}
      >
        <img 
          src="/Nuestros espacios (Stroke).svg" 
          alt="Nuestros espacios" 
          className="w-auto max-w-none h-[35vh] will-change-transform"
          onLoad={() => ScrollTrigger.refresh()}
        />
      </div>

      {/* Contenedor principal */}
      <div className="max-w-[1800px] mx-auto md:px-12 lg:px-20 relative z-10">
        
        {/* Carrusel en móvil / Grid en desktop */}
        <h2 className="text-white text-3xl md:text-4xl font-meidum tracking-wide mb-8 pl-6 font-helvetica ">Nuestros espacios</h2>
        <div className="flex md:grid md:grid-cols-2 gap-0 md:gap-12 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-hide px-6 md:px-0">
          {services.map((service, index) => (
            <div
              key={index}
              className="shrink-0 w-full md:w-auto snap-start md:snap-none pl-6 md:pl-0 first:pl-6 last:pr-6 md:last:pr-0 group cursor-pointer"
              onClick={handleServiceClick}
            >
              {/* Card con nueva estructura */}
              <div className="flex flex-col">
              
                <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden mb-6">
                  <Image
                    src={getImageUrl('others', service.filename)}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 aspect-video"
                  />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 font-helvetica tracking-tight">
                  {service.title}
                </h3>
                <p className="text-white/70 text-sm md:text-base font-light font-helvetica leading-relaxed mb-4">
                  {service.description}
                </p>
                <button 
                  className="flex items-center gap-2 text-white mt-2 group-hover:gap-3 transition-all duration-300 self-start"
                  onClick={handleServiceClick}
                >
                  <span className="text-sm font-light underline underline-offset-4">See more</span>
                  <Image 
                    src={ArrowIcon} 
                    alt="Arrow" 
                    width={16} 
                    height={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

   
    </section>
  );
}
