import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OrganizationJsonLd, WebsiteJsonLd, LocalBusinessJsonLd } from "./components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Viewport separado para Next.js 14+
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://socialroom.es';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Social Room - Agencia de Marketing Creativo',
    template: '%s | Social Room',
  },
  description: 'Agencia de marketing creativo especializada en branding, diseño web, producción audiovisual y experiencias digitales. Transformamos ideas en resultados.',
  keywords: [
    'agencia de marketing',
    'marketing digital',
    'branding',
    'diseño web',
    'producción audiovisual',
    'social media',
    'Barcelona',
    'España',
    'creative agency',
    'digital experiences',
  ],
  authors: [{ name: 'Social Room', url: baseUrl }],
  creator: 'Social Room',
  publisher: 'Social Room',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-dark.ico', sizes: '16x16 32x32 48x48' },
      { url: '/favicon-light.ico', sizes: '16x16 32x32 48x48', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-dark.ico', sizes: '16x16 32x32 48x48', media: '(prefers-color-scheme: dark)' }
    ],
    shortcut: '/favicon-dark.ico',
    apple: [
      { url: '/favicon-dark.ico', sizes: '180x180' }
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: 'en_US',
    url: baseUrl,
    siteName: 'Social Room',
    title: 'Social Room - Agencia de Marketing Creativo',
    description: 'Transformamos ideas en resultados. Branding, diseño web, producción audiovisual y experiencias digitales.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Social Room - Agencia de Marketing Creativo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Social Room - Agencia de Marketing Creativo',
    description: 'Transformamos ideas en resultados. Branding, diseño web, producción audiovisual y experiencias digitales.',
    images: ['/og-image.jpg'],
    creator: '@socialroom',
  },
  verification: {
    // Añadir cuando tengas los códigos de verificación
    // google: 'tu-codigo-de-google',
    // yandex: 'tu-codigo-de-yandex',
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'es-ES': `${baseUrl}/es`,
      'en-US': `${baseUrl}/en`,
    },
  },
  category: 'marketing',
  other: {
    'format-detection': 'telephone=no',
    'msapplication-TileColor': '#233a28',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <LocalBusinessJsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
