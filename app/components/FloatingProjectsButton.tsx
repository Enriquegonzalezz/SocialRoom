"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { getImageUrl } from '@/lib/supabase-images';
import { useTranslation } from '@/app/hooks/useTranslation';

type SectionType = 'hero' | 'socialroom' | 'threeslider' | 'team' | 'servicescarousel' | 'contact';

interface SectionConfig {
  textKey: string;
  href: string;
  borderColor: string;
  hoverBg: string;
  hoverText: string;
  showButton: boolean;
}

const sectionConfigs: Record<SectionType, SectionConfig> = {
  hero: {
    textKey: 'floatingButton.viewProjects',
    href: '/projects',
    borderColor: 'border-black',
    hoverBg: 'hover:bg-black',
    hoverText: 'hover:text-white',
    showButton: false,
  },
  socialroom: {
    textKey: 'floatingButton.viewOnlineServices',
    href: '/services',
    borderColor: 'border-white',
    hoverBg: 'hover:bg-white',
    hoverText: 'hover:text-black',
    showButton: true,
  },
  threeslider: {
    textKey: 'floatingButton.viewProjects',
    href: '/projects',
    borderColor: 'border-black',
    hoverBg: 'hover:bg-black',
    hoverText: 'hover:text-white',
    showButton: true,
  },
  team: {
    textKey: 'floatingButton.viewTeam',
    href: '/team',  // Redirige a la nueva página de equipo
    borderColor: 'border-black',
    hoverBg: 'hover:bg-black',
    hoverText: 'hover:text-white',
    showButton: true,
  },
  servicescarousel: {
    textKey: 'floatingButton.viewServices',
    href: '/services',
    borderColor: 'border-white',
    hoverBg: 'hover:bg-white',
    hoverText: 'hover:text-black',
    showButton: true,
  },
  contact: {
    textKey: 'floatingButton.contactUs',
    href: '#contact',
    borderColor: 'border-black',
    hoverBg: 'hover:bg-black',
    hoverText: 'hover:text-white',
    showButton: true,
  },
};

// Cachear los selectores para evitar búsquedas repetidas
const SECTION_SELECTORS = [
  { selector: '[data-section="hero"]', type: 'hero' as SectionType },
  { selector: '[data-section="socialroom"]', type: 'socialroom' as SectionType },
  { selector: '[data-section="threeslider"]', type: 'threeslider' as SectionType },
  { selector: '[data-section="team"]', type: 'team' as SectionType },
  { selector: '[data-section="servicescarousel"]', type: 'servicescarousel' as SectionType },
  { selector: '[data-section="contact"]', type: 'contact' as SectionType },
];

// Función para convertir texto a spans con manejo de espacios
const createSpannedText = (text: string): string => {
  return text
    .split("")
    .map((char) => {
      // Preservar espacios con &nbsp; para mantener el layout
      const displayChar = char === ' ' ? '&nbsp;' : char;
      return `<span style="display:inline-block;white-space:pre;">${displayChar}</span>`;
    })
    .join("");
};

export default function FloatingProjectsButton() {
  const { t } = useTranslation();
  const [currentSection, setCurrentSection] = useState<SectionType>('hero');
  const [hasAppeared, setHasAppeared] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const backgroundImage = getImageUrl('others', 'pieljirafa.jpeg');

  // Cachear elementos de secciones para evitar búsquedas repetidas
  const sectionElementsRef = useRef<Map<string, Element>>(new Map());

  useEffect(() => {
    // Pre-cachear los elementos de secciones
    SECTION_SELECTORS.forEach(({ selector }) => {
      const element = document.querySelector(selector);
      if (element) {
        sectionElementsRef.current.set(selector, element);
      }
    });
  }, []);

  useEffect(() => {
    // Detectar si es móvil
    const isMobile = window.innerWidth < 768;
    
    // En móvil, este botón está oculto (hidden lg:block), no necesitamos el listener
    if (isMobile) {
      return;
    }
    
    // Solo en DESKTOP: usar scroll listener
    let lastSection: SectionType = 'hero';
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastScrollTime = 0;
    const THROTTLE_MS = 150;

    const updateSection = () => {
      const centerY = window.innerHeight / 2;
      let activeSection: SectionType = lastSection;

      // Buscar la sección activa usando elementos cacheados
      for (const { selector, type } of SECTION_SELECTORS) {
        const element = sectionElementsRef.current.get(selector);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= centerY && rect.bottom >= centerY) {
            activeSection = type;
            break;
          }
        }
      }

      // Solo actualizar si cambió la sección
      if (activeSection !== lastSection) {
        lastSection = activeSection;
        setCurrentSection(activeSection);
      }
    };

    const handleScroll = () => {
      const now = Date.now();
      
      // Throttle: solo ejecutar cada THROTTLE_MS
      if (now - lastScrollTime < THROTTLE_MS) {
        // Cancelar timeout anterior y programar uno nuevo
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateSection, THROTTLE_MS);
        return;
      }
      
      lastScrollTime = now;
      updateSection();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Llamar al inicio con delay para no bloquear carga inicial
    setTimeout(updateSection, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  // Animación GSAP cuando el botón aparece por primera vez
  useEffect(() => {
    const config = currentSection ? sectionConfigs[currentSection] : sectionConfigs.hero;
    
    if (config.showButton && !hasAppeared && buttonRef.current) {
      setHasAppeared(true);
      gsap.fromTo(
        buttonRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'back.out',
        }
      );
    }
  }, [currentSection, hasAppeared]);

  // Animación de transición del texto cada vez que cambia (con efecto staggered)
  useEffect(() => {
    if (textRef.current) {
      const config = currentSection ? sectionConfigs[currentSection] : sectionConfigs.hero;
      const buttonText = t(config.textKey);
      
      // Split text into spans con manejo correcto de espacios
      textRef.current.innerHTML = buttonText
        .split("")
        .map((char: string) => {
          // Preservar espacios con &nbsp; para que no colapsen
          const displayChar = char === ' ' ? '&nbsp;' : char;
          return `<span style="display:inline-block;">${displayChar}</span>`;
        })
        .join("");

      const spans = textRef.current.querySelectorAll("span");
      
      // Cancelar animaciones previas
      gsap.killTweensOf(spans);
      
      if (hasAppeared) {
        // Animación normal cuando ya apareció (cambio de sección)
        gsap.from(spans, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.04,
          ease: 'power2.out',
        });
      } else {
        // Animación inicial más elaborada (primera aparición)
        gsap.from(spans, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          stagger: 0.06,
          ease: 'back.out',
        });
      }
    }
  }, [currentSection, hasAppeared, t]);

  const config = currentSection ? sectionConfigs[currentSection] : sectionConfigs.hero;
  const buttonText = t(config.textKey);

  if (!config.showButton) {
    return null;
  }

  return (
    <div ref={buttonRef}>
      <Link href={config.href}>
        <button
          className={`hidden lg:block fixed bottom-8 left-1/2 -translate-x-1/2 z-40 px-8 py-3 border transition-all duration-700 ease-in-out hover:scale-105 ${config.borderColor} ${config.hoverBg}`}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay para mejorar legibilidad del texto */}
          <div className="absolute inset-0 bg-black/30 rounded-sm" />
          <span ref={textRef} className="relative text-sm md:text-base font-helvetica font-bold tracking-wide text-white">
            {buttonText}
          </span>
        </button>
      </Link>
    </div>
  );
}
