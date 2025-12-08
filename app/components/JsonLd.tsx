'use client';

export function OrganizationJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://socialroom.es';
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Social Room',
    alternateName: 'Social Room Marketing Agency',
    url: baseUrl,
    logo: `${baseUrl}/favicon-dark.ico`,
    description: 'Agencia de marketing creativo especializada en branding, diseño web, producción audiovisual y experiencias digitales.',
    foundingDate: '2020',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Barcelona',
      addressCountry: 'ES',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Spanish', 'English'],
    },
    sameAs: [
      // Añadir redes sociales cuando las tengas
      // 'https://www.instagram.com/socialroom',
      // 'https://www.linkedin.com/company/socialroom',
      // 'https://twitter.com/socialroom',
    ],
    knowsAbout: [
      'Marketing Digital',
      'Branding',
      'Diseño Web',
      'Producción Audiovisual',
      'Social Media',
      'Experiencias Digitales',
    ],
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 41.3851,
        longitude: 2.1734,
      },
      geoRadius: '50000',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://socialroom.es';
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Social Room',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['es-ES', 'en-US'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://socialroom.es';
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Social Room',
    image: `${baseUrl}/og-image.jpg`,
    url: baseUrl,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Barcelona',
      addressRegion: 'Cataluña',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.3851,
      longitude: 2.1734,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    serviceType: [
      'Marketing Digital',
      'Branding',
      'Diseño Web',
      'Producción Audiovisual',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Componente para páginas de servicios
export function ServiceJsonLd({ 
  name, 
  description 
}: { 
  name: string; 
  description: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://socialroom.es';
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: 'Social Room',
      url: baseUrl,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Spain',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
