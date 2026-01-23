'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/hooks/useTranslation';
import { getImageUrl } from '@/lib/supabase-images';
import ContactFooterSection from '@/app/components/ContactFooterSection';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Keys de servicios para traducciones (Video & Photography combinados en visualProduction)
const serviceKeys = ['branding', 'visualProduction', 'socialMedia', 'design', 'development'] as const;
const serviceColors = ['#233a28', '#4a4a4a', '#8b4513', '#1a1a1a', '#2d4a87'];

interface ServiceCardProps {
  serviceKey: string;
  index: number;
  color: string;
  t: (key: string) => string;
}

const ServiceCard = ({ serviceKey, index, color, t }: ServiceCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Animación simple sin ScrollTrigger para evitar problemas
    const timer = setTimeout(() => {
      gsap.fromTo(card, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          delay: index * 0.1,
          ease: 'power2.out'
        }
      );
    }, 100);

    return () => clearTimeout(timer);
  }, [index]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Obtener features como array
  const features: string[] = [];
  for (let i = 0; i < 5; i++) {
    const feature = t(`servicesPage.services.${serviceKey}.features.${i}`);
    if (feature && !feature.includes('servicesPage.services')) {
      features.push(feature);
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer transition-all duration-500"
      style={{ backgroundColor: isHovered ? color : '#ffffff' }}
    >
      <div className="p-5 sm:p-6 md:p-10 lg:p-14">
        {/* Number */}
        <span 
          className={`text-xs sm:text-sm font-mono mb-3 sm:mb-4 md:mb-6 block transition-colors duration-500 ${
            isHovered ? 'text-white/50' : 'text-black/40'
          }`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Title */}
        <h3 
          className={`text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 font-helvetica transition-colors duration-500 ${
            isHovered ? 'text-white' : 'text-black'
          }`}
        >
          {t(`servicesPage.services.${serviceKey}.title`)}
        </h3>

        {/* Description */}
        <p 
          className={`text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 md:mb-8 font-light font-helvetica leading-relaxed transition-colors duration-500 ${
            isHovered ? 'text-white/80' : 'text-black/60'
          }`}
        >
          {t(`servicesPage.services.${serviceKey}.description`)}
        </p>

        {/* Features - Ocultos en móvil muy pequeño */}
        <div className="hidden sm:flex flex-wrap gap-2">
          {features.slice(0, 4).map((feature, idx) => (
            <span
              key={idx}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-500 ${
                isHovered 
                  ? 'bg-white/20 text-white' 
                  : 'bg-black/5 text-black/70'
              }`}
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Arrow - Solo en desktop */}
        <div 
          className={`hidden md:block absolute bottom-8 right-8 lg:bottom-12 lg:right-12 transition-all duration-500 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
          }`}
        >
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 40 40" 
            fill="none"
            className={isHovered ? 'text-white' : 'text-black'}
          >
            <path 
              d="M8 20H32M32 20L22 10M32 20L22 30" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default function ServicesPage() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const pielDeJirafaUrl = getImageUrl('others', 'pieljirafa.jpeg');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        const letters = titleRef.current.textContent?.split('') || [];
        titleRef.current.innerHTML = letters
          .map((letter) => `<span class="inline-block">${letter === ' ' ? '&nbsp;' : letter}</span>`)
          .join('');

        gsap.from(titleRef.current.children, {
          y: 120,
          opacity: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: 'power3.out',
        });
      }

      // Subtitle animation
      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: 0.4,
          ease: 'power3.out',
        });
      }

      // Process section animation
      if (processRef.current) {
        const steps = processRef.current.querySelectorAll('[data-step]');
        gsap.from(steps, {
          scrollTrigger: {
            trigger: processRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          y: 60,
          opacity: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
        });
      }

      // CTA animation
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        });
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
            style={{ fontSize: 'clamp(3rem, 18vw, 14rem)' }}
          >
            {t('servicesPage.title')}
          </h1>
          <p 
            ref={subtitleRef}
            className="mt-4 sm:mt-8 text-base sm:text-xl md:text-2xl lg:text-3xl text-black/70 max-w-3xl font-light font-helvetica"
          >
            {t('servicesPage.subtitle')}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-8 sm:py-12 md:py-20 px-3 sm:px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {serviceKeys.map((key, index) => (
              <ServiceCard 
                key={key} 
                serviceKey={key} 
                index={index} 
                color={serviceColors[index]}
                t={t}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section 
        ref={processRef}
        className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-16 bg-black text-white"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10 md:mb-16 font-helvetica">
            {t('servicesPage.processTitle')}
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {['discovery', 'strategy', 'creation', 'delivery'].map((key, idx) => (
              <div key={key} data-step className="relative">
                <span className="text-4xl sm:text-5xl md:text-7xl font-bold text-white/10 font-helvetica">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-3 sm:mt-4 mb-2 sm:mb-3 font-helvetica">
                  {t(`servicesPage.process.${key}.title`)}
                </h3>
                <p className="text-sm sm:text-base text-white/60 font-light font-helvetica">
                  {t(`servicesPage.process.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section 
        className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-16 relative overflow-hidden"
        style={{
          backgroundImage: `url(${pielDeJirafaUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/5" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#dcdcdc] font-helvetica">
              {t('servicesPage.whyTitle')}
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-[#233a28] mt-4 md:mt-0" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {['fast', 'results', 'creative'].map((key, idx) => (
              <div 
                key={key} 
                className="group relative bg-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl hover:bg-[#233a28] transition-all duration-500 border border-black/5"
              >
                <div className="flex items-start justify-between mb-4 sm:mb-6 md:mb-8">
                  <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-black/10 group-hover:text-white/20 font-helvetica transition-colors duration-500">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <svg 
                    className="w-5 h-5 sm:w-6 sm:h-6 text-black/20 group-hover:text-white/40 transition-colors duration-500 transform group-hover:translate-x-1 group-hover:-translate-y-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-black group-hover:text-white mb-3 sm:mb-4 font-helvetica transition-colors duration-500">
                  {t(`servicesPage.why.${key}.title`)}
                </h3>
                <p className="text-sm sm:text-base text-black/60 group-hover:text-white/70 font-light leading-relaxed font-helvetica transition-colors duration-500">
                  {t(`servicesPage.why.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-16 bg-[#233a28]">
        <div ref={ctaRef} className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 font-helvetica">
            {t('servicesPage.ctaTitle')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/70 mb-8 sm:mb-12 font-light font-helvetica">
            {t('servicesPage.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={() => router.push(`/${locale}`)}
              className="px-8 sm:px-12 py-3 sm:py-4 bg-white text-black text-base sm:text-lg font-medium rounded-full hover:bg-black hover:text-white transition-all duration-300 font-helvetica"
            >
              {t('servicesPage.ctaButton')}
            </button>
            <button
              onClick={() => router.push(`/${locale}/projects`)}
              className="px-8 sm:px-12 py-3 sm:py-4 bg-transparent border-2 border-white text-white text-base sm:text-lg font-medium rounded-full hover:bg-white hover:text-black transition-all duration-300 font-helvetica"
            >
              {t('servicesPage.ctaButtonAlt')}
            </button>
          </div>
        </div>
      </section> */}
      <ContactFooterSection />
    </main>
  );
}
