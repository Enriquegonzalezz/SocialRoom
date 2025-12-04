"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface EmployeeSession {
  username: string;
  name: string;
  role: string;
  loginTime: string;
}

// Mapeo de roles a nombres legibles
const roleNames: Record<string, string> = {
  admin: 'Administrador',
  coFounder: 'Co-Fundador',
  communityManager: 'Community Manager',
  projectCoordinator: 'Coordinador/a de Proyectos',
  designer: 'Diseñador/a',
  photographer: 'Fotógrafo',
  fullstackDeveloper: 'Desarrollador Full Stack',
  videoEditor: 'Editor de Video',
};

export default function EquipmentDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<EmployeeSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión
    const storedSession = localStorage.getItem('employee_session');
    
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        setSession(parsedSession);
      } catch {
        // Sesión inválida, redirigir a login
        router.push('/equipment/login');
      }
    } else {
      // No hay sesión, redirigir a login
      router.push('/equipment/login');
    }
    
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('employee_session');
    router.push('/equipment/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#233a28]"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Image 
            src="/socialroomblanco.svg" 
            alt="Social Room" 
            width={150} 
            height={45}
            className="invert"
          />
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-black">{session.name}</p>
              <p className="text-xs text-gray-500">{roleNames[session.role] || session.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors cursor-pointer"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
            ¡Bienvenido/a, {session.name}! 👋
          </h1>
          <p className="text-gray-600">
            Has iniciado sesión como <span className="font-medium text-[#233a28]">{roleNames[session.role] || session.role}</span>
          </p>
        </div>

        {/* Quick Actions Grid */}
        <h2 className="text-xl font-bold text-black mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 - Recursos */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#233a28]/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#233a28]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Recursos</h3>
            <p className="text-gray-500 text-sm">Accede a los recursos y materiales del equipo.</p>
          </div>

          {/* Card 2 - Calendario */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#233a28]/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#233a28]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Calendario</h3>
            <p className="text-gray-500 text-sm">Revisa los eventos y reuniones programadas.</p>
          </div>

          {/* Card 3 - Proyectos */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-[#233a28]/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[#233a28]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Proyectos</h3>
            <p className="text-gray-500 text-sm">Gestiona y visualiza los proyectos activos.</p>
          </div>
        </div>

        {/* Session Info */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4 text-sm text-gray-500">
          <p>Sesión iniciada: {new Date(session.loginTime).toLocaleString('es-ES')}</p>
        </div>
      </main>
    </div>
  );
}
