"use client";

import Image from 'next/image';
import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useTranslation } from '@/app/hooks/useTranslation';
import { useRouter } from 'next/navigation';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import LanguageSwitcher from './LanguageSwitcher';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const videoContainerMobileRef = useRef<HTMLDivElement>(null);
  const videoContainerDesktopRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const text = "TAKE A VIEW • TAKE A VIEW • TAKE A VIEW • TAKE A VIEW • TAKE A VIEW • TAKE A VIEW • ";
  const characters = text.split("");
  const degree = 360 / characters.length;

  useGSAP(() => {
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        scale: 1,
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: '+=200',
          scrub: 0.5,
          markers: false
        }
      });
    }
  }, { scope: logoRef });

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    handler(mql);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const handleVideoClick = (isMobile: boolean) => {
    const container = isMobile ? videoContainerMobileRef.current : videoContainerDesktopRef.current;
    const video = videoRef.current;
    
    if (!container || isVideoPlaying) return;
    
    setIsVideoPlaying(true);
    
    // Obtener posición y tamaño inicial del círculo
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calcular la escala necesaria para cubrir toda la pantalla desde el centro del círculo
    const maxDistance = Math.sqrt(
      Math.pow(Math.max(centerX, window.innerWidth - centerX), 2) +
      Math.pow(Math.max(centerY, window.innerHeight - centerY), 2)
    );
    const scale = (maxDistance * 2) / rect.width;
    
    // Crear círculo expansivo
    const expandingCircle = document.createElement('div');
    expandingCircle.style.cssText = `
      position: fixed;
      top: ${centerY}px;
      left: ${centerX}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: black;
      z-index: 9998;
      pointer-events: none;
    `;
    document.body.appendChild(expandingCircle);
    
    // Crear overlay para el video
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
    `;
    
    // Crear video element
    const videoElement = document.createElement('video');
    videoElement.src = '/video-hero.mp4'; // Cambia esto por la ruta de tu video
    videoElement.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
    `;
    videoElement.controls = false;
    videoElement.autoplay = true;
    videoElement.muted = false;
    
    // Botón de cerrar
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✕';
    closeButton.style.cssText = `
      position: absolute;
      top: 2rem;
      right: 2rem;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid white;
      font-size: 1.5rem;
      cursor: pointer;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    `;
    
    closeButton.onmouseover = () => {
      closeButton.style.background = 'rgba(255, 255, 255, 0.4)';
    };
    closeButton.onmouseout = () => {
      closeButton.style.background = 'rgba(255, 255, 255, 0.2)';
    };
    
    const closeVideo = () => {
      // Animación de cierre del círculo
      gsap.to(expandingCircle, {
        scale: 0,
        duration: 0.6,
        ease: 'power2.in'
      });
      
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          document.body.removeChild(overlay);
          document.body.removeChild(expandingCircle);
          setIsVideoPlaying(false);
        }
      });
    };
    
    closeButton.onclick = closeVideo;
    videoElement.onended = closeVideo;
    
    overlay.appendChild(videoElement);
    overlay.appendChild(closeButton);
    document.body.appendChild(overlay);
    
    // Animación de expansión del círculo desde su centro
    gsap.fromTo(expandingCircle,
      {
        scale: 1,
        borderRadius: '50%'
      },
      {
        scale: scale,
        borderRadius: '0%',
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          // Mostrar el video cuando el círculo termine de expandirse
          gsap.to(overlay, {
            opacity: 1,
            duration: 0.3
          });
        }
      }
    );
  };

  return (
    <section 
      className="hero-section relative min-h-screen text-black overflow-hidden bg-center bg-no-repeat bg-cover"
    >
      {/* Header con menu y selector de idioma */}
      <header className="absolute top-10 left-0 right-0 z-40 bg-transparent">
        <div className="flex items-center justify-between px-6 md:px-10 py-4  md:mx-auto md:w-full">
          {/* Menu Hamburguesa con label a la izquierda */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 group cursor-pointer"
            aria-label="Menu"
          >
            <div className="flex flex-col gap-1 w-5 h-5 justify-center">
              <span className={`w-full h-0.5 bg-black transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`w-full h-0.5 bg-black transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-full h-0.5 bg-black transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
            <span className="text-sm font-light text-black underline decoration-1 underline-offset-4">{t('hero.menu')}</span>
          </button>

          {/* Selector de idioma a la derecha */}
          <LanguageSwitcher />
        </div>
      </header>

      {/* Logo centrado fijo - Se mantiene visible al hacer scroll */}
      <div
        ref={logoRef}
        className="fixed left-1/2 -translate-x-1/2 md:-translate-x-[50%] z-50 py-4 origin-center"
        style={{
          scale: isMobile ? 1 : 1.5,
          top: isMobile ? 'calc(env(safe-area-inset-top, 0px) + 12px)' : '12px',
        }}
      >
        <Image src="/socialroomnegro.svg" alt="Logo" width={300} height={300} className="h-20 w-auto md:h-28" />
      </div>

      {/* Drawer/Menu Lateral */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 overflow-hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Drawer */}
          <div 
            className="absolute left-0 top-0 w-full sm:w-[400px] md:w-[450px] bg-white flex flex-col"
            style={{ height: '100dvh', maxHeight: '100dvh' }}
          >
            {/* Header con botón de cerrar */}
            <div className="flex-shrink-0 flex justify-end items-center p-4 sm:p-6">
              <button 
                onClick={() => setMenuOpen(false)}
                className="text-black hover:text-black/50 transition-colors p-2"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Navegación - Minimalista */}
            <nav className="flex-1 flex flex-col items-start justify-center px-8 sm:px-10 md:px-12 space-y-4 sm:space-y-5 md:space-y-6">
              <button 
                onClick={() => setMenuOpen(false)}
                className="text-2xl sm:text-3xl md:text-4xl font-light text-black hover:text-black/50 transition-colors font-thermal tracking-wide"
              >
                {t('nav.home')}
              </button>
              
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  router.push(`/${locale}/about`);
                }}
                className="text-2xl sm:text-3xl md:text-4xl font-light text-black hover:text-black/50 transition-colors font-thermal tracking-wide"
              >
                {t('floatingButton.aboutUs')}
              </button>
              
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  router.push(`/${locale}/services`);
                }}
                className="text-2xl sm:text-3xl md:text-4xl font-light text-black hover:text-black/50 transition-colors font-thermal tracking-wide"
              >
                {t('floatingButton.services')}
              </button>
              
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  router.push(`/${locale}/projects`);
                }}
                className="text-2xl sm:text-3xl md:text-4xl font-light text-black hover:text-black/50 transition-colors font-thermal tracking-wide"
              >
                {t('nav.projects')}
              </button>
              
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  router.push(`/${locale}/team`);
                }}
                className="text-2xl sm:text-3xl md:text-4xl font-light text-black hover:text-black/50 transition-colors font-thermal tracking-wide"
              >
                {t('nav.team')}
              </button>
              
              <button 
                onClick={() => {
                  setMenuOpen(false);
                  window.open('/equipment/login', '_blank');
                }}
                className="text-2xl sm:text-3xl md:text-4xl font-light text-black hover:text-black/50 transition-colors font-thermal tracking-wide"
              >
                {t('nav.employees')}
              </button>
            </nav>
            
            {/* Footer del menú */}
            <div className="flex-shrink-0 px-8 sm:px-10 md:px-12 py-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-light tracking-wider uppercase">Social Room</p>
            </div>
          </div>
        </div>
      )}

      {/* Contenido Principal - Mobile */}
      <div
        className="lg:hidden relative min-h-svh flex flex-col items-center justify-between px-5 pb-10"
        style={{
          minHeight: '100dvh',
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 80px)',
        }}
      >
        {/* Contenedor superior centrado */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* LAB IDEAS */}
          <div className="text-center mb-4" style={{ marginTop: '30px' }}>
            <h2 className="text-[#D52500] font-bold font-helvetica -tracking-widest" style={{ fontSize: 'clamp(5rem, 15vw, 5rem)', lineHeight: '0.75' }}>
              {t('hero.labIdeas').split(' ')[0]} 
              <span style={{ fontSize: '0.4em', marginLeft: '10px', letterSpacing: '0.05em' }} className="align-middle">
                {t('hero.labIdeas').split(' ')[1]}
              </span>
               <br />
              {t('hero.labIdeas').split(' ')[2]}
            </h2>
          </div>

          <div className="relative w-[320px] h-[320px] mb-8">
          {/* Círculos decorativos alrededor */}
          {/* Top */}
         

          {/* Círculo negro central con contenido */}
          <div 
            ref={videoContainerMobileRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full bg-black overflow-hidden flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 z-10"
            onClick={() => handleVideoClick(true)}
          >
            {/* Imagen placeholder del video */}
            <Image 
              src="/fondovideo1.png" 
              alt="Video preview" 
              fill
              className="object-cover"
            />
            
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <Image 
                src="/play.png" 
                alt="Play" 
                width={32} 
                height={32}
                className="ml-4 w-12 h-12"
              />
            </div>
          </div>

          {/* Texto circular giratorio alrededor */}
          <div className="circular-text">
            {characters.map((char, index) => (
              <span
                key={index}
                style={{
                  transform: `rotate(${degree * index}deg)`
                }}
              >
                {char}
              </span>
            ))}
          </div>
          </div>
        </div>

        {/* Botón About Us */}
        <button
          onClick={() => router.push(`/${locale}/about`)}
          className="flex items-center gap-2 px-6 py-4 bg-white  text-black hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
        >
          <span className="text-[14px] font-light underline decoration-1 underline-offset-4 font-helvetica ">{t('hero.aboutUs')}</span>
          <ArrowOutwardIcon />
        </button>
      </div>

      {/* Contenido Principal - Desktop */}
      <div className="hidden lg:flex relative min-h-screen flex-col items-center justify-between px-10 pt-20 pb-10">
        <div className="flex-1 w-full max-w-7xl flex items-center justify-between">
          {/* Lado izquierdo - SOCIAL ROOM */}
          <div className="flex flex-col justify-center">
            <h2 className="text-[#D52500] font-bold font-helvetica -tracking-widest" style={{ fontSize: 'clamp(8rem, 12vw, 12rem)', lineHeight: '0.85' }}>
              {t('hero.labIdeas').split(' ')[0]}
              <span style={{ fontSize: '0.4em', marginLeft: '15px', letterSpacing: '0.0em' }} className="align-middle">
                {t('hero.labIdeas').split(' ')[1]}
              </span>
              <br />
              {t('hero.labIdeas').split(' ')[2]}
            </h2>
            
            {/* LAB IDEAS pequeño abajo a la izquierda */}
            
          </div>

          {/* Lado derecho - Círculo con video y texto circular */}
          <div className="relative w-[450px] h-[450px]">
            {/* Círculo negro central con contenido */}
            <div 
              ref={videoContainerDesktopRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-black overflow-hidden flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105 z-10"
              onClick={() => handleVideoClick(false)}
            >
              {/* Imagen placeholder del video */}
              <Image 
                src="/fondovideo1.png" 
                alt="Video preview" 
                fill
                className="object-cover"
              />
              
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <Image 
                  src="/play.png" 
                  alt="Play" 
                  width={48} 
                  height={48}
                  className="ml-4 w-16 h-16"
                />
              </div>
            </div>

            {/* Texto circular giratorio alrededor */}
            <div className="circular-text">
              {characters.map((char, index) => (
                <span
                  key={index}
                  style={{
                    transform: `rotate(${degree * index}deg)`
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer con LAB IDEAS, About Us y MARKETING AGENCY */}
        <div className="w-full flex items-center justify-between ">
          {/* LAB IDEAS - Izquierda */}
          <div className="w-[11vw]">
            <p className="text-[#D52500] font-bold font-helvetica text-transparent" style={{ fontSize: 'clamp(1.5rem, 2vw, 2rem)', lineHeight: '0.9' }}>
              {t('hero.labIdeas').split(' ')[0]} <br />
              {t('hero.labIdeas').split(' ')[2]}
            </p>
          </div>

          {/* Botón About Us - Centro */}
          <button
            onClick={() => router.push(`/${locale}/about`)}
            className="flex items-center gap-2 px-6 py-4 bg-black border-2 border-black  text-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
          >
            <span className="text-[14px] font-weight-[400] underline decoration-1 underline-offset-4 font-helvetica">{t('hero.aboutUs')}</span>
           <ArrowOutwardIcon width={32} height={32}/>
          </button>

          {/* MARKETING AGENCY - Derecha */}
          <div>
            <p className="text-[#D52500] font-bold font-helvetica text-right" style={{ fontSize: 'clamp(1.5rem, 2vw, 2rem)', lineHeight: '0.9' }}>
              {t('hero.marketingAgency').split(' ')[0]} <br />
              {t('hero.marketingAgency').split(' ')[1]}
            </p>
          </div>
        </div>
      </div>
     
    </section>
  );
}
