'use client';

import { useEffect, useRef } from 'react';
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

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { t, locale } = useTranslation();
  const service = params.service as string;
  
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const pielDeJirafaUrl = getImageUrl('others', 'pieljirafa.jpeg');

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

      if (descriptionRef.current) {
        gsap.from(descriptionRef.current, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: 0.4,
          ease: 'power3.out',
        });
      }

      if (contentRef.current) {
        gsap.from(contentRef.current.children, {
          scrollTrigger: {
            trigger: contentRef.current,
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
  }, [service]);

  const features: string[] = [];
  for (let i = 0; i < 10; i++) {
    const feature = t(`servicesPage.categories.offline.services.${service}.features.${i}`);
    if (feature && !feature.includes('servicesPage.categories')) {
      features.push(feature);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-16 pt-20 sm:pt-0">
        <div className="absolute top-6 sm:top-8 left-4 sm:left-6 md:left-12 lg:left-16 z-10 flex items-center gap-4">
          <button 
            onClick={() => router.push(`/${locale}/services/offline`)}
            className="cursor-pointer hover:opacity-70 transition-opacity"
          >
            <Image
              src="/socialroomnegro.svg"
              alt="Social Room"
              width={120}
              height={40}
              className="w-24 sm:w-28 md:w-32 h-auto"
            />
          </button>
          <button
            onClick={() => router.push(`/${locale}/services/offline`)}
            className="text-sm sm:text-base text-black/70 hover:text-black transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver</span>
          </button>
        </div>

        <div className="max-w-7xl mx-auto w-full">
          <h1 
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 md:mb-12 overflow-hidden"
          >
            {t(`servicesPage.categories.offline.services.${service}.title`)}
          </h1>
          
          <p 
            ref={descriptionRef}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-black/70 max-w-3xl font-light leading-relaxed"
          >
            {t(`servicesPage.categories.offline.services.${service}.description`)}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4 sm:px-6 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div ref={contentRef} className="bg-white rounded-2xl p-8 sm:p-10 md:p-12 lg:p-16 flex items-center justify-center min-h-[500px]">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-black/5 flex items-center justify-center">
                <svg className="w-16 h-16 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xl text-black/60">
                {t('servicesPage.multimediaContent')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Texture Background Section */}
   
      <ContactFooterSection />
    </main>
  );
}
