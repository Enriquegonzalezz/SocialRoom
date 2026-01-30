'use client';

import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useTranslation } from '@/app/hooks/useTranslation';

gsap.registerPlugin(ScrollTrigger);


interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  color: string;
}

interface TeamMemberWithSize extends TeamMember {
  size: 'small' | 'medium' | 'large'; // Para Bento Grid
  objectPosition?: string; // Para controlar el posicionamiento de la imagen
}

const teamMembers: TeamMemberWithSize[] = [
  {
    id: '1',
    name: 'Fabian',
    role: 'Photographer',
    image: '/muchachos/Fabian.webp',
    color: 'bg-amber-100',
    size: 'medium',
    objectPosition: 'left center',
  },
  {
    id: '2',
    name: 'Manuel',
    role: 'CEO',
    image: '/muchachos/MANUEL PADRE.png',
    color: 'bg-blue-100',
    size: 'small',
    objectPosition: 'right center',
  },
  {
    id: '3',
    name: 'Eduardo',
    role: 'Logistics',
    image: '/muchachos/Eduardo.webp',
    color: 'bg-emerald-100',
    size: 'small',
  
  },
  {
    id: '4',
    name: 'Jorge',
    role: 'CSO',
    image: '/muchachos/Jorge.webp',
    color: 'bg-purple-100',
    size: 'medium',
  
  },
  {
    id: '5',
    name: 'Enrique',
    role: 'Full Stack Developer',
    image: '/muchachos/Enrique.webp',
    color: 'bg-green-100',
    size: 'small',
    
  },
  {
    id: '6',
    name: 'Erika',
    role: 'Project Manager',
    image: '/muchachos/erika.webp',
    color: 'bg-red-100',
    size: 'large',
  },
  {
    id: '7',
    name: 'Carlitos',
    role: 'Designer',
    image: '/muchachos/Carlitos.webp',
    color: 'bg-indigo-100',
    size: 'small',
  },
  {
    id: '8',
    name: 'Jeli',
    role: 'Community Manager',
    image: '/muchachos/Jeli.webp',
    color: 'bg-cyan-100',
    size: 'small',
  },
  {
    id: '9',
    name: 'Eli',
    role: 'Project-Coordinator',
    image: '/muchachos/Ellie.webp',
    color: 'bg-red-100',
    size: 'small',
  },
  {
    id: '10',
    name: '',
    role: '',
    image: '',
    color: 'bg-transparent',
    size: 'medium',
  },
  {
    id: '11',
    name: 'Maria',
    role: 'Designer',
    image: '/muchachos/maria.webp',
    color: 'bg-rose-100',
    size: 'small',
  },
  {
    id: '12',
    name: 'Mavi',
    role: 'Community Manager',
    image: '/muchachos/Mavi.webp',
    color: 'bg-amber-100',
    size: 'small',
  },
  {
    id: '13',
    name: 'Victor',
    role: 'Photographer',
    image: '/muchachos/Victor.webp',
    color: 'bg-violet-100',
    size: 'small',
  },
  {
    id: '14',
    name: 'Mariangel',
    role: 'Administration and RRHH',
    image: '/muchachos/mariangel.webp',
    color: 'bg-fuchsia-100',
    size: 'small',
  },
  {
    id: '15',
    name: 'Angela',
    role: 'Designer',
    image: '/muchachos/Angela.webp',
    color: 'bg-slate-100',
    size: 'small',
  },
  {
    id: '16',
    name: 'Antonio',
    role: 'Designer',
    image: '/muchachos/antonio.webp',
    color: 'bg-orange-100',
    size: 'small',
  },
  {
    id: '17',
    name: 'Dani',
    role: 'Community Manager',
    image: '/muchachos/dani.webp',
    color: 'bg-gray-100',
    size: 'small',
  },
  {
    id: '18',
    name: 'Julia',
    role: 'Designer',
    image: '/muchachos/julia.webp',
    color: 'bg-neutral-100',
    size: 'small',
  },
  {
    id: '19',
    name: 'Luis Felipe',
    role: 'Editor',
    image: '/muchachos/luisfelipe.webp',
    color: 'bg-zinc-100',
    size: 'small',
  },
  {
    id: '20',
    name: 'Nicola',
    role: 'Designer',
    image: '/muchachos/nicola.webp',
    color: 'bg-stone-100',
    size: 'small',
  },
  {
    id: '21',
    name: 'Wilder',
    role: 'Designer UI/UX',
    image: '/muchachos/wilder.webp',
    color: 'bg-lime-100',
    size: 'small',
  },
];

