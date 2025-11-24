"use client";

import { useRef, useState } from 'react';
import { useTranslation } from '@/app/hooks/useTranslation';

const services = [
  {
    title: 'STUDIO',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh',
    image: '/studio-image.jpg',
    bgColor: '#2a2a2a',
  },
  {
    title: 'PODCAST',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh',
    image: '/podcast-image.jpg',
    bgColor: '#3a3a3a',
  },
  {
    title: 'TOOLS',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh',
    image: '/tools-image.jpg',
    bgColor: '#4a4a4a',
  },
  {
    title: 'CREATIVE',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh',
    image: '/creative-image.jpg',
    bgColor: '#2a2a2a',
  },
  {
    title: 'DESIGN',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh',
    image: '/design-image.jpg',
    bgColor: '#3a3a3a',
  },
];

export default function ServicesCarouselSection() {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    <section data-section="services-carousel" className="w-full bg-black py-20 relative">
      {/* Contenedor del carrusel */}
      <div className="relative max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Botón izquierdo */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
            aria-label="Scroll left"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}

        {/* Botón derecho */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300"
            aria-label="Scroll right"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        )}

        {/* Scroll container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {services.map((service, index) => (
            <div
              key={index}
              className="shrink-0 w-[85vw] md:w-[45vw] lg:w-[30vw] snap-start group"
            >
              {/* Card */}
              <div className="relative h-[500px] overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
                {/* Background con placeholder de color */}
                <div 
                  className="absolute inset-0"
                  style={{ backgroundColor: service.bgColor }}
                >
                  {/* Aquí irá la imagen cuando la agregues */}
                  {/* <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  /> */}
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

                {/* Contenido */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <h3 className="text-4xl md:text-5xl font-bold text-white mb-3 font-helvetica tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-white/90 text-sm md:text-base font-light font-helvetica leading-relaxed max-w-sm">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS para ocultar scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
