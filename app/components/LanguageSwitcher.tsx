'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useMemo } from 'react';

// Bandera de Reino Unido (circular)
const UKFlag = () => (
  <svg viewBox="0 0 60 60" className="w-6 h-6 md:w-7 md:h-7 rounded-full">
    <clipPath id="ukCircle">
      <circle cx="30" cy="30" r="30" />
    </clipPath>
    <g clipPath="url(#ukCircle)">
      {/* Fondo azul */}
      <rect width="60" height="60" fill="#012169" />
      {/* Cruz diagonal blanca */}
      <path d="M0,0 L60,60 M60,0 L0,60" stroke="#fff" strokeWidth="12" />
      {/* Cruz diagonal roja */}
      <path d="M0,0 L60,60 M60,0 L0,60" stroke="#C8102E" strokeWidth="4" />
      {/* Cruz blanca horizontal/vertical */}
      <path d="M30,0 V60 M0,30 H60" stroke="#fff" strokeWidth="20" />
      {/* Cruz roja horizontal/vertical */}
      <path d="M30,0 V60 M0,30 H60" stroke="#C8102E" strokeWidth="12" />
    </g>
    <circle cx="30" cy="30" r="29" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
  </svg>
);

// Bandera de España (circular)
const SpainFlag = () => (
  <svg viewBox="0 0 60 60" className="w-6 h-6 md:w-7 md:h-7 rounded-full">
    <clipPath id="spainCircle">
      <circle cx="30" cy="30" r="30" />
    </clipPath>
    <g clipPath="url(#spainCircle)">
      {/* Franja roja superior */}
      <rect width="60" height="15" fill="#AA151B" />
      {/* Franja amarilla central */}
      <rect y="15" width="60" height="30" fill="#F1BF00" />
      {/* Franja roja inferior */}
      <rect y="45" width="60" height="15" fill="#AA151B" />
    </g>
    <circle cx="30" cy="30" r="29" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
  </svg>
);

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

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
  };

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {/* Bandera UK */}
      <button
        onClick={() => handleLanguageChange('en')}
        className={`transition-all duration-300 hover:scale-110 ${
          currentLocale === 'en' ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-80'
        }`}
        aria-label="English"
      >
        <UKFlag />
      </button>

      {/* Separador */}
      <span className="text-white/40 text-lg font-light">|</span>

      {/* Bandera España */}
      <button
        onClick={() => handleLanguageChange('es')}
        className={`transition-all duration-300 hover:scale-110 ${
          currentLocale === 'es' ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-80'
        }`}
        aria-label="Español"
      >
        <SpainFlag />
      </button>
    </div>
  );
}