interface TeamCardProps {
  member: TeamMemberWithSize;
  onImageClick: (member: TeamMember) => void;
  priority?: boolean;
  index?: number;
}

const TeamCard = ({ member, onImageClick, priority = false, index = 0 }: TeamCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (cardRef.current && innerRef.current) {
      gsap.to([cardRef.current, innerRef.current], {
        borderRadius: '50%',
        duration: 0.3,
        ease: 'power2.inOut',
      });
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current && innerRef.current) {
      gsap.to([cardRef.current, innerRef.current], {
        borderRadius: '0%',
        duration: 0.3,
        ease: 'power2.inOut',
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={() => onImageClick(member)}
      className="cursor-pointer relative w-full h-full aspect-square overflow-hidden hover:border-5 hover:border-[#BDBBB0]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Contenedor con overflow hidden para evitar desbordamiento */}
      <div ref={innerRef} className={`relative w-full h-full overflow-hidden ${member.color}`}>
        {member.image && member.image.trim() !== '' ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover"
            unoptimized={true}
          />
        ) : null}
      </div>
    </div>
  );
};

interface ModalProps {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

const TeamModal = ({ member, isOpen, onClose }: ModalProps) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (isOpen && member) {
      // Animar backdrop
      gsap.to(backdropRef.current, {
        opacity: 1,
        duration: 0.3,
        pointerEvents: 'auto',
      });

      // Animar contenedor principal
      gsap.to(contentRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out',
      });

      // Animar imagen
      gsap.from(imageRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
      });

      // Animar nombre
      gsap.from(nameRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        delay: 0.1,
        ease: 'power2.out',
      });

      // Animar rol
      gsap.from(roleRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        delay: 0.2,
        ease: 'power2.out',
      });
    } else {
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
        pointerEvents: 'none',
      });

      gsap.to(contentRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.3,
      });
    }
  }, [isOpen, member]);

  if (!member) return null;

  return (
    <>
      {/* Backdrop con blur */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-md opacity-0 pointer-events-none z-40"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
        <div
          ref={contentRef}
          className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl scale-90 opacity-0 pointer-events-auto cursor-pointer bg-white"
          onClick={onClose}
        >
          {/* Layout vertical: imagen a la izquierda, info a la derecha */}
          <div className="flex flex-col md:flex-row">
            {/* Imagen - lado izquierdo */}
            <div ref={imageRef} className="relative w-full md:w-1/2 aspect-square bg-transparent">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                unoptimized={true}
              />
            </div>

            {/* Info - lado derecho */}
            <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12">
              <h2
                ref={nameRef}
                className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4"
              >
                {member.name}
              </h2>
              <p
                ref={roleRef}
                className="text-xl md:text-2xl text-[#666666] font-light"
              >
                {member.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function TeamSection() {
  const { t } = useTranslation();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [randomizedMembers, setRandomizedMembers] = useState<TeamMemberWithSize[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollTextRef = useRef<HTMLDivElement>(null);

  // Randomizar posiciones al montar el componente
  useEffect(() => {
    // Separar miembros fijos y móviles
    const fixedMembers = teamMembers.filter(m => m.id === '2' || m.id === '4');
    const mobileMembers = teamMembers.filter(m => m.id !== '2' && m.id !== '4');
    
    // Randomizar los miembros móviles
    const shuffled = [...mobileMembers].sort(() => Math.random() - 0.5);
    
    // Reconstruir el array con posiciones fijas
    const result: TeamMemberWithSize[] = [];
    let shuffledIndex = 0;
    
    teamMembers.forEach((member, index) => {
      if (member.id === '2' || member.id === '4') {
        // Mantener en posición fija
        result.push(member);
      } else {
        // Usar miembro randomizado
        result.push(shuffled[shuffledIndex]);
        shuffledIndex++;
      }
    });
    
    setRandomizedMembers(result);
  }, []);

  const handleImageClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMember(null), 300);
  };

  // Animación de scroll horizontal del SVG (solo desktop)
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        if (scrollTextRef.current) {
          // Establecer opacidad inicial a 0 para evitar FOUC
          gsap.set(scrollTextRef.current, { opacity: 1 });

          // Animación de desplazamiento
          gsap.to(scrollTextRef.current, {
            x: "-150%",
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: scrollContainerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }
      });
    }, scrollContainerRef);

    return () => ctx.revert();
  }, []);

  // Detectar el índice activo del carrusel en móvil
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = carousel.offsetWidth;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveIndex(index);
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtrar miembros con imagen para el carrusel móvil
  const membersWithImage = teamMembers.filter(m => m.image && m.image.trim() !== '');

  return (
    <section 
      ref={scrollContainerRef}
      className="relative bg-[#f3f3f3] py-10 md:px-12 lg:px-16 overflow-hidden"
    >
      {/* --- MÓVIL: PNG ESTÁTICO --- */}
      <div 
        className="absolute top-0 left-0 right-0 md:hidden pointer-events-none z-0"
        style={{
          backgroundImage: "url('/Our team.png')",
          backgroundSize: 'contain',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          height: '40vh'
        }}
      />

      {/* --- DESKTOP: SVG ANIMADO --- */}
      <div 
        className="hidden md:block absolute top-20 left-[40%] pointer-events-none z-0 -mt-20"
        ref={scrollTextRef}
      >
        <img 
          src="/Nuestro equipo (Stroke).png" 
          alt="Nuestro equipo" 
          className="w-auto max-w-none h-[35vh] will-change-transform"
          onLoad={() => ScrollTrigger.refresh()}
        />
      </div>

      <div className="w-full relative z-10">
        {/* Título */}
        <div className=" mb-12 ml-8">
          <h2 className="text-4xl md:text-6xl font-bold text-black font-helvetica">
            {t('team.title')}
          </h2>
        </div>

        {/* Grid de miembros - Mobile: carrusel, Desktop: bento grid */}
        
        {/* Mobile Carousel - Scroll horizontal con snap */}
        <div className="md:hidden -mx-6 overflow-visible">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto overflow-y-visible snap-x snap-mandatory scrollbar-hide px-6"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {membersWithImage.map((member, index) => (
              <div
                key={member.id}
                data-card
                className="shrink-0 w-full snap-center px-8"
              >
                <div className="w-full">
                  <TeamCard member={member} onImageClick={handleImageClick} index={index} />
                </div>
              </div>
            ))}
          </div>
          
          {/* Indicadores de puntos estilo Instagram */}
          <div className="flex justify-center items-center gap-1.5 mt-6">
            {(() => {
              const totalSlides = membersWithImage.length;
              const maxDots = 5;
              
              // Si hay menos de 5 slides, mostrar todos
              if (totalSlides <= maxDots) {
                return membersWithImage.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const carousel = carouselRef.current;
                      if (carousel) {
                        const cardWidth = carousel.offsetWidth;
                        carousel.scrollTo({
                          left: cardWidth * index,
                          behavior: 'smooth',
                        });
                      }
                    }}
                    className={`transition-all duration-300 ${
                      index === activeIndex
                         ? 'w-2 h-2 bg-[#202020]'
                        : 'w-2 h-2 bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ));
              }
              
              // Lógica para mostrar solo 5 puntos con escala
              const dots = [];
              const halfMax = Math.floor(maxDots / 2); // 2
              
              let startIndex = Math.max(0, activeIndex - halfMax);
              let endIndex = Math.min(totalSlides - 1, activeIndex + halfMax);
              
              // Ajustar si estamos cerca del inicio o final
              if (activeIndex < halfMax) {
                endIndex = Math.min(totalSlides - 1, maxDots - 1);
                startIndex = 0;
              } else if (activeIndex > totalSlides - halfMax - 1) {
                startIndex = Math.max(0, totalSlides - maxDots);
                endIndex = totalSlides - 1;
              }
              
              for (let i = startIndex; i <= endIndex; i++) {
                const distanceFromActive = Math.abs(i - activeIndex);
                
                // Calcular escala basada en la distancia del punto activo
                let scale = 1;
                let opacity = 1;
                
                if (distanceFromActive === 0) {
                  scale = 1; // Punto activo - tamaño completo
                  opacity = 1;
                } else if (distanceFromActive === 1) {
                  scale = 0.75; // Puntos adyacentes
                  opacity = 0.6;
                } else if (distanceFromActive === 2) {
                  scale = 0.5; // Puntos en los extremos
                  opacity = 0.4;
                }
                
                dots.push(
                  <button
                    key={i}
                    onClick={() => {
                      const carousel = carouselRef.current;
                      if (carousel) {
                        const cardWidth = carousel.offsetWidth;
                        carousel.scrollTo({
                          left: cardWidth * i,
                          behavior: 'smooth',
                        });
                      }
                    }}
                    style={{
                      transform: `scale(${scale})`,
                      opacity: opacity,
                    }}
                    className={` transition-all duration-300 ${
                      i === activeIndex
                        ? 'w-2 h-2 bg-[#202020]'
                        : 'w-2 h-2 bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                );
              }
              
              return dots;
            })()}
          </div>
        </div>

        {/* Desktop Grid - Solo para pantallas lg (1024px+) */}
        {randomizedMembers.length > 0 && (
        <div className="hidden lg:grid grid-cols-12 grid-rows-7 gap-4">
          <div className="col-start-2 row-start-2" data-card>
            <TeamCard member={randomizedMembers[0]} onImageClick={handleImageClick} priority={true} index={0} />
          </div>
          <div className="col-start-3 row-start-1" data-card>
            <TeamCard member={randomizedMembers[2]} onImageClick={handleImageClick} priority={true} index={2} />
          </div>
          <div className="col-start-4 row-start-1" data-card>
            <TeamCard member={randomizedMembers[4]} onImageClick={handleImageClick} priority={true} index={4} />
          </div>
          <div className="col-start-5 row-start-1" data-card>
            <TeamCard member={randomizedMembers[5]} onImageClick={handleImageClick} priority={true} index={5} />
          </div>
          <div className="col-span-3 row-span-3 col-start-3 row-start-2" data-card>
            <TeamCard member={randomizedMembers[1]} onImageClick={handleImageClick} priority={true} index={1} />
          </div>
          <div className="col-span-2 row-span-2 col-start-1 row-start-3" data-card>
            <TeamCard member={randomizedMembers[6]} onImageClick={handleImageClick} />
          </div>
          <div className="col-span-2 row-span-2 col-start-1 row-start-5" data-card>
            <TeamCard member={randomizedMembers[7]} onImageClick={handleImageClick} />
          </div>
          <div className="col-span-2 row-span-2 col-start-3 row-start-5" data-card>
            <TeamCard member={randomizedMembers[8]} onImageClick={handleImageClick} />
          </div>
          <div className="col-start-5 row-start-5" data-card>
            <TeamCard member={randomizedMembers[9]} onImageClick={handleImageClick} />
          </div>
          <div className="col-start-5 row-start-6" data-card>
            <TeamCard member={randomizedMembers[10]} onImageClick={handleImageClick} />
          </div>
          <div className="col-start-3 row-start-7" data-card>
            <TeamCard member={randomizedMembers[11]} onImageClick={handleImageClick} />
          </div>
          <div className="col-start-4 row-start-7" data-card>
            <TeamCard member={randomizedMembers[12]} onImageClick={handleImageClick} />
          </div>
          <div className="col-span-2 row-span-2 col-start-6 row-start-6" data-card>
            <TeamCard member={randomizedMembers[13]} onImageClick={handleImageClick} />
          </div>
          <div className="col-span-2 row-span-2 col-start-6 row-start-4" data-card>
            <TeamCard member={randomizedMembers[14]} onImageClick={handleImageClick} />
          </div>
          <div className="col-span-2 row-span-2 col-start-6 row-start-2" data-card>
            <TeamCard member={randomizedMembers[15]} onImageClick={handleImageClick} />
          </div>
          <div className="col-span-2 row-span-2 col-start-8 row-start-2" data-card>
            <TeamCard member={randomizedMembers[16]} onImageClick={handleImageClick} />
          </div>
          <div className="col-start-10 row-start-2" data-card>
            <TeamCard member={randomizedMembers[17]} onImageClick={handleImageClick} />
          </div>
          <div className="col-start-11 row-start-2" data-card>
            <TeamCard member={randomizedMembers[18]} onImageClick={handleImageClick} />
          </div>
          <div className="col-start-10 row-start-3" data-card>
            <TeamCard member={randomizedMembers[19]} onImageClick={handleImageClick} />
          </div>
          <div className="col-span-2 row-span-2 col-start-11 row-start-3" data-card>
            <TeamCard member={randomizedMembers[20]} onImageClick={handleImageClick} />
          </div>
          {/* <div className="col-span-2 row-span-2 col-start-11 row-start-5" data-card>
            <TeamCard member={teamMembers[21]} onImageClick={handleImageClick} />
          </div> */}
          <div className="col-span-3 row-span-3 col-start-8 row-start-4" data-card>
            <TeamCard member={randomizedMembers[3]} onImageClick={handleImageClick} />
          </div>
          {/* <div className="col-start-8 row-start-7" data-card>
            <TeamCard member={randomizedMembers[22]} onImageClick={handleImageClick} />
          </div>
          <div className="col-start-9 row-start-7" data-card>
            <TeamCard member={randomizedMembers[23]} onImageClick={handleImageClick} />
          </div>
          <div className="col-start-10 row-start-7" data-card>
            <TeamCard member={randomizedMembers[24]} onImageClick={handleImageClick} />
          </div>
          <div className="col-start-11 row-start-7" data-card>
            <TeamCard member={randomizedMembers[25]} onImageClick={handleImageClick} /> 
          </div> */}
        </div>
        )}
      </div>

 

      {/* Modal */}
      <TeamModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}
