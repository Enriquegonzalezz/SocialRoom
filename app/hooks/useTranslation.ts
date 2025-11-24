'use client';

import { usePathname } from 'next/navigation';
import { messages, Locale } from '@/i18n';
import { useMemo } from 'react';

export function useTranslation() {
  const pathname = usePathname();

  const locale = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];
    return (firstSegment === 'en' || firstSegment === 'es' ? firstSegment : 'en') as Locale;
  }, [pathname]);

  const t = (key: string, defaultValue?: string) => {
    try {
      const keys = key.split('.');
      let value: any = messages[locale];

      for (const k of keys) {
        value = value?.[k];
      }

      return value || defaultValue || key;
    } catch {
      return defaultValue || key;
    }
  };

  return { t, locale };
}
