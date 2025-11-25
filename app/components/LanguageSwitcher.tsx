'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useMemo, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Extract current locale from pathname
  const currentLocale = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    return segments[0] === 'en' || segments[0] === 'es' ? segments[0] : 'en';
  }, [pathname]);

  const handleLanguageChange = (newLocale: string) => {
    const segments = pathname.split('/').filter(Boolean);
    const isCurrentLocale = segments[0] === 'en' || segments[0] === 'es';
    
    let newPathname: string;
    if (isCurrentLocale) {
      newPathname = `/${newLocale}/${segments.slice(1).join('/')}`;
    } else {
      newPathname = `/${newLocale}${pathname}`;
    }
    
    router.push(newPathname);
    setIsOpen(false);
  };

  const languages = [
    { code: 'en', label: 'ENG' },
    { code: 'es', label: 'ESP' },
  ];

  // Animación GSAP para el dropdown
  useEffect(() => {
    if (!dropdownRef.current) return;

    if (isOpen) {
      // Animación de entrada
      gsap.fromTo(
        dropdownRef.current,
        {
          opacity: 0,
          y: -10,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        }
      );

      // Animar los items del dropdown con stagger
      const items = dropdownRef.current.querySelectorAll('button');
      gsap.fromTo(
        items,
        {
          opacity: 0,
          x: -10,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.25,
          stagger: 0.08,
          ease: 'power2.out',
          delay: 0.1,
        }
      );
    } else if (dropdownRef.current) {
      // Animación de salida
      gsap.to(dropdownRef.current, {
        opacity: 0,
        y: -10,
        scale: 0.95,
        duration: 0.2,
        ease: 'power2.in',
      });
    }
  }, [isOpen]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-full border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300 text-[10px] md:text-xs font-light tracking-[0.15em] md:tracking-[0.2em] cursor-pointer backdrop-blur-sm"
      >
        <span className={`transition-opacity duration-200 ${currentLocale === 'en' ? 'opacity-100' : 'opacity-50'}`}>
          {languages[0].label}
        </span>
        <span className="text-white/30">|</span>
        <span className={`transition-opacity duration-200 ${currentLocale === 'es' ? 'opacity-100' : 'opacity-50'}`}>
          {languages[1].label}
        </span>
        
        {/* Icono de flecha */}
        <svg 
          className={`w-2.5 md:w-3 h-2.5 md:h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 mt-3 w-36 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl z-50 overflow-hidden border border-black/5"
        >
          {languages.map((lang, index) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`
                w-full px-5 py-3 text-left text-xs font-light tracking-[0.15em] 
                transition-all duration-300 cursor-pointer
                ${currentLocale === lang.code
                  ? 'bg-black text-white font-medium'
                  : 'text-black/80 hover:bg-black/5 hover:text-black'
                }
                ${index === 0 ? 'rounded-t-2xl' : ''}
                ${index === languages.length - 1 ? 'rounded-b-2xl' : ''}
              `}
            >
              <span className="flex items-center justify-between">
                {lang.label}
                {currentLocale === lang.code && (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
