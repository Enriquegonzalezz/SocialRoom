"use client";

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/app/hooks/useTranslation';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import SectionFooterButton from './SectionFooterButton';
import { getImageUrl } from '@/lib/supabase-images';

export default function HeroSection() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isDarkBackground, setIsDarkBackground] = useState<boolean>(true);
  const [showLogo, setShowLogo] = useState<boolean>(true);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerContentRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  
  // Obtener URL de la imagen de piel de jirafa desde Supabase
  const pielDeJirafaUrl = getImageUrl('others', 'pieljirafa.jpeg');
  

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      // Throttle optimizado - solo ejecuta cuando el navegador está listo
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          const windowHeight = window.innerHeight;
          
          // Detectar si estamos en la sección de contacto
          const contactSection = document.querySelector('[data-section="contact"]');
          
          if (contactSection) {
            const rect = contactSection.getBoundingClientRect();
            const logoHeight = 100; // Altura aproximada del logo
            
            // Si el logo está sobre la sección de contacto, ocultarlo
            if (rect.top <= logoHeight) {
              setShowLogo(false);
            } else {
              setShowLogo(true);
            }
          } else {
            setShowLogo(true);
          }
          
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

  // Animar drawer y textos cuando se abre
  useEffect(() => {
    if (menuOpen && drawerRef.current && drawerContentRef.current && navRef.current) {
      // Animar overlay
      const overlay = drawerRef.current.querySelector('.drawer-overlay');
      if (overlay) {
        gsap.from(overlay, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      // Animar drawer content
      gsap.from(drawerContentRef.current, {
        opacity: 0,
        x: -100,
        duration: 0.5,
        ease: 'power3.out',
      });

      // Animar botones de navegación con stagger
      const buttons = navRef.current.querySelectorAll('button');
      gsap.from(buttons, {
        opacity: 0,
        x: -50,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.2,
        ease: 'power2.out',
      });
    }
  }, [menuOpen]);


  return (
    <section
      className="relative min-h-screen bg-black text-white overflow-hidden"
      style={{
        backgroundImage: ``,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Logo centrado fijo en todo el documento - Cambia de color según el fondo */}
      {showLogo && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 py-6 md:py-8 transition-opacity duration-700">
          <div className={`transition-all duration-700 ease-in-out ${
            menuOpen ? 'invert' : (isDarkBackground ? '' : 'invert')
          }`}>
            <Image src="/socialroomblanco.svg" alt="Logo" width={250} height={250} className="md:w-[300px]" />
          </div>
        </div>
      )}

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

      {/* Drawer/Menu Lateral - Pantalla completa, lado izquierdo, estilo Shopify */}
      {menuOpen && (
        <div ref={drawerRef} className="fixed inset-0 z-40">
          {/* Overlay oscuro */}
          <div 
            className="drawer-overlay absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Drawer desde la izquierda - Pantalla completa */}
          <div ref={drawerContentRef} className="absolute left-0 top-0 h-full w-full bg-white flex flex-col">
            {/* Header con botón de cerrar */}
            <div className="flex justify-end items-center p-8 md:p-12">
              <button 
                onClick={() => setMenuOpen(false)}
                className="text-black hover:text-black/70 transition-colors will-change-transform"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Navegación - items grandes con fuente thermal */}
            <nav ref={navRef} className="flex-1 flex flex-col items-start justify-start px-8 md:px-12 lg:px-20 space-y-6 md:space-y-10">
              {/* Home */}
              <button 
                onClick={() => setMenuOpen(false)}
                className="text-5xl md:text-6xl lg:text-7xl font-light text-black hover:text-black/70 transition-colors font-thermal will-change-transform"
              >
                Home
              </button>
              
              {/* About */}
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  router.push(`/${locale}/about`);
                }}
                className="text-5xl md:text-6xl lg:text-7xl font-light text-black hover:text-black/70 transition-colors font-thermal will-change-transform"
              >
                About
              </button>
              
              {/* Services */}
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  router.push(`/${locale}/services`);
                }}
                className="text-5xl md:text-6xl lg:text-7xl font-light text-black hover:text-black/70 transition-colors font-thermal will-change-transform"
              >
                Services
              </button>
              
              {/* Projects */}
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  router.push(`/${locale}/projects`);
                }}
                className="text-5xl md:text-6xl lg:text-7xl font-light text-black hover:text-black/70 transition-colors font-thermal will-change-transform"
              >
                Projects
              </button>
              
              {/* Team */}
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  router.push(`/${locale}/team`);
                }}
                className="text-5xl md:text-6xl lg:text-7xl font-light text-black hover:text-black/70 transition-colors font-thermal will-change-transform"
              >
                Team
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <div className="relative min-h-screen flex items-center justify-start px-6 md:px-12 lg:px-18 pb-20">
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

      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-20 lg:h-24 bg-[#233a28] flex items-center justify-center">
        <button 
          onClick={() => {
            // Aquí puedes agregar la navegación a About Us
            router.push(`/${locale}/about`);
          }}
          className="relative px-10 py-3 border transition-all duration-500 ease-in-out cursor-pointer hover:scale-105 border-white hover:bg-white"
          style={{
            backgroundImage: `url(${pielDeJirafaUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '180px',
            minWidth: '160px',
            maxWidth: '180px',
          }}
        >
          {/* Overlay para mejorar legibilidad del texto */}
          <div className="absolute inset-0 bg-black/30 rounded-sm" />
          <span className="relative text-base md:text-lg font-helvetica font-medium tracking-wide text-white whitespace-nowrap flex items-center justify-center z-10">
            About Us
          </span>
        </button>
      </div>
    </section>
  );
}
