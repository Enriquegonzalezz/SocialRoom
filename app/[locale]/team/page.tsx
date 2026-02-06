'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/app/hooks/useTranslation';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  roleKey?: string;
  memberKey?: string;
  image: string;
  color: string;
  accent?: string;
  size: 'small' | 'medium' | 'large'; // Para Bento Grid
  objectPosition?: string; // Para controlar el posicionamiento de la imagen
}


const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Fabian',
    role: 'Photographer',
    image: '/muchachos/fabian.webp',
    color: 'bg-amber-100',
    size: 'medium',
    objectPosition: 'left center',
  },
  {
    id: '2',
    name: 'Manuel',
    role: 'CEO',
    image: '/muchachos/manuel.webp',
    color: 'bg-blue-100',
    size: 'small',
    objectPosition: 'right center',
  },
  {
    id: '3',
    name: 'Eduardo',
    role: 'Logistics',
    image: '/muchachos/eduardo.webp',
    color: 'bg-emerald-100',
    size: 'small',
  
  },
  {
    id: '4',
    name: 'Jorge',
    role: 'CSO',
    image: '/muchachos/jorge.webp',
    color: 'bg-purple-100',
    size: 'medium',
  
  },
  {
    id: '5',
    name: 'Enrique',
    role: 'Full Stack Developer',
    image: '/muchachos/enrique.webp',
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
    image: '/muchachos/carlitos.webp',
    color: 'bg-indigo-100',
    size: 'small',
  },
  {
    id: '8',
    name: 'Jeli',
    role: 'Community Manager',
    image: '/muchachos/jeli.webp',
    color: 'bg-cyan-100',
    size: 'small',
  },
  {
    id: '9',
    name: 'Eli',
    role: 'Project-Coordinator',
    image: '/muchachos/ellie.webp',
    color: 'bg-red-100',
    size: 'small',
  },
  {
    id: '10',
    name: 'Manuel',
    role: 'Designer',
    image: '/muchachos/manuel.webp',
    color: 'bg-teal-100',
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
    image: '/muchachos/mavi.webp',
    color: 'bg-amber-100',
    size: 'small',
  },
  {
    id: '13',
    name: 'Victor',
    role: 'Photographer',
    image: '/muchachos/victor.webp',
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
    image: '/muchachos/angela.webp',
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
    image: '/muchachos/willder.webp',
    color: 'bg-lime-100',
    size: 'small',
  },
];

// Filtrar miembros con imagen válida
const validMembers = teamMembers.filter(m => m.image && m.image.trim() !== '' && !m.image.endsWith('/'));

