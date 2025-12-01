"use client";

import { useEffect, useRef } from 'react';
import { useTranslation } from '@/app/hooks/useTranslation';
import { gsap } from 'gsap';
import SectionFooterButton from './SectionFooterButton';

// Variables configurables para información de contacto
const contactInfo = {
  companyName: 'Social Room',
  companySubtitle: 'Marketing Agency',
  location: 'Valencia, Miami and LA',
  year: '2025',
  
  // Sección About us
  aboutLinks: [
    { label: 'Services', url: '#' },
    { label: 'Contact', url: '#' },
  ],
  
  // Sección Team
  teamLinks: [
    
    { label: 'Careers', url: '#' },
  ],
  
  // Información de contacto
  email: 'socsocialroommarketingagency@gmail.com',
  phone: '+58 412 0639249',
  address: 'Valencia, Miami and LA',
  
  // Legal
  legalText: 'No borders. No limits. Whenever your brand wants to go, we will make it happen.',
};

// Configuración del Google Form (reemplaza con tu URL)
const GOOGLE_FORM_URL = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL || 'https://forms.gle/YOUR_FORM_ID';

export default function ContactFooterSection() {
  const { t } = useTranslation();
  const ctaRef = useRef<HTMLHeadingElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirigir a Google Forms
    window.open(GOOGLE_FORM_URL, '_blank');
  };

  // Animación del texto de llamada al formulario con GSAP (staggered por letras)
  useEffect(() => {
    if (ctaRef.current) {
      const text = ctaRef.current.textContent || '';
      ctaRef.current.innerHTML = text
        .split('')
        .map((char) => {
          const displayChar = char === ' ' ? '&nbsp;' : char;
          return `<span style="display:inline-block;">${displayChar}</span>`;
        })
        .join('');

      const spans = ctaRef.current.querySelectorAll('span');
      gsap.from(spans, {
        opacity: 0,
        y: 50,
        rotateX: -90,
        duration: 0.8,
        stagger: 0.03,
        ease: 'back.out(1.7)',
      });
    }
  }, []);

  return (
    <>
      {/* Sección de contacto */}
      <section className="w-full bg-[#f3f3f3] py-12 md:py-20 px-6 md:px-12 lg:px-20 min-h-[70vh] ">
        <div className="max-w-[1600px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
            
            {/* Columna izquierda - Título y info */}
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light mb-8 md:mb-12 leading-tight text-black font-thermal">
                {t('contact.forgetToCall')}<br />{t('contact.forgetToCallDescription')}
              </h2>
              
              <div className="space-y-1 text-black">
                <p className="text-sm md:text-base font-medium">{contactInfo.companyName}</p>
                <p className="text-sm md:text-base">{contactInfo.companySubtitle}</p>
                <p className="text-sm md:text-base">{contactInfo.location}</p>
              </div>
            </div>

            {/* Columna derecha - Formulario */}
            <div className="relative">
              {/* Año en la esquina superior derecha */}
              <div className="absolute -top-8 right-0 text-sm text-gray-600">
                {contactInfo.year}
              </div>

              {/* Formulario con fondo verde claro */}
              <div className="bg-[#d4ddd4] p-8 md:p-12 lg:p-16">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <h3
                      ref={ctaRef}
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black font-helvetica tracking-tight leading-tight cursor-pointer transition-transform duration-500 hover:scale-[1.01]"
                      style={{ perspective: '1000px' }}
                    >
                      {t('contact.readyToStart')}
                    </h3>
                    <p className="mt-4 text-sm md:text-base lg:text-lg text-black/70 font-helvetica max-w-md">
                      {t('contact.formDescription')}
                    </p>
                  </div>

                  {/* Botón Enter - Abre Google Forms */}
                  <div className="flex justify-start pt-4">
                    <button
                      type="submit"
                      className="px-10 py-4 bg-black text-white hover:bg-black/80 transition-colors duration-300 text-base md:text-lg font-helvetica font-medium tracking-wide"
                    >
                      {t('contact.goToForm')} →
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        
      </section>

      {/* Footer negro */}
      <footer className="w-full bg-black text-white py-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* About us */}
            <div>
              <h3 className="text-sm font-medium mb-4">About us</h3>
              <ul className="space-y-2">
                {contactInfo.aboutLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} className="text-sm text-white/70 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Team */}
            <div>
              <h3 className="text-sm font-medium mb-4">Team</h3>
              <ul className="space-y-2">
                {contactInfo.teamLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} className="text-sm text-white/70 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-medium mb-4">Contact</h3>
              <div className="space-y-2 text-sm text-white/70">
                <p>{contactInfo.email}</p>
                <p>{contactInfo.phone}</p>
                <p>{contactInfo.address}</p>
              </div>
            </div>

            {/* Legal text */}
            <div>
              <p className="text-xs text-white/50 leading-relaxed">
                {contactInfo.legalText}
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-4">
            <p className="text-xs text-white/50 text-center">
              © {contactInfo.year} {contactInfo.companyName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
