'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';

interface Brand {
  id: string;
  name: string;
  logo: string;
}

const brandsRow1: Brand[] = [
  { id: '1', name: 'ATYPICAL', logo: '/ATYPICAL.svg' },
  { id: '2', name: 'AUGE', logo: '/AUGE.svg' },
  { id: '3', name: 'FIAT', logo: '/FIAT.png' },
  { id: '4', name: 'EL MAIZAL', logo: '/EL MAIZAL.png' },
];

const brandsRow2: Brand[] = [
  { id: '5', name: 'LE BLE', logo: '/LE BLE.png' },
  { id: '6', name: 'PINNACA', logo: '/PINNACA.png' },
  { id: '7', name: 'L4H', logo: '/L4H.png' },
  { id: '8', name: 'FIAT', logo: '/FIAT.png' },
];

export default function InfiniteBrands() {
  const scrollDuration = '20s';

  return (
    <section
      className="relative bg-[#202020] h-[30vh] flex items-center overflow-hidden z-10"
      style={{ '--brands-scroll-duration': scrollDuration } as CSSProperties}
    >
      <div className="w-full">
        {/* Carrusel 1 - Movimiento hacia la derecha */}
        <div className="relative overflow-hidden">
          <div className="brands-marquee flex w-max">
            {[...brandsRow1, ...brandsRow1, ...brandsRow1, ...brandsRow1].map((brand, index) => (
              <div
                key={`${brand.id}-${index}`}
                className="shrink-0 w-40 h-24 mx-4 flex items-center justify-center bg-transparent rounded-lg "
              >
                <div className="relative w-40 h-24">
                 
                  
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain"
                    loading="lazy"
                  />
                  
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrusel 2 - Movimiento hacia la izquierda */}
        <div className="relative overflow-hidden">
          <div className="brands-marquee reverse flex w-max">
            {[...brandsRow2, ...brandsRow2, ...brandsRow2, ...brandsRow2].map((brand, index) => (
              <div
                key={`${brand.id}-${index}`}
                className="shrink-0 w-40 h-24 mx-4 flex items-center justify-center bg-transparent rounded-lg "
              >
                <div className="relative w-40 h-24">
                
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain"
                    loading="lazy"
                  />
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
