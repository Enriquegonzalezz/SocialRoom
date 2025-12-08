"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Lista de empleados con credenciales hardcodeadas
const EMPLOYEES = [
  // Admin
  { username: 'admin', password: 'admin2025', name: 'Administrador', role: 'admin' },
  
  // Co-Fundador
  { username: 'manuel', password: 'mp2025', name: 'Manuel (Co-Fundador)', role: 'coFounder' },
  
  // Community Managers
  { username: 'jeli', password: 'jeli2025', name: 'Jeli', role: 'communityManager' },
  { username: 'mavi', password: 'mavi2025', name: 'Mavi', role: 'communityManager' },
  
  // Project Coordinators
  { username: 'dubraska', password: 'dub2025', name: 'Dubraska', role: 'projectCoordinator' },
  { username: 'ellie', password: 'ellie2025', name: 'Ellie', role: 'projectCoordinator' },
  
  // Designers
  { username: 'angela', password: 'ang2025', name: 'Angela', role: 'designer' },
  { username: 'manuel', password: 'manuel2025', name: 'Manuel', role: 'designer' },
  { username: 'julia', password: 'julia2025', name: 'Julia', role: 'designer' },
  { username: 'carlitos', password: 'carl2025', name: 'Carlitos', role: 'designer' },
  { username: 'maria', password: 'maria2025', name: 'Maria', role: 'designer' },
  
  // Photographers
  { username: 'victor', password: 'vic2025', name: 'Victor', role: 'photographer' },
  { username: 'fabian', password: 'fab2025', name: 'Fabian', role: 'photographer' },
  
  // Full Stack Developer
  { username: 'enrique', password: 'enri2025', name: 'Enrique', role: 'fullstackDeveloper' },
  
  // Video Editor
  { username: 'luisfelipe', password: 'luis2025', name: 'Luis Felipe', role: 'videoEditor' },
];

export default function EquipmentLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular delay de autenticación
    setTimeout(() => {
      const user = EMPLOYEES.find(
        (emp) => emp.username.toLowerCase() === username.toLowerCase() && emp.password === password
      );

      if (user) {
        // Guardar sesión en localStorage
        localStorage.setItem('employee_session', JSON.stringify({
          username: user.username,
          name: user.name,
          role: user.role,
          loginTime: new Date().toISOString(),
        }));
        
        // Redirigir al dashboard
        router.push('/equipment/dashboard');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image 
            src="/socialroomblanco.svg" 
            alt="Social Room" 
            width={200} 
            height={60}
            className="invert"
          />
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-black mb-2">
            Portal de Empleados
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Ingresa tus credenciales para acceder
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#233a28] focus:border-transparent outline-none transition-all text-black"
                placeholder="Tu nombre de usuario"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#233a28] focus:border-transparent outline-none transition-all text-black"
                placeholder="Tu contraseña"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#233a28] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1a2d1f] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          © 2025 Social Room. Acceso exclusivo para empleados.
        </p>
      </div>
    </div>
  );
}
