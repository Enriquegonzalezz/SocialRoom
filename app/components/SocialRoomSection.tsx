"use client";

import Image from 'next/image';
import { useTranslation } from '@/app/hooks/useTranslation';

const services = [
  {
    title: 'OFFLINE',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh',
    image: '/offline-image.jpg',
    bgColor: '#3d2832', // Color placeholder morado oscuro
  },
  {
    title: 'ONLINE',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh',
    image: '/online-image.jpg',
    bgColor: '#4a4a2a', // Color placeholder verde oliva
  },
  {
    title: 'ESTRATEGIA',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh',
    image: '/estrategia-image.jpg',
    bgColor: '#7a8a7a', // Color placeholder verde grisáceo
  },
];

export default function SocialRoomSection() {
  const { t } = useTranslation();
  return (
    <section className="w-full bg-[#f3f3f3] py-20 px-6 md:px-12 lg:px-20">
      {/* Grid de servicios */}
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="group relative overflow-hidden transition-transform duration-500 hover:scale-[1.02]"
          >
            {/* Contenedor de imagen con placeholder de color */}
            <div 
              className="relative w-full aspect-3/4 overflow-hidden"
              style={{ backgroundColor: service.bgColor }}
            >
              {/* Aquí irá la imagen cuando la agregues */}
              {/* <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              /> */}
              
              {/* Overlay oscuro sutil */}
              <div className="absolute inset-0 bg-black/20" />

              {/* Contenido de texto */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-helvetica tracking-tight">
                  {service.title}
                </h3>
                <p className="text-white/90 text-base md:text-lg font-light font-helvetica max-w-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
