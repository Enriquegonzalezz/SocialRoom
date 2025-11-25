"use client";

import { useState } from 'react';
import { useTranslation } from '@/app/hooks/useTranslation';

// Variables configurables para información de contacto
const contactInfo = {
  companyName: 'Social Room',
  companySubtitle: 'Marketing Agency',
  location: 'Barcelona',
  year: '2025',
  
  // Sección About us
  aboutLinks: [
    { label: 'About us', url: '#' },
    { label: 'Services', url: '#' },
    { label: 'Contact', url: '#' },
  ],
  
  // Sección Team
  teamLinks: [
    { label: 'Team', url: '#' },
    { label: 'Careers', url: '#' },
  ],
  
  // Información de contacto
  email: 'socialroommarketingagency@gmail.com',
  phone: '+34 000 000 000',
  address: 'Barcelona, Spain',
  
  // Legal
  legalText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
};

export default function ContactFooterSection() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
    number: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Aquí puedes agregar la lógica de envío del formulario
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {/* Sección de contacto */}
      <section className="w-full bg-[#f3f3f3] py-12 md:py-20 px-6 md:px-12 lg:px-20 min-h-[70vh] flex items-center">
        <div className="max-w-[1600px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
            
            {/* Columna izquierda - Título y info */}
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light mb-8 md:mb-12 leading-tight font-serif text-black">
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
              <div className="bg-[#d4ddd4] p-8 md:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div className="border-b border-black/30 pb-2">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name:"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none text-base placeholder:text-black/70 font-serif"
                    />
                  </div>

                  {/* Mail */}
                  <div className="border-b border-black/30 pb-2">
                    <input
                      type="email"
                      name="email"
                      placeholder="Mail:"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none text-base placeholder:text-black/70 font-serif"
                    />
                  </div>

                  {/* Proyect */}
                  <div className="border-b border-black/30 pb-2">
                    <input
                      type="text"
                      name="project"
                      placeholder="Proyect:"
                      value={formData.project}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none text-base placeholder:text-black/70 font-serif"
                    />
                  </div>

                  {/* Number */}
                  <div className="border-b border-black/30 pb-2">
                    <input
                      type="tel"
                      name="number"
                      placeholder="Number:"
                      value={formData.number}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none text-base placeholder:text-black/70 font-serif"
                    />
                  </div>

                  {/* Botón Enter */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-8 py-2 border border-black/30 hover:bg-black/5 transition-colors duration-300 text-sm font-serif"
                    >
                      Enter
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
