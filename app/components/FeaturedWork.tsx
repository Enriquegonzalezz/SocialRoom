'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from '@/app/hooks/useTranslation';
import ImageSkeleton from './ImageSkeleton';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl?: string;
  videoUrl?: string;
  href: string;
}

interface FeaturedWorkProps {
  projects: Project[];
}

export default function FeaturedWork({ projects }: FeaturedWorkProps) {
  const { t, locale } = useTranslation();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Usar requestAnimationFrame para asegurar que el DOM está listo
    const animationFrame = requestAnimationFrame(() => {
      // Pequeño delay para que el DOM esté completamente renderizado
      setTimeout(() => {
        // Animar grid con fade-in
        if (gridRef.current && gridRef.current.children.length > 0) {
          gsap.from(gridRef.current.children, {
            opacity: 0,
            y: 60,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            delay: 0.5,
          });
        }
      }, 50);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <section className="featured-work py-8 sm:py-12 md:py-20 px-3 sm:px-4 md:px-8 lg:px-16 bg-[#f3f3f3]">
      <div ref={gridRef} className="work-grid max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {projects.map((project) => (
          <WorkItem key={project.id} project={project} locale={locale} />
        ))}
      </div>
    </section>
  );
}

function WorkItem({ project, locale }: { project: Project; locale: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const mediaContainerRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  
  useEffect(() => {
  const isMobile = window.innerWidth < 768;
  
  // ✅ En móvil: SOLO IntersectionObserver simple
  if (isMobile) {
    if (itemRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (mediaContainerRef.current) {
                mediaContainerRef.current.style.opacity = '1';
                mediaContainerRef.current.style.transform = 'translateY(0)';
              }
              if (categoryRef.current) {
                categoryRef.current.style.opacity = '1';
                categoryRef.current.style.transform = 'translateY(0)';
              }
              if (titleRef.current) {
                titleRef.current.style.opacity = '1';
                titleRef.current.style.transform = 'translateY(0)';
              }
              observer.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      
      observer.observe(itemRef.current);
      return () => observer.disconnect();
    }
    return;
  }
  
  // Desktop: GSAP completo
  if (itemRef.current && mediaContainerRef.current && categoryRef.current && titleRef.current) {
    const ctx = gsap.context(() => {
      gsap.from(mediaContainerRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: itemRef.current,
          start: 'top 85%',
          end: 'top 60%',
          toggleActions: 'play none none none',
        },
      });

      gsap.from(categoryRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: itemRef.current,
          start: 'top 85%',
          end: 'top 60%',
          toggleActions: 'play none none none',
        },
      });

      gsap.from(titleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: itemRef.current,
          start: 'top 85%',
          end: 'top 60%',
          toggleActions: 'play none none none',
        },
      });
    }, itemRef);

    return () => ctx.revert();
  }
}, []);

  // Lazy loading con IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, [isVisible]);

  // Cargar video o imagen cuando sea visible
  useEffect(() => {
    if (isVisible && !mediaLoaded) {
      if (project.videoUrl && videoRef.current) {
        const video = videoRef.current;
        video.src = project.videoUrl;
        video.load();
        
        video.addEventListener('loadeddata', () => {
          setMediaLoaded(true);
          video.play().catch(() => {
            // Silently handle autoplay failures
          });
        });
      } else if (project.imageUrl && imageRef.current) {
        const img = imageRef.current;
        img.onload = () => {
          setMediaLoaded(true);
        };
        // Si la imagen ya está cargada (cached)
        if (img.complete) {
          setMediaLoaded(true);
        }
      }
    }
  }, [isVisible, project.videoUrl, project.imageUrl, mediaLoaded]);

  // GSAP animations on hover (solo desktop para evitar lag en móvil)
  const handleMouseEnter = () => {
    // No animar en móvil
    if (window.innerWidth < 768) return;
    
    if (mediaContainerRef.current) {
      gsap.to(mediaContainerRef.current, {
        scale: 1.05,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (categoryRef.current) {
      gsap.to(categoryRef.current, {
        y: -5,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        y: -5,
        opacity: 1,
        duration: 0.4,
        delay: 0.05,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handleMouseLeave = () => {
    // No animar en móvil
    if (window.innerWidth < 768) return;
    
    if (mediaContainerRef.current) {
      gsap.to(mediaContainerRef.current, {
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (categoryRef.current) {
      gsap.to(categoryRef.current, {
        y: 0,
        opacity: 0.8,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    if (titleRef.current) {
      gsap.to(titleRef.current, {
        y: 0,
        opacity: 0.9,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  return (
    <div ref={itemRef} className="work-item-wrapper">
      <a
        href={`/${locale}${project.href}`}
        className="work-item block cursor-pointer group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Media Container */}
        <div className="work-item-media relative aspect-16/10 overflow-hidden bg-white mb-4 rounded-4xl">
          <div
            ref={mediaContainerRef}
            className="w-full h-full"
            style={{ 
              transformOrigin: 'center center'
            }}
          >
            {project.videoUrl ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                style={{
                  opacity: mediaLoaded ? 1 : 0,
                  transition: 'opacity 0.6s ease-in-out',
                }}
              />
            ) : project.imageUrl ? (
              <ImageSkeleton
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full"
                objectFit="cover"
              />
            ) : null}
          </div>
        </div>

        {/* Content - Outside video */}
        <div className="work-item-content">
          <p
            ref={categoryRef}
            className="work-item-category text-xs md:text-sm text-black/60 font-light font-helvetica mb-2 tracking-wide"
          >
            {project.category}
          </p>
          <h3
            ref={titleRef}
            className="work-item-title text-2xl md:text-3xl lg:text-4xl font-medium text-black font-helvetica leading-tight"
          >
            {project.title}
          </h3>
        </div>
      </a>
    </div>
  );
}
