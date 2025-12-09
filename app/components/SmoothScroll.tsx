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

// Detectar si es dispositivo táctil/móvil
const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches
  );
};

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Solo inicializar en cliente
    if (typeof window === 'undefined') return;

    // En móviles/táctiles, no usar Lenis - el scroll nativo es mejor
    if (isTouchDevice()) {
      // Solo registrar ScrollTrigger sin Lenis
      ScrollTrigger.defaults({
        scroller: document.documentElement,
      });
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
      return;
    }

    // Solo en desktop: crear instancia de Lenis
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      infinite: false,
      autoResize: true,
    });

    lenisRef.current = lenis;

    // Integrar Lenis con GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Sincronizar el ticker de GSAP con Lenis
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);

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
      gsap.ticker.remove(rafCallback);
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
