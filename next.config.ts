import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimizaciones de producción
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimización de imágenes
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.mixkit.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    qualities: [50, 75, 85, 90],
  },
  
  // Compresión
  compress: true,
  
  // Experimental: optimizaciones adicionales
  experimental: {
    optimizePackageImports: ['gsap', 'three'],
  },
};

export default nextConfig;