// Componente de tarjeta individual con diseño creativo
const CreativeTeamCard = ({ 
  member, 
  index,
  onSelect,
  t
}: { 
  member: TeamMember; 
  index: number;
  onSelect: (member: TeamMember) => void;
  t: (key: string) => string | string[];
}) => {
  // Obtener datos traducidos
  const role = t(`team.roles.${member.roleKey}`) as string;
  const bio = t(`team.members.${member.memberKey}.bio`) as string;
  const skillsRaw = t(`team.members.${member.memberKey}.skills`);
  const skills: string[] = Array.isArray(skillsRaw) ? skillsRaw : [];
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // Animación de entrada con scroll
    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 100,
        rotateX: -15,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  const handleMouseEnter = () => {
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1.05,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        y: -10,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = () => {
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const isEven = index % 2 === 0;

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(member)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group cursor-pointer relative flex flex-col md:flex-row ${isEven ? '' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center py-12 md:py-20 border-b border-black/10`}
      style={{ perspective: '1000px' }}
    >
      {/* Imagen con efecto creativo */}
      <div className="relative w-full md:w-1/2 aspect-4/5 max-w-md">
        {/* Fondo con gradiente */}
        <div 
          className={`absolute inset-0 bg-linear-to-br ${member.color} rounded-3xl transform ${isEven ? 'rotate-3' : '-rotate-3'} transition-transform duration-500 group-hover:rotate-0`}
        />
        
        {/* Contenedor de imagen */}
        <div 
          ref={imageRef}
          className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl"
        >
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          
          {/* Overlay con número */}
          <div className="absolute bottom-4 right-4 w-16 h-16 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold font-helvetica">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div 
        ref={contentRef}
        className={`w-full md:w-1/2 ${isEven ? 'md:text-left' : 'md:text-right'} text-center`}
      >
        {/* Nombre grande */}
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-black font-helvetica tracking-tight mb-4 leading-none normal-case">
          {member.name}
        </h2>
        
        {/* Rol con acento de color */}
        <div className={`flex items-center gap-3 mb-6 ${isEven ? 'md:justify-start' : 'md:justify-end'} justify-center`}>
          <div 
            className="w-8 h-1 rounded-full"
            style={{ backgroundColor: member.accent }}
          />
          <span className="text-xl md:text-2xl font-light text-black/70 font-helvetica uppercase tracking-widest">
            {role}
          </span>
        </div>
        
        {/* Bio */}
        <p className="text-lg md:text-xl text-black/60 font-helvetica font-light leading-relaxed mb-8 max-w-lg mx-auto md:mx-0">
          {bio}
        </p>
        
        {/* Skills */}
        <div className={`flex flex-wrap gap-3 ${isEven ? 'md:justify-start' : 'md:justify-end'} justify-center`}>
          {skills.map((skill: string, i: number) => (
            <span 
              key={i}
              className="px-4 py-2 bg-black/5 rounded-full text-sm font-helvetica text-black/70 hover:bg-black hover:text-white transition-colors duration-300"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Flecha indicadora */}
        <div className={`mt-8 flex ${isEven ? 'md:justify-start' : 'md:justify-end'} justify-center`}>
          <div 
            className="w-12 h-12 rounded-full border-2 border-black/20 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all duration-300"
          >
            <svg 
              className="w-5 h-5 text-black/40 group-hover:text-white transition-colors duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de detalle
const DetailModal = ({ 
  member, 
  isOpen, 
  onClose,
  t
}: { 
  member: TeamMember | null; 
  isOpen: boolean; 
  onClose: () => void;
  t: (key: string) => string | string[];
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && member) {
      document.body.style.overflow = 'hidden';
      
      gsap.to(backdropRef.current, {
        opacity: 1,
        duration: 0.3,
      });
      
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, scale: 0.9, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    } else {
      document.body.style.overflow = '';
      
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
      });
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, member]);

  if (!member) return null;

  // Obtener datos traducidos
  const role = t(`team.roles.${member.roleKey}`) as string;
  const bio = t(`team.members.${member.memberKey}.bio`) as string;
  const skillsRaw = t(`team.members.${member.memberKey}.skills`);
  const skills: string[] = Array.isArray(skillsRaw) ? skillsRaw : [];

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        ref={backdropRef}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md opacity-0"
      />
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
        <div 
          ref={contentRef}
          className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl opacity-0"
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-12 h-12 bg-black/10 hover:bg-black hover:text-white rounded-full flex items-center justify-center transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Imagen grande */}
            <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-[600px]">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                priority
              />
              <div 
                className={`absolute inset-0 bg-linear-to-t ${member.color} opacity-30`}
              />
            </div>

            {/* Info detallada */}
            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <div 
                className="w-16 h-2 rounded-full mb-8"
                style={{ backgroundColor: member.accent }}
              />
              
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black font-helvetica tracking-tight mb-4">
                {member.name}
              </h2>
              
              <p className="text-xl md:text-2xl text-black/50 font-helvetica uppercase tracking-widest mb-8">
                {role}
              </p>
              
              <p className="text-lg md:text-xl text-black/70 font-helvetica font-light leading-relaxed mb-10">
                {bio}
              </p>
              
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-black/40 uppercase tracking-widest font-helvetica">
                  Expertise
                </h4>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill: string, i: number) => (
                    <span 
                      key={i}
                      className="px-5 py-2.5 rounded-full text-sm font-helvetica font-medium"
                      style={{ 
                        backgroundColor: `${member.accent}15`,
                        color: member.accent,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TeamPage() {
  const { t } = useTranslation();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Animación del hero
    if (titleRef.current) {
      const chars = titleRef.current.innerText.split('');
      titleRef.current.innerHTML = chars
        .map(char => `<span class="inline-block">${char === ' ' ? '&nbsp;' : char}</span>`)
        .join('');
      
      gsap.fromTo(
        titleRef.current.querySelectorAll('span'),
        { opacity: 0, y: 100, rotateX: -90 },
        { 
          opacity: 1, 
          y: 0, 
          rotateX: 0,
          duration: 1,
          stagger: 0.03,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  const handleSelectMember = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMember(null), 300);
  };

  return (
    <main className="min-h-screen bg-[#f3f3f3]">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-[70vh] flex items-center justify-center px-6 md:px-12 lg:px-20 pt-32 pb-20"
      >
        <div className="text-center max-w-5xl mx-auto">
          {/* Subtítulo */}
          <p className="text-lg md:text-xl text-black/50 font-helvetica uppercase tracking-[0.3em] mb-6">
            {t('team.subtitle')}
          </p>
          
          {/* Título principal */}
          <h1 
            ref={titleRef}
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-black font-helvetica tracking-tight leading-none mb-8"
            style={{ perspective: '1000px' }}
          >
            {t('team.title')}
          </h1>
          
          {/* Descripción */}
          <p className="text-xl md:text-2xl text-black/60 font-helvetica font-light max-w-2xl mx-auto">
            {t('team.pageDescription') || 'Meet the creative minds behind our work. Each member brings unique skills and passion to every project.'}
          </p>
          
          {/* Scroll indicator */}
          <div className="mt-16 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-sm text-black/40 font-helvetica uppercase tracking-widest">Scroll</span>
            <svg className="w-6 h-6 text-black/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="px-6 md:px-12 lg:px-20 pb-32">
        <div className="max-w-7xl mx-auto">
          {validMembers.map((member, index) => (
            <CreativeTeamCard 
              key={member.id} 
              member={member} 
              index={index}
              onSelect={handleSelectMember}
              t={t}
            />
          ))}
        </div>
      </section>

      {/* Back to home */}
      <section className="px-6 md:px-12 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto text-center">
          <Link 
            href="/"
            className="inline-flex items-center gap-3 text-lg font-helvetica text-black/60 hover:text-black transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            {t('nav.home')}
          </Link>
        </div>
      </section>

      {/* Modal */}
      <DetailModal 
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        t={t}
      />
    </main>
  );
}
