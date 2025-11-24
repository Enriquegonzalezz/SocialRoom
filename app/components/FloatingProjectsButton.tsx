"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FloatingProjectsButton() {
  const [isDarkBackground, setIsDarkBackground] = useState<boolean>(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Detectar si estamos sobre la sección negra (ServicesCarouselSection)
          const servicesSection = document.querySelector('[data-section="services-carousel"]');
          
          if (servicesSection) {
            const rect = servicesSection.getBoundingClientRect();
            const buttonPosition = window.innerHeight - 100; // Posición del botón desde abajo
            
            // Si el botón está sobre la sección negra, cambiar a blanco
            if (rect.top <= buttonPosition && rect.bottom >= buttonPosition) {
              setIsDarkBackground(true);
            } else {
              setIsDarkBackground(false);
            }
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Link href="/projects">
      <button
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-40 px-8 py-3 border transition-all duration-700 ease-in-out hover:scale-105 ${
          isDarkBackground 
            ? 'border-white text-white hover:bg-white hover:text-black' 
            : 'border-black text-black hover:bg-black hover:text-white'
        }`}
      >
        <span className="text-sm md:text-base font-helvetica tracking-wide">
          VER PROYECTOS
        </span>
      </button>
    </Link>
  );
}
