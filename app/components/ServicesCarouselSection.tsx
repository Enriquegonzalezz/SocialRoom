"use client";

import { useTranslation } from '@/app/hooks/useTranslation';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/supabase-images';
import SectionFooterButton from './SectionFooterButton';

// Keys y filenames para los servicios
const serviceKeys = ['studio', 'podcast'] as const;
const serviceFilenames = ['STUDIO.jpg', 'PODCAST2.jpg'];

export default function ServicesCarouselSection() {
  const { t, locale } = useTranslation();
  const router = useRouter();

  // Generar servicios desde las traducciones
  const services = serviceKeys.map((key, index) => ({
    title: t(`servicesCarousel.${key}.title`),
    description: t(`servicesCarousel.${key}.description`),
    filename: serviceFilenames[index],
  }));

  const handleServiceClick = () => {
    router.push(`/${locale}/theroom`);
  };

  return (
    <section data-section="services-carousel" className="w-full bg-black py-20 relative">
      {/* Contenedor del grid */}
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Grid de 2 columnas - 50% cada una */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group cursor-pointer"
              onClick={handleServiceClick}
            >
              {/* Card */}
              <div className="relative h-[500px] overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
                {/* Background con imagen */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${getImageUrl('others', service.filename)})` }}
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
                  <p className="text-white/90 text-sm md:text-base font-light font-helvetica leading-relaxed max-w-sm font-size-[16px]">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón de footer de sección */}
        <SectionFooterButton section="servicescarousel" />
      </div>
    </section>
  );
}
