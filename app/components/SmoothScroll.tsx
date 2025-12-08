'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Solo inicializar en cliente
    if (typeof window === 'undefined') return;

    // Crear instancia de Lenis con configuración optimizada
    const lenis = new Lenis({
      duration: 1.1,           // Duración del smooth scroll
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing exponencial suave
      orientation: 'vertical', // Solo scroll vertical
      gestureOrientation: 'vertical',
      smoothWheel: true,       // Smooth en rueda del mouse
      touchMultiplier: 2,      // Multiplicador para touch (móviles)
      infinite: false,         // No scroll infinito
      autoResize: true,        // Auto resize en cambios de viewport
    });

    lenisRef.current = lenis;

    // Integrar Lenis con GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Sincronizar el ticker de GSAP con Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Desactivar el lag smoothing de GSAP para mejor sincronización
    gsap.ticker.lagSmoothing(0);

    // Actualizar ScrollTrigger cuando Lenis actualiza
    ScrollTrigger.defaults({
      scroller: document.documentElement,
    });

    // Refresh ScrollTrigger después de que Lenis esté listo
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    // Cleanup
    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
