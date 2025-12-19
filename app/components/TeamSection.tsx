'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import { useTranslation } from '@/app/hooks/useTranslation';
import SectionFooterButton from './SectionFooterButton';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  color: string;
}

interface TeamMemberWithSize extends TeamMember {
  size: 'small' | 'medium' | 'large'; // Para Bento Grid
}

const teamMembers: TeamMemberWithSize[] = [
  {
    id: '1',
    name: 'Fabian',
    role: 'Photographer',
    image: '/muchachos/Fabian.webp',
    color: 'bg-amber-100',
    size: 'medium',
  },
  {
    id: '2',
    name: 'Manuel',
    role: 'CEO',
    image: '/muchachos/MANUEL PADRE.png',
    color: 'bg-blue-100',
    size: 'small',
  },
  {
    id: '3',
    name: 'Dubraska',
    role: 'Project Coordinator',
    image: '/muchachos/Dubraska.webp',
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
    role: 'Designer',
    image: '/muchachos/Erika.webp',
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
    name: 'Luis Felipe',
    role: 'Video Editor',
    image: '',
    color: 'bg-red-100',
    size: 'small',
  },
  {
    id: '10',
    name: 'Manuel',
    role: 'Designer',
    image: '/muchachos/Manuel.webp',
    color: 'bg-teal-100',
    size: 'medium',
  },
  {
    id: '11',
    name: 'Maria',
    role: 'Designer',
    image: '/muchachos/Maria.webp',
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
    name: 'Eli',
    role: 'Project-Coordinator',
    image: '/muchachos/Ellie.webp',
    color: 'bg-orange-100',
    size: 'small',
  },
  {
    id: '17',
    name: '',
    role: '',
    image: '',
    color: 'bg-gray-100',
    size: 'small',
  },
  {
    id: '18',
    name: '',
    role: '',
    image: '',
    color: 'bg-gray-100',
    size: 'small',
  },
  {
    id: '19',
    name: '',
    role: '',
    image: '',
    color: 'bg-gray-100',
    size: 'small',
  },
  {
    id: '20',
    name: 'Juli',
    role: 'Designer',
    image: '/muchachos/Julia.webp',
    color: 'bg-neutral-100',
    size: 'small',
  },
  {
    id: '21',
    name: '',
    role: '',
    image: '',
    color: 'bg-gray-100',
    size: 'small',
  },
  {
    id: '22',
    name: '',
    role: '',
    image: '',
    color: 'bg-gray-100',
    size: 'small',
  },
];

interface TeamCardProps {
  member: TeamMemberWithSize;
  onImageClick: (member: TeamMember) => void;
}

const TeamCard = ({ member, onImageClick }: TeamCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
  // ✅ NO hacer nada en móvil
  if (window.innerWidth < 768) return;
  
  gsap.to(cardRef.current, {
    scale: 1.05, // ✅ CAMBIADO de 1.00 a 1.05
    duration: 0.3,
    ease: 'power2.out',
  });
};

