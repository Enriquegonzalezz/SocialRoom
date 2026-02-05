"use client";

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/app/hooks/useTranslation';
import { gsap } from 'gsap';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import Image from 'next/image';
import { supabase, Lead } from '@/lib/supabase';
import ThankYouModal from './ThankYouModal';


// Variables configurables para información de contacto
const contactInfo = {
  Descriptionfooter: 'For quicker contact, message us on WhatsApp!',
  companyName: 'Social Room',
  companySubtitle: 'Marketing Agency',
  location: 'Valencia, Miami and LA',
  year: '2025',
  
  // Sección About us
  aboutLinks: [
    { label: 'Services', url: '/services' },
    { label: 'About Us', url: '/about' },
  ],
  
  // Sección Team
  teamLinks: [
    { label: 'Team', url: '/team' },
  ],
  
  // Información de contacto
  email: 'info@socialroomagency.com',
  phone: '+58 412 0639249',
  address: 'Valencia, Miami and LA',
  
  // Legal - ahora usa traducción dinámica
  legalText: '',
};

export default function ContactFooterSection() {
  const { t } = useTranslation();
  const ctaRef = useRef<HTMLHeadingElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    industry: '',
    email: '',
    phoneCode: '+1',
    phoneNumber: '',
    privacyAccepted: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

  const validateName = (value: string): boolean => {
    const nameRegex = /^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]*$/;
    return nameRegex.test(value);
  };

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePhoneNumber = (value: string): boolean => {
    const phoneRegex = /^[0-9\s\-\+\(\)]*$/;
    return phoneRegex.test(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    let newValue = value;
    let fieldError = '';

    if (name === 'name') {
      if (value && !validateName(value)) {
        fieldError = 'Only letters, spaces, and accents are allowed';
        newValue = value.replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ\s]/g, '');
      }
    } else if (name === 'email') {
      if (value && !validateEmail(value) && value.includes('@')) {
        fieldError = 'Please enter a valid email address';
      }
    } else if (name === 'phoneNumber') {
      if (value && !validatePhoneNumber(value)) {
        fieldError = 'Only numbers, spaces, hyphens, and parentheses are allowed';
        newValue = value.replace(/[^0-9\s\-\+\(\)]/g, '');
      }
    }

    setFieldErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : newValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const newErrors: {[key: string]: string} = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';

    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted = 'You must accept the privacy policy';
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setError('Please correct the errors before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const leadData: Lead = {
        name: formData.name,
        country: formData.country,
        industry: formData.industry,
        email: formData.email,
        phone_code: formData.phoneCode,
        phone_number: formData.phoneNumber,
        privacy_accepted: formData.privacyAccepted
      };
      
      const { error: insertError } = await supabase
        .from('leads')
        .insert([leadData]);
      
      if (insertError) {
        console.error('Error inserting lead:', insertError);
        setError('There was an error submitting your information. Please try again.');
        return;
      }
      
      setFormData({
        name: '',
        country: '',
        industry: '',
        email: '',
        phoneCode: '+1',
        phoneNumber: '',
        privacyAccepted: false
      });
      
      setShowModal(true);
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

 useEffect(() => {
  // ✅ DETECTAR MÓVIL PRIMERO
  const isMobile = window.innerWidth < 768;
  
  if (isMobile || !ctaRef.current) {
    return; // ✅ Salir ANTES de manipular el DOM
  }
  
  // Solo desktop: animación de letras agrupadas por palabras
  const text = ctaRef.current.textContent || '';
  const tokens = text.split(/(\s+)/);
  ctaRef.current.innerHTML = tokens
    .map((token) => {
      if (!token) return '';
      if (/^\s+$/.test(token)) return ' ';

      const lettersHtml = token
        .split('')
        .map((letter) => `<span data-letter style="display:inline-block;">${letter}</span>`)
        .join('');

      return `<span data-word style="display:inline-block; white-space:nowrap;">${lettersHtml}</span>`;
    })
    .join('');

  const letters = ctaRef.current.querySelectorAll('[data-letter]');
  gsap.from(letters, {
    opacity: 0,
    y: 50,
    rotateX: -90,
    duration: 0.8,
    stagger: 0.03,
    ease: 'back.out(1.7)',
  });
}, []);

  return (
    <>
      <ThankYouModal isOpen={showModal} onClose={() => setShowModal(false)} />
      
      {/* Sección de contacto */}
      <section className="w-full bg-[#202020]  md:px-12 lg:px-20 h-fit ">
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
            
            {/* Columna izquierda - Título y info */}
            <div className='flex flex-col items-center lg:items-start last:mx-auto px-4'>
              <h2 className="text-5xl sm:text-5xl md:text-7xl lg:text-7xl font-light mb-6 mt-10 md:mb-10 text-[#f4f4f4] font-thermal">
                {t('contact.forgetToCall')}<br />{t('contact.forgetToCallDescription')}
              </h2>
              
            
                <p className="text-sm md:text-base font-thermal font-light mb-8 text-white">{contactInfo.Descriptionfooter}</p>
                <button className="mt-4 px-6 py-4 bg-[#f4f4f4] text-black font-light hover:bg-[#d4ddd4] transition-colors flex justify-center items-center gap-2 underline-offset-4 decoration-black underline cursor-pointer">
                  LET'S START CHATTING
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </button>
              
            </div>

            {/* Columna derecha - Nueva sección de contacto con imágenes de fondo */}
            <div className="relative w-full max-w-4xl mx-auto sm:pt-20 px-8 min-h-[600px] flex items-center justify-center">
              
              {/* IMAGEN DETRÁS - IZQUIERDA (El Leopardo) - Solo desktop */}
              <div className="absolute -left-10 bottom-0 w-[500px] h-[450px] z-0 hidden lg:block">
                <Image 
                  src="/fotoizquierda.png" 
                  alt="Backgroundecor"
                  fill
                  className="object-cover shadow-xl"
                />
              </div>

              {/* IMAGEN DETRÁS - DERECHA/ARRIBA (Arquitectura) - Solo desktop */}
              <div className="absolute -right-10 top-10 w-96 h-[550px] z-0 hidden lg:block">
                <Image 
                  src="/fotoizquierda.png" 
                  alt="Backgroundecor"
                  fill
                  className="object-cover shadow-xl"
                />
              </div>

              {/* CUADRO ROJO (EL FORMULARIO) */}
              <div className="relative z-10 bg-[#D92C01] p-8 w-full max-w-[550px] shadow-2xl">
                {/* Desktop: Flex layout con "ready to start?" y "lets email" */}
                <div className="hidden lg:flex items-center justify-between mb-8">
                  <h2 
                    ref={ctaRef}
                    className="text-white text-4xl font-helvetica-neue font-bold"
                  >
                    Ready to start?
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-light">Let's email</span>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                </div>

                {/* Mobile/Tablet: Solo "Ready to start?" */}
                <h2 
                  ref={ctaRef}
                  className="lg:hidden text-white text-4xl font-helvetica-neue font-bold mb-8"
                >
                  Ready to start?  
                </h2>
                
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                 
                  
                  <div>
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full p-3 bg-[#E5E5E1] outline-none text-gray-800 ${fieldErrors.name ? 'border-2 border-white' : ''}`}
                    />
                    {fieldErrors.name && (
                      <div className="flex items-center gap-2 mt-2 text-white">
                        <ErrorOutlineIcon className="h-5 w-5" />
                        <p className="text-sm">{fieldErrors.name}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <select 
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className={`w-full p-3 pr-10 bg-[#E5E5E1] outline-none text-gray-800 appearance-none cursor-pointer hover:bg-[#D8D8D4] transition-colors ${fieldErrors.country ? 'border-2 border-white' : ''}`}
                      >
                        <option value="" disabled>Country</option>
                        <option value="United States">United States</option>
                        <option value="Spain">Spain</option>
                        <option value="Venezuela">Venezuela</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Argentina">Argentina</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {fieldErrors.country && (
                      <div className="flex items-center gap-2 mt-2 text-white">
                        <ErrorOutlineIcon className="h-5 w-5" />
                        <p className="text-sm">{fieldErrors.country}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <select 
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        required
                        className={`w-full p-3 pr-10 bg-[#E5E5E1] outline-none text-gray-800 appearance-none cursor-pointer hover:bg-[#D8D8D4] transition-colors ${fieldErrors.industry ? 'border-2 border-white' : ''}`}
                      >
                        <option value="" disabled>Industry</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Education">Education</option>
                        <option value="Retail">Retail</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {fieldErrors.industry && (
                      <div className="flex items-center gap-2 mt-2 text-white">
                        <ErrorOutlineIcon className="h-5 w-5" />
                        <p className="text-sm">{fieldErrors.industry}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <input 
                      type="email" 
                      name="email"
                      placeholder="E-mail" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full p-3 bg-[#E5E5E1] outline-none text-gray-800 ${fieldErrors.email ? 'border-2 border-white' : ''}`}
                    />
                    {fieldErrors.email && (
                      <div className="flex items-center gap-2 mt-2 text-white">
                        <ErrorOutlineIcon className="h-5 w-5" />
                        <p className="text-sm">{fieldErrors.email}</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex">
                      <select 
                        name="phoneCode"
                        value={formData.phoneCode}
                        onChange={handleInputChange}
                        className="p-3 bg-[#E5E5E1] w-24 outline-none text-gray-800 rounded-l border-gray-300 cursor-pointer"
                      >
                        <option>+1</option>
                        <option>+34</option>
                        <option>+58</option>
                        <option>+52</option>
                        <option>+57</option>
                        <option>+54</option>
                      </select>
                      <input 
                        type="tel" 
                        name="phoneNumber"
                        placeholder="Phone number" 
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        className={`w-full p-3 bg-[#E5E5E1] outline-none text-gray-800 rounded-r ${fieldErrors.phoneNumber ? 'border-2 border-white' : ''}`}
                      />
                    </div>
                    {fieldErrors.phoneNumber && (
                      <div className="flex items-center gap-2 mt-2 text-white">
                        <ErrorOutlineIcon className="h-5 w-5" />
                        <p className="text-sm">{fieldErrors.phoneNumber}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-start gap-3 py-4 text-white text-sm cur">
                      <input 
                        type="checkbox" 
                        name="privacyAccepted"
                        checked={formData.privacyAccepted}
                        onChange={handleInputChange}
                        required
                        className={` cursor-pointer border-2 bg-transparent dark:border-white-400/20 dark:scale-100 transition-all duration-500 ease-in-out dark:hover:scale-110 dark:checked:scale-100 w-5 h-5 accent-transparent ${fieldErrors.privacyAccepted ? 'border-white' : 'border-white'}`} 
                        id="privacy" 
                      />
                      <label htmlFor="privacy">
                        I accept and agree to Social Room Agency's <span className="underline cursor-pointer">Privacy Policy</span>.
                      </label>
                    </div>
                    {fieldErrors.privacyAccepted && (
                        <div className="flex items-center gap-2 text-white">
                          <ErrorOutlineIcon className="h-5 w-5" />
                          <p className="text-sm">{fieldErrors.privacyAccepted}</p>
                        </div>
                      )}
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#1A1A1A] text-white px-6 py-4 flex items-center gap-4 hover:bg-black transition-colors w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span className="underline-offset-4 decoration-white underline ">
                      {isSubmitting ? 'Sending...' : "LET'S START CREATING"}
                    </span> 
                    {!isSubmitting && <span className="text-xl font-helvetica">↗︎</span>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        
      </section>

      {/* Footer negro */}
      <footer className="w-full bg-black text-white py-12 md:py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          {/* Main footer content */}
          <div className="flex flex-col md:flex-row justify-center items-center mb-12 max-w-4xl mx-auto gap-6">
            
            {/* Left side - Logo and company info */}
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <div className="flex justify-center md:justify-start mb-4">
               <Image src="/socialroomblanco.svg" alt="Logo" width={250} height={250} className="-mt-12 translate-x-4" />
              </div>
              <div className="-mt-12 text-center sm:text-right">
                <p className="text-white/70 text-lg">Social Room</p>
                <p className="text-white/70 text-lg">Marketing Agency</p>
                <p className="text-white/70 text-lg">Valencia, Miami and LA</p>
              </div>
            </div>

            {/* Right side - Contact info */}
            <div className="md:ml-4">
              <h3 className="text-lg font-medium pb-6">Contact</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-start gap-2">
                  <MailOutlineIcon />
                  <a 
                    href={`mailto:${contactInfo.email}`}
                    className="text-white/70 hover:text-white transition-colors text-md md:order-1 underline"
                  >
                    {contactInfo.email}
                  </a>
                </div>
                <div className="flex items-center justify-start gap-2">
                 <PinDropOutlinedIcon />
                  <span className="text-white/70 text-md md:order-1">Valencia, Miami and LA</span>
                </div>
                <div className="flex items-center justify-start gap-2">
                  
                  <PhoneIphoneOutlinedIcon />
                  <a 
                    href={`tel:${contactInfo.phone}`}
                    className="text-white/70 hover:text-white transition-colors text-md md:order-1"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social media icons */}
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-lg text-white/50">
              © {contactInfo.year} {contactInfo.companyName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
