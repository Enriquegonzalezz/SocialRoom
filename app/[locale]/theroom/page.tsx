'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/hooks/useTranslation';
import { getImageUrl } from '@/lib/supabase-images';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Categorías de equipos
const equipmentCategories = [
  { key: 'cameras', icon: 'camera' },
  { key: 'lighting', icon: 'light' },
  { key: 'audio', icon: 'audio' },
  { key: 'drones', icon: 'drone' },
  { key: 'studio', icon: 'studio' },
  { key: 'postproduction', icon: 'post' },
] as const;

export default function TheRoomPage() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  
  // Refs para animaciones
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // URLs de imágenes
  const pielDeJirafaUrl = getImageUrl('others', 'pieljirafa.jpeg');
  const studioImage = getImageUrl('others', 'pieljirafa.jpeg');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );
      }

      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-16 pt-20 sm:pt-0">
        {/* Logo */}
        <button 
          onClick={() => router.push(`/${locale}`)}
          className="absolute top-6 sm:top-8 left-4 sm:left-6 md:left-12 lg:left-16 cursor-pointer hover:opacity-70 transition-opacity z-10"
        >
          <Image
            src="/socialroomnegro.svg"
            alt="Social Room"
            width={120}
            height={40}
            className="w-20 sm:w-24 md:w-32"
          />
        </button>

        {/* Hero Content */}
        <div className="mt-8 sm:mt-20">
          <h1 
            ref={titleRef}
            className="font-bold leading-[0.9] tracking-tight text-black font-helvetica whitespace-nowrap"
            style={{ fontSize: 'clamp(2.5rem, 15vw, 12rem)' }}
          >
            {t('theRoom.title')}
          </h1>
          <p 
            ref={subtitleRef}
            className="mt-4 sm:mt-8 text-base sm:text-xl md:text-2xl lg:text-3xl text-black/70 max-w-3xl font-light font-helvetica"
          >
            {t('theRoom.subtitle')}
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6 sm:mb-8 md:mb-12 font-helvetica">
            {t('theRoom.introTitle')}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-black/70 font-light leading-relaxed font-helvetica mb-4 sm:mb-6 md:mb-8">
            {t('theRoom.introText1')}
          </p>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-black/70 font-light leading-relaxed font-helvetica">
            {t('theRoom.introText2')}
          </p>
        </div>
      </section>

      {/* Equipment Categories */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 font-helvetica">
            {t('theRoom.equipmentTitle')}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white/60 max-w-2xl mb-8 sm:mb-12 md:mb-16 font-light font-helvetica">
            {t('theRoom.equipmentSubtitle')}
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {equipmentCategories.map((category, idx) => (
              <div 
                key={category.key}
                className="group relative p-4 sm:p-6 md:p-8 bg-white/5 rounded-xl sm:rounded-2xl hover:bg-[#233a28] transition-all duration-500 border border-white/10"
              >
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white/10 group-hover:text-white/20 font-helvetica block mb-2 sm:mb-4 transition-colors duration-500">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3 font-helvetica">
                  {t(`theRoom.equipment.${category.key}.title`)}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-white/60 font-light font-helvetica leading-relaxed hidden sm:block">
                  {t(`theRoom.equipment.${category.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20 relative overflow-hidden"
        style={{
          backgroundImage: `url(${pielDeJirafaUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/5" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6 sm:mb-10 md:mb-16 font-helvetica">
            {t('theRoom.featuresTitle')}
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {['creative', 'professional', 'versatile', 'innovative'].map((key, idx) => (
              <div 
                key={key}
                className="group p-4 sm:p-6 md:p-8 bg-white rounded-xl sm:rounded-2xl hover:bg-[#233a28] transition-all duration-500"
              >
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-black/10 group-hover:text-white/20 font-helvetica block mb-2 sm:mb-3 md:mb-4 transition-colors duration-500">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-black group-hover:text-white mb-1 sm:mb-2 font-helvetica transition-colors duration-500">
                  {t(`theRoom.features.${key}.title`)}
                </h3>
                <p className="text-xs sm:text-sm text-black/60 group-hover:text-white/70 font-light font-helvetica transition-colors duration-500 hidden sm:block">
                  {t(`theRoom.features.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20 bg-[#f3f3f3]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6 sm:mb-10 md:mb-16 font-helvetica">
            {t('theRoom.galleryTitle')}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {/* Gallery images */}
            <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden group">
              <Image
                src="/muchachos/Victor.webp"
                alt="Studio Equipment"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden group md:col-span-2 md:row-span-2">
              <Image
                src="/muchachos/jorge.webp"
                alt="Creative Production"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden group">
              <Image
                src="/muchachos/fabian.webp"
                alt="Audio Setup"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden group col-span-2 md:col-span-1">
              <Image
                src="/muchachos/angela.webp"
                alt="Lighting Equipment"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden group">
              <Image
                src="/muchachos/dubraska.webp"
                alt="Post Production"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden group">
              <Image
                src="/muchachos/Erika.webp"
                alt="Studio Space"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-16 bg-[#233a28]">
        <div ref={ctaRef} className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 md:mb-8 font-helvetica">
            {t('theRoom.ctaTitle')}
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/70 mb-6 sm:mb-8 md:mb-12 font-light font-helvetica">
            {t('theRoom.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => router.push(`/${locale}`)}
              className="px-8 sm:px-12 py-3 sm:py-4 bg-white text-black text-base sm:text-lg font-medium rounded-full hover:bg-black hover:text-white transition-all duration-300 font-helvetica"
            >
              {t('theRoom.ctaButton')}
            </button>
            <button
              onClick={() => router.push(`/${locale}/services`)}
              className="px-8 sm:px-12 py-3 sm:py-4 bg-transparent border-2 border-white text-white text-base sm:text-lg font-medium rounded-full hover:bg-white hover:text-black transition-all duration-300 font-helvetica"
            >
              {t('theRoom.ctaButtonAlt')}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
