'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useMemo } from 'react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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

  const currentLang = languages.find((lang) => lang.code === currentLocale);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-xs font-semibold tracking-wider"
      >
        <span>{languages[0].label}</span>
        <span className="text-white/50">|</span>
        <span>{languages[1].label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-2 text-left text-xs font-semibold transition-colors ${
                currentLocale === lang.code
                  ? 'bg-black text-white'
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
