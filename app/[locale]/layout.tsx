import { ReactNode } from 'react';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://socialroom.es';
  
  const metadata: Record<string, { title: string; description: string }> = {
    es: {
      title: 'Social Room - Agencia de Marketing Creativo',
      description: 'Agencia de marketing creativo especializada en branding, diseño web, producción audiovisual y experiencias digitales. Transformamos ideas en resultados.',
    },
    en: {
      title: 'Social Room - Creative Marketing Agency',
      description: 'Creative marketing agency specializing in branding, web design, audiovisual production and digital experiences. We transform ideas into results.',
    },
  };

  const localeData = metadata[locale] || metadata.es;

  return {
    title: localeData.title,
    description: localeData.description,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'es-ES': `${baseUrl}/es`,
        'en-US': `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: localeData.title,
      description: localeData.description,
      locale: locale === 'es' ? 'es_ES' : 'en_US',
    },
  };
}

export default function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
