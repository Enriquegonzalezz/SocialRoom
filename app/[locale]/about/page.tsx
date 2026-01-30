'use client';

import { useEffect, useRef } from 'react';
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

const valueKeys = ['creativity', 'innovation', 'excellence', 'collaboration'] as const;

export default function AboutPage() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  
  // Obtener traducciones
  const missionLines = [
    t('about.missionLines.0'),
    t('about.missionLines.1'),
    t('about.missionLines.2'),
    t('about.missionLines.3'),
  ];
  
  // Refs para animaciones
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const missionLinesRef = useRef<HTMLDivElement[]>([]);
  const valuesRef = useRef<HTMLDivElement>(null);
  const valueCardsRef = useRef<HTMLDivElement[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // URL de imagen de fondo
  const pielDeJirafaUrl = getImageUrl('others', 'pieljirafa.jpeg');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation - título letra por letra
      if (titleRef.current) {
        const text = titleRef.current.textContent || '';
        titleRef.current.innerHTML = text
          .split('')
          .map((letter) => `<span class="inline-block">${letter === ' ' ? '&nbsp;' : letter}</span>`)
          .join('');

        gsap.from(titleRef.current.children, {
          y: 120,
          opacity: 0,
          duration: 0.8,
          stagger: 0.04,
          ease: 'power3.out',
        });
      }

      // Subtitle animation
      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: 0.5,
          ease: 'power3.out',
        });
      }

      // Mission lines animation - cada línea por separado
      missionLinesRef.current.forEach((line, index) => {
        if (line) {
          gsap.from(line, {
            scrollTrigger: {
              trigger: missionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'power3.out',
          });
        }
      });

      // Values cards animation
      valueCardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            y: 80,
            opacity: 0,
            duration: 0.7,
            delay: index * 0.1,
            ease: 'power3.out',
          });
        }
      });

      // Stats animation
      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll('[data-stat]');
        gsap.from(statItems, {
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
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
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-[60vh] sm:min-h-[70vh] flex flex-col justify-end px-6 md:px-12 lg:px-20 pb-24"
      >
        {/* Logo */}
        <button 
          onClick={() => router.push(`/${locale}`)}
          className="absolute top-8 left-6 md:left-12 lg:left-20 cursor-pointer hover:opacity-70 transition-opacity z-10"
        >
          <Image
            src="/socialroomblanco.svg"
            alt="Social Room"
            width={120}
            height={40}
            className="w-24 md:w-32"
          />
        </button>

        {/* Hero Content */}
        <div>
          <h1 
            ref={titleRef}
            className="text-[60px] md:text-[120px] lg:text-[160px] xl:text-[200px] font-bold leading-[0.9] tracking-tighter text-white font-helvetica overflow-hidden py-2"
          >
            {t('about.title')}
          </h1>
          <div className="flex items-end justify-between mt-4">
            <p 
              ref={subtitleRef}
              className="text-lg md:text-xl lg:text-2xl text-white/60 max-w-md font-light font-helvetica"
            >
              {t('about.subtitle')}
            </p>
            {/* Scroll indicator */}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-white/40 font-helvetica uppercase tracking-widest">{t('about.scroll')}</span>
              <div className="w-16 h-px bg-white/30" />
            </div>
          </div>
        </div>
      </section>
      <section 
        ref={statsRef}
        className="py-8 md:py-48 px-6 md:px-12 lg:px-20 bg-[#f3f3f3] relative overflow-hidden"
      >
        {/* Background pattern sutil */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url(${pielDeJirafaUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-8">
            {[
              { value: '13+', labelKey: 'about.stats.years' },
              { value: '100+', labelKey: 'about.stats.projects' },
              { value: '50+', labelKey: 'about.stats.clients' },
              { value: '15+', labelKey: 'about.stats.team' },
            ].map((stat, idx) => (
              <div key={idx} data-stat className="text-center">
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-black font-helvetica block">
                  {stat.value}
                </span>
                <p className="mt-2 text-xs sm:text-sm md:text-base text-black/50 font-helvetica uppercase tracking-wider">
                  {t(stat.labelKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Mission Section - Diseño moderno con líneas separadas */}
      <section 
        ref={missionRef}
        className="py-8 md:py-48 px-6 md:px-12 lg:px-20 bg-[#f3f3f3]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start gap-12 md:gap-24">
            {/* Label */}
            <div className="md:w-1/4">
              <span className="text-xs uppercase tracking-[0.3em] text-black/40 font-helvetica">
                {t('about.missionLabel')}
              </span>
              <div className="w-12 h-px bg-black/20 mt-4" />
            </div>
            
            {/* Mission Text - Cada línea separada */}
            <div className="md:w-3/4 space-y-2">
              {missionLines.map((line, index) => (
                <div
                  key={index}
                  ref={(el) => { if (el) missionLinesRef.current[index] = el; }}
                  className="overflow-hidden"
                >
                  <p className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-[1.1] text-black font-helvetica">
                    {line}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About SOCIAL ROOM Section */}
      <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-8 md:mb-12 font-helvetica">
            {t('about.aboutSectionTitle')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            {[0, 1, 2, 3].map((idx) => (
              <p 
                key={idx}
                className="text-base sm:text-lg md:text-xl text-black/70 font-light leading-relaxed font-helvetica"
              >
                {t(`about.aboutSectionParagraphs.${idx}`)}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner With Us Section */}
      <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 md:px-12 lg:px-20 bg-[#f3f3f3]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-10 md:mb-16 font-helvetica">
            {t('about.whyPartnerTitle')}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {['innovation', 'expertise', 'results', 'partnership'].map((key, idx) => (
              <div 
                key={key}
                className="group p-6 sm:p-8 bg-white rounded-xl sm:rounded-2xl hover:bg-[#233a28] transition-all duration-500"
              >
                <span className="text-4xl sm:text-5xl font-bold text-black/10 group-hover:text-white/20 font-helvetica block mb-3 sm:mb-4 transition-colors duration-500">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-black group-hover:text-white mb-2 sm:mb-3 font-helvetica transition-colors duration-500">
                  {t(`about.whyPartner.${key}.title`)}
                </h3>
                <p className="text-sm sm:text-base text-black/60 group-hover:text-white/70 font-light font-helvetica transition-colors duration-500">
                  {t(`about.whyPartner.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section - Grid moderno */}
      <section ref={valuesRef} className="py-32 md:py-48 px-6 md:px-12 lg:px-20 bg-black">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white font-helvetica">
              {t('about.valuesTitle')}
            </h2>
            <p className="text-white/40 text-lg mt-4 md:mt-0 max-w-md font-light font-helvetica">
              {t('about.valuesSubtitle')}
            </p>
          </div>
          
          {/* Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10">
            {valueKeys.map((key, index) => (
              <div
                key={key}
                ref={(el) => { if (el) valueCardsRef.current[index] = el; }}
                className="group relative p-6 sm:p-10 md:p-16 bg-black hover:bg-[#1a1a1a] transition-all duration-500 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4 sm:mb-8">
                  <span className="text-5xl sm:text-7xl md:text-8xl font-bold text-white/5 font-helvetica">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4 font-helvetica group-hover:translate-x-2 transition-transform duration-300">
                  {t(`about.values.${key}.title`)}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-white/50 font-light font-helvetica leading-relaxed">
                  {t(`about.values.${key}.description`)}
                </p>
                {/* Hover line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#233a28] group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Diseño limpio */}
      

      {/* CTA Section */}
      {/* <section className="py-32 md:py-48 px-6 md:px-12 lg:px-20 bg-[#233a28]">
        <div ref={ctaRef} className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 font-helvetica leading-tight whitespace-pre-line">
            {t('about.ctaTitle')}
          </h2>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <p className="text-xl md:text-2xl text-white/60 max-w-lg font-light font-helvetica">
              {t('about.ctaSubtitle')}
            </p>
            <button
              onClick={() => router.push(`/${locale}`)}
              className="group flex items-center gap-4 px-8 py-4 bg-white text-black text-lg font-medium rounded-full hover:bg-black hover:text-white border-2 border-white transition-all duration-300 font-helvetica"
            >
              {t('about.ctaButton')}
              <svg 
                className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </section> */}
      <ContactFooterSection />
    </main>
  );
}
