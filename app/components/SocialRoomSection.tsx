"use client";

import { useRef, useState, useEffect } from 'react';
import { getImageUrl } from '@/lib/supabase-images';
import { useTranslation } from '@/app/hooks/useTranslation';
import SectionFooterButton from './SectionFooterButton';

// Keys para las traducciones y filenames
const serviceKeys = ['offline', 'online', 'estrategia', 'eventos'] as const;
const serviceFilenames = ['OFFLINE.jpg', 'ONLINE.jpg', 'ESTRATEGIA.jpg', 'EVENTOS.jpg'];

interface ServiceData {
  title: string;
  description: string;
  filename: string;
}

// Componente de tarjeta reutilizable
const ServiceCard = ({ service, longestTitle }: { service: ServiceData; longestTitle: string }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleFontSize, setTitleFontSize] = useState('clamp(1.5rem, 8vw, 3.5rem)');

  useEffect(() => {
    const adjustTitleSize = () => {
      if (titleRef.current) {
        const container = titleRef.current.parentElement;
        if (!container) return;

        // Obtener el ancho disponible (restando padding)
        const padding = parseFloat(
          getComputedStyle(container).padding || 
          getComputedStyle(container).paddingLeft || 
          '1rem'
        );
        const availableWidth = container.clientWidth - (padding * 2);

        // Crear un elemento temporal para medir la palabra más larga
        const tempSpan = document.createElement('span');
        tempSpan.textContent = longestTitle;
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.font = getComputedStyle(titleRef.current).font;
        tempSpan.style.whiteSpace = 'nowrap';
        document.body.appendChild(tempSpan);
        
        const longestTextWidth = tempSpan.offsetWidth;
        document.body.removeChild(tempSpan);

        // Si el texto más largo se desborda, reducir font-size
        if (longestTextWidth > availableWidth) {
          const ratio = availableWidth / longestTextWidth;
          const currentSize = parseFloat(getComputedStyle(titleRef.current).fontSize);
          const newSize = currentSize * ratio * 0.95; // 0.95 para margen de seguridad
          setTitleFontSize(`${newSize}px`);
        }
      }
    };

    // Ajustar al montar y en resize
    adjustTitleSize();
    window.addEventListener('resize', adjustTitleSize);
    return () => window.removeEventListener('resize', adjustTitleSize);
  }, []);

  return (
    <div className="group relative overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
      <div 
        className="relative w-full aspect-3/4 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${getImageUrl('others', service.filename)})` }}
      >
        {/* Overlay oscuro sutil */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Contenido de texto */}
        <div className="absolute inset-0 flex flex-col justify-end p-[clamp(1rem,5vw,2.5rem)]">
          <h3 
            ref={titleRef}
            className="font-bold text-white mb-[clamp(0.5rem,2vh,1rem)] font-helvetica tracking-tight whitespace-nowrap"
            style={{
              fontSize: titleFontSize,
              lineHeight: 'clamp(1.8rem, 9vw, 4rem)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {service.title}
          </h3>
          <p 
            className="text-white/90 font-light font-helvetica leading-relaxed"
            style={{
              fontSize: 'clamp(0.75rem, 2.5vw, 1.125rem)',
              lineHeight: 'clamp(1rem, 3.5vw, 1.75rem)',
              maxWidth: 'clamp(200px, 90%, 500px)',
            }}
          >
            {service.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function SocialRoomSection() {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [useCarouselForLast, setUseCarouselForLast] = useState(false);

  // Generar servicios desde las traducciones
  const services: ServiceData[] = serviceKeys.map((key, index) => ({
    title: t(`socialRoom.${key}.title`),
    description: t(`socialRoom.${key}.description`),
    filename: serviceFilenames[index],
  }));

  // Encontrar la palabra más larga para calcular el font-size uniforme
  const longestTitle = services.reduce((longest, service) => 
    service.title.length > longest.length ? service.title : longest
  , '');

  // Detectar si necesitamos carrusel solo si el contenido se desborda
  useEffect(() => {
    const checkLayout = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        // Si el contenido se desborda, usar carrusel
        setUseCarouselForLast(scrollWidth > clientWidth + 10);
      }
    };

    checkLayout();
    window.addEventListener('resize', checkLayout);
    return () => window.removeEventListener('resize', checkLayout);
  }, []);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <section className="w-full bg-[#f3f3f3] pt-20 pb-0 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20">
      {/* Contenedor principal */}
      <div className="max-w-[1600px] mx-auto">
        {/* Grid/Carrusel combinado */}
        <div className="relative">
          {/* Botones de carrusel - solo visible si se usa carrusel */}
          {useCarouselForLast && canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-black p-3 rounded-full transition-all duration-300"
              aria-label="Scroll left"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          )}

          {useCarouselForLast && canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-black p-3 rounded-full transition-all duration-300"
              aria-label="Scroll right"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          )}

          {/* Contenedor principal - Grid o Carrusel */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollButtons}
            className={useCarouselForLast 
              ? "flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory px-4 md:px-8 lg:px-12"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
            }
            style={useCarouselForLast ? {
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            } : undefined}
          >
            {/* Todos los servicios */}
            {useCarouselForLast ? (
              // Modo carrusel - mostrar todos
              services.map((service, index) => (
                <div key={index} className="shrink-0 w-[85vw] md:w-[45vw] snap-start">
                  <ServiceCard service={service} longestTitle={longestTitle} />
                </div>
              ))
            ) : (
              // Modo grid - mostrar todos
              services.map((service, index) => (
                <div key={index}>
                  <ServiceCard service={service} longestTitle={longestTitle} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Botón de footer de sección */}
      <SectionFooterButton section="socialroom" />

      {/* CSS para ocultar scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