const handleMouseLeave = () => {
  // ✅ NO hacer nada en móvil
  if (window.innerWidth < 768) return;
  
  gsap.to(cardRef.current, {
    scale: 1,
    duration: 0.3,
    ease: 'power2.out',
  });
};

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onImageClick(member)}
      className="cursor-pointer relative w-full aspect-square rounded-lg overflow-hidden group transition-all"
    >
      {/* Contenedor con overflow hidden para evitar desbordamiento en zoom */}
      <div className={`relative w-full h-full overflow-hidden rounded-lg ${member.color}`}>
        {member.image && member.image.trim() !== '' ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23f3f3f3' width='400' height='400'/%3E%3C/svg%3E"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            quality={75}
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
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
                loading="eager"
                placeholder="blur"
                blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23f9fafb' width='400' height='400'/%3E%3C/svg%3E"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={75}
                priority={true}
                className="object-cover"
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
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMember(null), 300);
  };

  // Los cards aparecen sin animación
  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('[data-card]');
      cards.forEach((card) => {
        (card as HTMLElement).style.opacity = '1';
      });
    }
  }, []);

  return (
    <section className="min-h-screen bg-[#f3f3f3] py-20 px-6 md:px-12 lg:px-16">
      <div className="w-4/5 mx-auto">
        {/* Título */}
        <div className=" mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-4 font-social">
            {t('team.title')}
          </h2>
          <p className="text-2xl md:text-3xl text-black/80 font-social">
            {t('team.subtitle')}
          </p>
        </div>

        {/* Grid de miembros - Mobile: grid simple, Desktop: bento grid */}
        
        {/* Mobile Grid - Grid creativo de 3 columnas */}
        <div
          ref={containerRef}
          className="grid grid-cols-3 gap-2 md:hidden"
          
        >
          {(() => {
            // Filtrar miembros con imagen
            const membersWithImage = teamMembers.filter(m => m.image && m.image.trim() !== '');
            
            // Encontrar a los cofundadores importantes
            const jorge = membersWithImage.find(m => m.name === 'Jorge' && m.role === 'CSO');
            const manuelCEO = membersWithImage.find(m => m.name === 'Manuel' && m.role === 'CEO');
            const erika = membersWithImage.find(m => m.name === 'Erika'); // Large size
            
            // Resto de miembros
            const others = membersWithImage.filter(m => 
              !(m.name === 'Jorge' && m.role === 'CSO') && 
              !(m.name === 'Manuel' && m.role === 'CEO') &&
              m.name !== 'Erika' &&
              m.name !== 'Fabian'
            );
            
            
            // Grid creativo de 3 columnas con diferentes spans
            const mobileGridLayout = [
              // Fila 1: Manuel como miembro destacado + otros miembros
              manuelCEO ? { ...manuelCEO, className: 'col-span-2' } : null,
              others[11] ? { ...others[11], className: 'col-start-3' } : null, // último miembro en columna 3
              
              // Fila 2: Jorge destacado + otro miembro
              others[0] ? { ...others[0], className: 'col-start-1 row-start-2' } : null, // primer miembro en columna 1
              jorge ? { ...jorge, className: 'col-span-2 col-start-2 row-start-2' } : null,
              
              // Fila 3: Tres miembros
              others[1] ? { ...others[1], className: 'row-start-3' } : null,
              others[2] ? { ...others[2], className: 'col-start-2 row-start-3' } : null,
              others[3] ? { ...others[3], className: 'col-start-3 row-start-3' } : null,
              
              // Fila 4: Tres miembros desordenados
              others[4] ? { ...others[4], className: 'col-start-2 row-start-4' } : null,
              others[5] ? { ...others[5], className: 'col-start-3 row-start-4' } : null,
              others[6] ? { ...others[6], className: 'col-start-1 row-start-5' } : null,
              
              // Fila 5: Alternando columnas
              others[7] ? { ...others[7], className: 'col-start-2 row-start-5' } : null,
              others[8] ? { ...others[8], className: 'col-start-3 row-start-6' } : null,
              others[9] ? { ...others[9], className: 'col-start-1 row-start-6' } : null,
              
              // Fila 6-7: Más desorden
              others[10] ? { ...others[10], className: 'col-start-2 row-start-7' } : null,
            ].filter((member): member is TeamMemberWithSize & { className: string } => member !== null); // Filtrar nulos con type guard
            
            return mobileGridLayout.map((member, idx) => (
              <div 
                key={member.id} 
                data-card
                className={`${member.className} aspect-square`}
              >
                <TeamCard member={member} onImageClick={handleImageClick} />
              </div>
            ));
          })()}
        </div>

        {/* Desktop Bento Grid */}
        <div
          className="hidden md:grid grid-cols-12 gap-2"
          style={{ gridAutoRows: 'minmax(80px, 1fr)' }}
        >
          <div className="col-span-2 row-span-2" data-card>
            <TeamCard member={teamMembers[0]} onImageClick={handleImageClick} />
          </div>
          <div className="col-span-3 row-span-4 col-start-3 row-start-2" data-card>
            <TeamCard member={teamMembers[1]} onImageClick={handleImageClick} />
          </div>
          <div className="col-start-2 row-start-5" data-card>
            <TeamCard member={teamMembers[2]} onImageClick={handleImageClick} />
          </div>
          <div className="col-span-3 row-span-4 col-start-9 row-start-4" data-card>
            <TeamCard member={teamMembers[3]} onImageClick={handleImageClick} />
          </div>
          <div className="col-span-2 row-span-2 col-start-11 row-start-2" data-card>
            <TeamCard member={teamMembers[4]} onImageClick={handleImageClick} />
          </div>
          <div className="col-start-11 row-start-8" data-card>
            <TeamCard member={teamMembers[5]} onImageClick={handleImageClick} />
          </div>
          <div className="col-span-2 row-span-2 col-start-9 row-start-8" data-card>
            <TeamCard member={teamMembers[6]} onImageClick={handleImageClick} />
          </div>
          <div className="col-span-2 row-span-2 col-start-3 row-start-6" data-card>
            <TeamCard member={teamMembers[7]} onImageClick={handleImageClick} />
          </div>
          <div className="col-span-2 row-span-2 col-start-1 row-start-7" data-card>
            <TeamCard member={teamMembers[8]} onImageClick={handleImageClick} />
          </div>
          <div className="col-start-5 row-start-7" data-card>
            <TeamCard member={teamMembers[9]} onImageClick={handleImageClick} />
          </div>
          <div className="col-start-9 row-start-3" data-card>
            <TeamCard member={teamMembers[10]} onImageClick={handleImageClick} />
          </div>
          <div className="col-span-2 row-span-2 col-start-7 row-start-5" data-card>
            <TeamCard member={teamMembers[11]} onImageClick={handleImageClick} />
          </div>
          <div className="col-start-2 row-start-3" data-card>
            <TeamCard member={teamMembers[12]} onImageClick={handleImageClick} />
          </div>
          <div className="col-span-2 row-span-2 col-start-5 row-start-8" data-card>
            <TeamCard member={teamMembers[13]} onImageClick={handleImageClick} />
          </div>
          <div className="col-span-2 row-span-2 col-start-6 row-start-2" data-card>
            <TeamCard member={teamMembers[14]} onImageClick={handleImageClick} />
          </div>
          <div className="col-span-2 row-span-2 col-start-9 row-start-1" data-card>
            <TeamCard member={teamMembers[15]} onImageClick={handleImageClick} />
          </div>
          <div className="col-start-11 row-start-1" data-card>
            <TeamCard member={teamMembers[16]} onImageClick={handleImageClick} />
          </div>
          <div className="col-start-12 row-start-6" data-card>
            <TeamCard member={teamMembers[17]} onImageClick={handleImageClick} />
          </div>
          <div className="row-span-2 col-start-8 row-start-7" data-card>
            <TeamCard member={teamMembers[18]} onImageClick={handleImageClick} />
          </div>
          <div className="col-span-2 row-span-2 col-start-1 row-start-1" data-card>
            <TeamCard member={teamMembers[19]} onImageClick={handleImageClick} />
          </div>
          <div className="col-start-7 row-start-8" data-card>
            <TeamCard member={teamMembers[20]} onImageClick={handleImageClick} />
          </div>
          <div className="col-start-4 row-start-1" data-card>
            <TeamCard member={teamMembers[21]} onImageClick={handleImageClick} />
          </div>
        </div>
      </div>

      {/* Botón de footer de sección */}
      <SectionFooterButton section="team" />

      {/* Modal */}
      <TeamModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}
