import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Social Room - Agencia de Marketing Creativo',
    short_name: 'Social Room',
    description: 'Agencia de marketing creativo especializada en branding, diseño web y experiencias digitales',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#233a28',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/favicon-dark.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
      {
        src: '/favicon-dark.ico',
        sizes: '72x72 96x96 128x128 256x256',
        type: 'image/x-icon',
        purpose: 'any',
      },
    ],
    categories: ['business', 'marketing', 'design'],
    lang: 'es',
    dir: 'ltr',
  };
}
