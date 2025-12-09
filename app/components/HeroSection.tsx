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
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerContentRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  
  // Obtener URL de la imagen del botón (codificada para espacios)
  const botonSocialRoomUrl = encodeURI('/muchachos/SOCIAL ROOM BOTON.webp');
  
  // Precargar imagen de fondo
  useEffect(() => {
    const img = new window.Image();
    img.src = '/muchachos/fotovaca[1].webp';
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true);
  }, []);
  

  useEffect(() => {
    let ticking = false;
    // Cache de elementos DOM - solo buscar una vez
    let contactSection: Element | null = null;
    let servicesSection: Element | null = null;
    let elementsFound = false;

    const findElements = () => {
      if (!elementsFound) {
        contactSection = document.querySelector('[data-section="contact"]');
        servicesSection = document.querySelector('[data-section="services-carousel"]');
        elementsFound = true;
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Buscar elementos solo si no se han encontrado
          findElements();
          
          const scrollPosition = window.scrollY;
          const windowHeight = window.innerHeight;
          const logoHeight = 100;
          
          // Detectar si estamos en la sección de contacto
          if (contactSection) {
            const rect = contactSection.getBoundingClientRect();
            setShowLogo(rect.top > logoHeight);
          } else {
            setShowLogo(true);
          }
          
          // Detectar si estamos sobre una sección con fondo negro
          if (servicesSection) {
            const rect = servicesSection.getBoundingClientRect();
            if (rect.top <= logoHeight && rect.bottom >= logoHeight) {
              setIsDarkBackground(true);
            } else {
              setIsDarkBackground(scrollPosition < windowHeight * 0.8);
            }
          } else {
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


  // Mostrar pantalla de carga mientras la imagen no está lista
  if (!imageLoaded) {
    return (
      <section className="relative min-h-screen bg-black text-white overflow-hidden" />
    );
  }

  return (
    <section
      className="relative min-h-screen bg-black text-white overflow-hidden"
      style={{
        backgroundImage: `url('/muchachos/fotovaca[1].webp')`,
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

      {/* Drawer/Menu Lateral - Minimalista */}
      {menuOpen && (
        <div ref={drawerRef} className="fixed inset-0 z-40 overflow-hidden">
          {/* Overlay oscuro */}
          <div 
            className="drawer-overlay absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Drawer - Más compacto y minimalista */}
          <div 
            ref={drawerContentRef} 
            className="absolute left-0 top-0 w-full sm:w-[400px] md:w-[450px] bg-white flex flex-col"
            style={{ height: '100dvh', maxHeight: '100dvh' }}
          >
            {/* Header con botón de cerrar */}
            <div className="flex-shrink-0 flex justify-end items-center p-4 sm:p-6">
              <button 
                onClick={() => setMenuOpen(false)}
                className="text-black hover:text-black/50 transition-colors p-2"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Navegación - Minimalista */}
            <nav ref={navRef} className="flex-1 flex flex-col items-start justify-center px-8 sm:px-10 md:px-12 space-y-4 sm:space-y-5 md:space-y-6">
              <button 
                onClick={() => setMenuOpen(false)}
                className="text-2xl sm:text-3xl md:text-4xl font-light text-black hover:text-black/50 transition-colors font-thermal tracking-wide"
              >
                {t('nav.home')}
              </button>
              
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  router.push(`/${locale}/about`);
                }}
                className="text-2xl sm:text-3xl md:text-4xl font-light text-black hover:text-black/50 transition-colors font-thermal tracking-wide"
              >
                {t('floatingButton.aboutUs')}
              </button>
              
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  router.push(`/${locale}/services`);
                }}
                className="text-2xl sm:text-3xl md:text-4xl font-light text-black hover:text-black/50 transition-colors font-thermal tracking-wide"
              >
                {t('floatingButton.services')}
              </button>
              
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  router.push(`/${locale}/projects`);
                }}
                className="text-2xl sm:text-3xl md:text-4xl font-light text-black hover:text-black/50 transition-colors font-thermal tracking-wide"
              >
                {t('nav.projects')}
              </button>
              
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  router.push(`/${locale}/team`);
                }}
                className="text-2xl sm:text-3xl md:text-4xl font-light text-black hover:text-black/50 transition-colors font-thermal tracking-wide"
              >
                {t('nav.team')}
              </button>
              
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  window.open('/equipment/login', '_blank');
                }}
                className="text-2xl sm:text-3xl md:text-4xl font-light text-black hover:text-black/50 transition-colors font-thermal tracking-wide"
              >
                {t('nav.employees')}
              </button>
            </nav>
            
            {/* Footer del menú */}
            <div className="flex-shrink-0 px-8 sm:px-10 md:px-12 py-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-light tracking-wider uppercase">Social Room</p>
            </div>
          </div>
        </div>
      )}

      {/* Contenido Principal */}
      <div className="relative min-h-screen flex items-center justify-start px-6 md:px-12 lg:px-18 pb-20">
        <div className="max-w-7xl w-full">
          <h2 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] md:leading-[0.9] lg:leading-[0.9] font-thermal font-thin tracking-tight">
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
          className="relative px-10 py-3 transition-all duration-500 ease-in-out cursor-pointer hover:scale-105"
          style={{
            backgroundImage: `url(${botonSocialRoomUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '180px',
            minWidth: '160px',
            maxWidth: '180px',
            zIndex: 10,
          }}
        >
          <span className="relative text-base md:text-lg font-helvetica font-medium tracking-wide text-white whitespace-nowrap flex items-center justify-center z-10"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
            {t('hero.aboutUs')}
          </span>
        </button>
      </div>
    </section>
  );
}
