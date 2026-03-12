'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useMemo } from 'react';

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
    <div className="flex items-center gap-2">
      <svg className="hidden sm:block w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="1.5"/>
      </svg>
      
      <div className="relative">
        <select 
          value={currentLocale}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="text-sm font-light text-black bg-transparent border-none outline-none cursor-pointer uppercase pr-7 pl-1 appearance-none"
        >
          <option value="es" className="bg-black text-white">ES</option>
          <option value="en" className="bg-black text-white">EN</option>
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-1 flex items-center">
          <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>
    </div>
  );
}
