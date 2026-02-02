'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter, useParams } from 'next/navigation';
import { useTranslation } from '@/app/hooks/useTranslation';
import { getImageUrl } from '@/lib/supabase-images';
import ContactFooterSection from '@/app/components/ContactFooterSection';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Definición de servicios por categoría
const servicesData = {
  offline: ['branding', 'printDesign', 'packaging', 'signage'],
  online: ['socialMedia', 'communityManagement', 'graphicDesign', 'contentCreation'],
  eventos: ['weddings', 'festivals', 'sports', 'corporate'],
  estrategia: ['marketingStrategy', 'brandStrategy', 'digitalStrategy', 'contentStrategy']
};

const serviceColors = ['#233a28', '#4a4a4a', '#8b4513', '#1a1a1a'];

interface ServiceCardProps {
  serviceKey: string;
  category: string;
  index: number;
  color: string;
  t: (key: string) => string;
}

const ServiceCard = ({ serviceKey, category, index, color, t }: ServiceCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

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

  const features: string[] = [];
  for (let i = 0; i < 5; i++) {
    const feature = t(`servicesPage.categories.${category}.services.${serviceKey}.features.${i}`);
    if (feature && !feature.includes('servicesPage.categories')) {
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
        <span 
          className={`text-xs sm:text-sm font-mono mb-3 sm:mb-4 md:mb-6 block transition-colors duration-500 ${
            isHovered ? 'text-white/50' : 'text-black/40'
          }`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <h3 
          className={`text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 font-helvetica transition-colors duration-500 ${
            isHovered ? 'text-white' : 'text-black'
          }`}
        >
          {t(`servicesPage.categories.${category}.services.${serviceKey}.title`)}
        </h3>

        <p 
          className={`text-sm sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 md:mb-8 font-light font-helvetica leading-relaxed transition-colors duration-500 ${
            isHovered ? 'text-white/80' : 'text-black/60'
          }`}
        >
          {t(`servicesPage.categories.${category}.services.${serviceKey}.description`)}
        </p>

        <div className="hidden sm:flex flex-wrap gap-2">
          {features.slice(0, 4).map((feature, idx) => (
            <span
              key={idx}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-500 ${
                isHovered 
                  ? 'bg-white/20 text-white' 
                  : 'bg-black/5 text-black/70'
              }`}
            >
              {feature}
            </span>
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default function ServiceCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { t, locale } = useTranslation();
  const category = params.category as string;
  
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const processRef = useRef<HTMLDivElement>(null);

  const pielDeJirafaUrl = getImageUrl('others', 'pieljirafa.jpeg');

  const services = servicesData[category as keyof typeof servicesData] || servicesData.online;

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: 0.4,
          ease: 'power3.out',
        });
      }

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
    });

    return () => ctx.revert();
  }, [category]);

  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      <section className="relative max-h-[60vh] sm:min-h-[70vh] flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-16 pt-20 sm:pt-0">
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

        <div className="mt-8 sm:mt-20">
          <h1 
            ref={titleRef}
            className="font-bold leading-[0.9] tracking-tight text-black font-helvetica whitespace-nowrap py-2"
            style={{ fontSize: 'clamp(3rem, 18vw, 14rem)' }}
          >
            {t(`servicesPage.categories.${category}.title`)}
          </h1>
          <p 
            ref={subtitleRef}
            className="mt-4 sm:mt-8 text-base sm:text-xl md:text-2xl lg:text-3xl text-black/70 max-w-3xl font-light font-helvetica"
          >
            {t(`servicesPage.categories.${category}.subtitle`)}
          </p>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-20 px-3 sm:px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {services.map((key, index) => (
              <ServiceCard 
                key={key} 
                serviceKey={key}
                category={category}
                index={index} 
                color={serviceColors[index % serviceColors.length]}
                t={t}
              />
            ))}
          </div>
        </div>
      </section>

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
                <span className="text-4xl sm:text-5xl md:text-7xl font-bold text-white/30 font-helvetica">
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

      <section 
        className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-16 relative overflow-hidden"
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: 'white',
          }}
        />
        <div className="absolute inset-0 bg-black/5" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#233a28] font-helvetica">
              {t('servicesPage.whyTitle')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {['fast', 'results', 'creative'].map((key, idx) => (
              <div 
                key={key} 
                className="group relative bg-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl hover:bg-[#233a28] transition-all duration-500 border border-black/5"
              >
                <div className="flex items-start justify-between mb-4 sm:mb-6 md:mb-8">
                  <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-black/20 group-hover:text-white/20 font-helvetica transition-colors duration-500">
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

      <ContactFooterSection />
    </main>
  );
}
