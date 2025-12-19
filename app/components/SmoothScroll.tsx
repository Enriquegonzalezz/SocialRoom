'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  
  // Debounce global para ScrollTrigger.refresh() - previene congelamiento
  let refreshTimeout: ReturnType<typeof setTimeout> | null = null;
  const originalRefresh = ScrollTrigger.refresh.bind(ScrollTrigger);
  
  (ScrollTrigger as any).refresh = function(safe?: boolean) {
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    refreshTimeout = setTimeout(() => {
      originalRefresh(safe);
      refreshTimeout = null;
    }, 150);
  };
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

// Detectar si es móvil (viewport < 768px)
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Solo inicializar en cliente
    if (typeof window === 'undefined') return;

    // ✅ NUEVO: En móviles/táctiles, usar scroll nativo
    if (isTouchDevice() && isMobile()) {
      // ✅ CRÍTICO: Asegurar propiedades correctas en móvil
      document.body.style.touchAction = 'pan-y pinch-zoom';
      document.documentElement.style.touchAction = 'pan-y pinch-zoom';
      
      // ✅ NUEVO: Remover cualquier overflow hidden que pueda interferir
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      
      // Solo registrar ScrollTrigger sin Lenis
      ScrollTrigger.defaults({
        scroller: window, // ✅ CAMBIADO: usar window en vez de documentElement
      });
      
      // Configurar ScrollTrigger para móvil: más tolerante
      ScrollTrigger.config({
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
        limitCallbacks: true,
        // ✅ NUEVO: Ignorar resize durante scroll para evitar lag
        ignoreMobileResize: true,
      });
      
      // ✅ NUEVO: Cleanup para móvil
      return () => {
        document.body.style.touchAction = '';
        document.documentElement.style.touchAction = '';
      };
    }

    // Solo en desktop: crear instancia de Lenis
    const lenis = new Lenis({
      duration: 1.2, // ✅ AJUSTADO: ligeramente más lento para mejor UX
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      infinite: false,
      autoResize: true,
      lerp: 0.1, // ✅ AJUSTADO: valor más suave
      // ✅ NUEVO: Prevenir interferencia con eventos táctiles
      touchMultiplier: 0, // Deshabilitar touch en desktop (solo wheel)
    });

    lenisRef.current = lenis;

    // CRÍTICO: Configurar scrollerProxy para sincronizar Lenis con ScrollTrigger
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value as number, { immediate: true });
          return lenis.animatedScroll;
        }
        return lenis.animatedScroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.body.style.transform ? 'transform' : 'fixed',
    });

    // Integrar Lenis con GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Sincronizar el ticker de GSAP con Lenis usando RAF
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);

    // Configurar lag smoothing para evitar congelamiento
    gsap.ticker.lagSmoothing(500, 33);

    // Actualizar ScrollTrigger cuando Lenis actualiza
    ScrollTrigger.defaults({
      scroller: document.body,
    });

    // Refresh después de configurar todo
    ScrollTrigger.addEventListener('refresh', () => lenis.resize());
    ScrollTrigger.refresh();

    // Cleanup
    return () => {
      ScrollTrigger.removeEventListener('refresh', () => lenis.resize());
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}