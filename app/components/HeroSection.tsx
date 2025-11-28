"use client";

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/app/hooks/useTranslation';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';

export default function HeroSection() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isDarkBackground, setIsDarkBackground] = useState<boolean>(true);
  const [showCowImage, setShowCowImage] = useState<boolean>(false);
  const homeRef = useRef<HTMLHeadingElement>(null);
  const projectsRef = useRef<HTMLHeadingElement>(null);
  const cowImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      // Throttle optimizado - solo ejecuta cuando el navegador está listo
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          const windowHeight = window.innerHeight;
          
          // Detectar si estamos sobre una sección con fondo negro (ServicesCarouselSection)
          const servicesSection = document.querySelector('[data-section="services-carousel"]');
          
          if (servicesSection) {
            const rect = servicesSection.getBoundingClientRect();
            const logoHeight = 100; // Altura aproximada del logo
            
            // Si el logo está sobre la sección negra, cambiar a blanco (no invertir)
            if (rect.top <= logoHeight && rect.bottom >= logoHeight) {
              setIsDarkBackground(true); // Logo blanco sobre fondo negro
            } else if (scrollPosition < windowHeight * 0.8) {
              // HeroSection (fondo negro)
              setIsDarkBackground(true);
            } else {
              // Otras secciones (fondo claro)
              setIsDarkBackground(false);
            }
          } else {
            // Fallback si no encuentra la sección
            setIsDarkBackground(scrollPosition < windowHeight * 0.8);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    // Passive listener para mejor rendimiento
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Llamar al inicio

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animar textos del drawer cuando se abre
  useEffect(() => {
    if (menuOpen) {
      // Animar Home
      if (homeRef.current) {
        gsap.from(homeRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: 'power3.out',
          delay: 0.1,
        });
      }

      // Animar Projects
      if (projectsRef.current) {
        gsap.from(projectsRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: 'power3.out',
          delay: 0.2,
        });
      }
    }
  }, [menuOpen]);

  // Animar imagen de vaca cuando aparece
  useEffect(() => {
    if (showCowImage && cowImageRef.current) {
      gsap.from(cowImageRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        ease: 'power3.out',
      });
    }
  }, [showCowImage]);

  return (
    <section
      className="relative min-h-screen bg-black text-white overflow-hidden"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Logo centrado fijo en todo el documento - Cambia de color según el fondo */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 py-6 md:py-8">
        <div className={`transition-all duration-700 ease-in-out ${
          menuOpen ? 'invert' : (isDarkBackground ? '' : 'invert')
        }`}>
          <Image src="/socialroomblanco.svg" alt="Logo" width={250} height={250} className="md:w-[300px]" />
        </div>
      </div>

      {/* Menu Hamburguesa - A la izquierda, cambia de color con animación suave */}
      <button 
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-6 md:top-8 left-6 md:left-12 z-50 flex flex-col gap-1.5 md:gap-2 w-8 h-8 md:w-10 md:h-10 justify-center items-center group"
        aria-label="Menu"
      >
        <span className={`w-full h-0.5 transition-all duration-700 ease-in-out ${isDarkBackground ? 'bg-white' : 'bg-black'} ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`w-full h-0.5 transition-all duration-700 ease-in-out ${isDarkBackground ? 'bg-white' : 'bg-black'} ${menuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`w-full h-0.5 transition-all duration-700 ease-in-out ${isDarkBackground ? 'bg-white' : 'bg-black'} ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Drawer/Menu Lateral - Se abre desde la derecha */}
      {menuOpen && (
        <div className="fixed inset-0 z-40">
          {/* Overlay oscuro */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Drawer desde la derecha - Ocupa 100% de altura */}
          <div className="absolute right-0 top-0 h-full w-full bg-[#f3f3f3] shadow-2xl">
            {/* Grid de 3 columnas - Home, Projects, Employees */}
            <div className="grid grid-cols-3 h-full relative">
              {/* Columna 1 - Home (50%) */}
              <div className="flex flex-col items-center justify-center border-r border-black/10 hover:bg-black/5 transition-colors cursor-pointer group">
                <button onClick={() => setMenuOpen(false)} className="text-center w-full h-full flex items-center justify-center">
                  <h3 ref={homeRef} className="text-4xl md:text-6xl lg:text-7xl font-light text-black group-hover:text-black/70 transition-colors">
                    Home
                  </h3>
                </button>
              </div>
              
              {/* Columna 2 - Projects (33%) */}
              <div 
                className="flex flex-col items-center justify-center cursor-pointer group relative hover:bg-black/5 transition-colors"
                onMouseEnter={() => setShowCowImage(true)}
                onMouseLeave={() => setShowCowImage(false)}
              >
                <button 
                  onClick={() => {
                    setMenuOpen(false);
                    router.push(`/${locale}/projects`);
                  }} 
                  className="text-center w-full h-full flex items-center justify-center relative z-10"
                >
                  <h3 ref={projectsRef} className="text-4xl md:text-6xl lg:text-7xl font-light text-black group-hover:text-black/70 transition-colors">
                    Projects
                  </h3>
                </button>
              </div>

              {/* Columna 3 - Empleados/Employees (33%) */}
              <div className="flex flex-col items-center justify-center border-l border-black/10 hover:bg-black/5 transition-colors cursor-pointer group">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push(`/${locale}/equipment/login`);
                  }}
                  className="text-center w-full h-full flex items-center justify-center"
                >
                  <h3 className="text-2xl md:text-4xl lg:text-5xl font-light text-black group-hover:text-black/70 transition-colors">
                    {locale === 'es' ? 'Empleados' : 'Employees'}
                  </h3>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <div className="relative min-h-screen flex items-center justify-start px-6 md:px-12 lg:px-18 pb-32 md:pb-40 lg:pb-48">
        <div className="max-w-7xl w-full">
          <h2 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.7] md:leading-[0.7] lg:leading-[0.9] font-thermal font-thin tracking-tight">
            {t('hero.title')}
            <br />
            {t('hero.subtitle')}
            <br />
            {t('hero.description')}
          
          </h2>
          
        </div>
      </div>

      {/* Franja amarilla inferior (placeholder para futura sección) */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-20 lg:h-24 bg-[#233a28]"></div>
    </section>
  );
}
