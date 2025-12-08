import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://socialroom.es';
  const lastModified = new Date();
  
  // Páginas principales
  const pages = [
    '',           // Home
    '/about',     // Nosotros
    '/services',  // Servicios
    '/projects',  // Proyectos
    '/team',      // Equipo
    '/theroom',   // The Room
  ];
  
  // Locales soportados
  const locales = ['es', 'en'];
  
  // Generar URLs para cada página en cada idioma
  const sitemapEntries: MetadataRoute.Sitemap = [];
  
  locales.forEach((locale) => {
    pages.forEach((page) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified,
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1 : page === '/services' ? 0.9 : 0.8,
        alternates: {
          languages: {
            es: `${baseUrl}/es${page}`,
            en: `${baseUrl}/en${page}`,
          },
        },
      });
    });
  });
  
  return sitemapEntries;
}
