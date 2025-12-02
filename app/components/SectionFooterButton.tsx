"use client";

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { getImageUrl } from '@/lib/supabase-images';
import { useTranslation } from '@/app/hooks/useTranslation';

type SectionType = 'hero' | 'socialroom' | 'threeslider' | 'team' | 'servicescarousel' | 'contact';

interface SectionConfig {
  textKey: string;
  href: string; // base path sin locale, por ejemplo "/services"
  borderColor: string;
  hoverBg: string;
  hoverText: string;
}

const sectionConfigs: Record<SectionType, SectionConfig> = {
  hero: {
    textKey: 'floatingButton.aboutUs',
    href: '/about',
    borderColor: 'border-black',
    hoverBg: 'hover:bg-black',
    hoverText: 'hover:text-white',
  },
  socialroom: {
    textKey: 'floatingButton.services',
    href: '/services',
    borderColor: 'border-white',
    hoverBg: 'hover:bg-white',
    hoverText: 'hover:text-black',
  },
  threeslider: {
    textKey: 'floatingButton.clients',
    href: '/projects',
    borderColor: 'border-black',
    hoverBg: 'hover:bg-black',
    hoverText: 'hover:text-white',
  },
  team: {
    textKey: 'floatingButton.viewTeam',
    href: '/team',
    borderColor: 'border-black',
    hoverBg: 'hover:bg-black',
    hoverText: 'hover:text-white',
  },
  servicescarousel: {
    textKey: 'floatingButton.theRoom',
    href: '/theroom',
    borderColor: 'border-white',
    hoverBg: 'hover:bg-white',
    hoverText: 'hover:text-black',
  },
  contact: {
    textKey: 'floatingButton.contactUs',
    href: '#contact',
    borderColor: 'border-black',
    hoverBg: 'hover:bg-black',
    hoverText: 'hover:text-white',
  },
};

interface SectionFooterButtonProps {
  section: SectionType;
  className?: string;
}

export default function SectionFooterButton({ section, className = '' }: SectionFooterButtonProps) {
  const { t, locale } = useTranslation();
  const buttonRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const backgroundImage = getImageUrl('others', 'pieljirafa.jpeg');

  const config = sectionConfigs[section];
  const buttonText = t(config.textKey);

  // Construir href incluyendo el locale actual, excepto para anclas (#...)
  const hrefWithLocale = config.href.startsWith('#')
    ? config.href
    : `/${locale}${config.href}`;

  // Animación de entrada con IntersectionObserver
  useEffect(() => {
    if (!buttonRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              buttonRef.current,
              {
                opacity: 0,
                y: 30,
                scale: 0.9,
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: 'back.out(1.7)',
              }
            );

            // Animar texto con stagger
            if (textRef.current) {
              const spans = textRef.current.querySelectorAll('span');
              gsap.fromTo(
                spans,
                {
                  opacity: 0,
                  y: 15,
                },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  stagger: 0.03,
                  ease: 'power2.out',
                  delay: 0.2,
                }
              );
            }

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(buttonRef.current);

    return () => observer.disconnect();
  }, []);

  // Preparar texto con spans para animación
  useEffect(() => {
    if (textRef.current) {
      textRef.current.innerHTML = buttonText
        .split('')
        .map((char: string) => {
          const displayChar = char === ' ' ? '&nbsp;' : char;
          return `<span style="display:inline-block;opacity:0;">${displayChar}</span>`;
        })
        .join('');
    }
  }, [buttonText]);

  return (
    <div ref={buttonRef} className={`flex justify-center w-full pt-8 ${className}`} style={{ opacity: 0 }}>
      <Link href={hrefWithLocale}>
        <button
          className={`relative px-4 py-6 border transition-all duration-500 ease-in-out hover:scale-105 ${config.borderColor} ${config.hoverBg}`}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minWidth: '120px',
          }}
        >
          {/* Overlay para mejorar legibilidad del texto */}
          <div className="absolute inset-0 bg-black/30 rounded-sm" />
          <span
            ref={textRef}
            className="relative text-sm md:text-base font-helvetica font-bold tracking-wide text-white"
          >
            {buttonText}
          </span>
        </button>
      </Link>
    </div>
  );
}

// Exportar tipos y configuraciones para uso externo si es necesario
export { sectionConfigs };
export type { SectionType, SectionConfig };
