"use client";

import { memo } from 'react';
import Image from 'next/image';

interface Card {
  id: number;
  image: string;
  title: string;
  description: string;
}

const cards: Card[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    title: 'OFFLINE',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    title: 'ONLINE',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    title: 'ESTRATEGIA',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
    title: 'EVENTOS',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh',
  },
];

// Componente de tarjeta memorizado para evitar re-renders
const CardItem = memo(({ card }: { card: Card }) => (
  <div className="group relative h-[500px] md:h-[600px] overflow-hidden cursor-pointer">
    {/* Imagen de fondo */}
    <div className="absolute inset-0">
      <Image
        src={card.image}
        alt={card.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover will-change-transform transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
        quality={85}
      />
    </div>

    {/* Overlay oscuro para legibilidad */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

    {/* Contenido */}
    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
      <h3 className="text-3xl md:text-4xl lg:text-5xl font-thermal font-bold mb-3 uppercase tracking-tight">
        {card.title}
      </h3>
      <p className="text-sm md:text-base leading-relaxed opacity-90">
        {card.description}
      </p>
    </div>

    {/* Border hover effect */}
    <div className="absolute inset-0 border-4 border-transparent group-hover:border-white/20 transition-all duration-300" />
  </div>
));

CardItem.displayName = 'CardItem';

export default function CarouselSection() {
  return (
    <section className="relative min-h-screen bg-[#f3f3f3] flex items-center justify-center py-20 px-6 overflow-hidden">
      <div className="max-w-7xl w-full">
        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {cards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
