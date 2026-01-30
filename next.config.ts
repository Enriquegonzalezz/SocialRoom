import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimizaciones de producción
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimización de imágenes
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.mixkit.co',
      },
      {
        protocol: 'https',
        hostname: 'dhynxqtviwosfvljzfmi.supabase.co',
      },
    ],
  },
  
  // Compresión
  compress: true,
  
  // Experimental: optimizaciones adicionales
  experimental: {
    optimizePackageImports: ['gsap', 'three'],
    optimizeCss: true,
  },

  // Headers para mejor caching
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
    ];
  },

  // Configuración de Turbopack (Next.js 16+)
  turbopack: {
    resolveAlias: {
      '@': './app',
    },
  },
};

export default nextConfig;
