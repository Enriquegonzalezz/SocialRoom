"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThankYouModal({ isOpen, onClose }: ThankYouModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Set initial states
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(contentRef.current, { opacity: 0, scale: 0.8, y: 50 });
      gsap.set(iconRef.current, { opacity: 0, scale: 0.5, rotation: -180 });
      gsap.set(titleRef.current, { opacity: 0, y: -20 });
      gsap.set(textRef.current, { opacity: 0, y: 20 });
      gsap.set(buttonRef.current, { opacity: 0, y: 20 });
      gsap.set(closeButtonRef.current, { opacity: 0, scale: 0 });

      // Animate in
      const tl = gsap.timeline();
      
      tl.to(backdropRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(contentRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
      }, "-=0.2")
      .to(iconRef.current, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.3")
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")
      .to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.3")
      .to(buttonRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.2")
      .to(closeButtonRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.2");

      // Add subtle floating animation to icon
      gsap.to(iconRef.current, {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 1.5
      });

    } else {
      document.body.style.overflow = 'unset';
      
      // Animate out
      const tl = gsap.timeline();
      
      tl.to(buttonRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.in"
      })
      .to(closeButtonRef.current, {
        opacity: 0,
        scale: 0,
        duration: 0.2,
        ease: "power2.in"
      }, "-=0.2")
      .to(textRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.in"
      }, "-=0.1")
      .to(titleRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in"
      }, "-=0.2")
      .to(iconRef.current, {
        opacity: 0,
        scale: 0.5,
        rotation: 180,
        duration: 0.4,
        ease: "power2.in"
      }, "-=0.2")
      .to(contentRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 50,
        duration: 0.4,
        ease: "power2.in"
      }, "-=0.2")
      .to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      }, "-=0.2");
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        ref={backdropRef}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <div 
        ref={contentRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <div ref={iconRef} className="mb-8 flex justify-center">
            <img 
              src="/check.svg" 
              alt="Check mark" 
              className="w-20 h-20"
            />
          </div>

          <h2 
            ref={titleRef}
            className="text-4xl font-bold text-black mb-4"
          >
            Gracias por contactar
          </h2>
          
          <div ref={textRef} className="mb-8">
            <p className="text-gray-600 text-base">
              Estamos impacientes por escuchar tus ideas. Nos pondremos en contacto contigo en breve.
            </p>
          </div>

          <button
            ref={buttonRef}
            onClick={onClose}
            className="w-full border border-black px-6 py-3 rounded-none flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all duration-300"
          >
            ir al home
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
