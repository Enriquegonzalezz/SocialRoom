'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/hooks/useTranslation';
import Image from 'next/image';

export default function EquipmentLoginPage() {
  const router = useRouter();
  const { locale } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // Guardar token en localStorage
        localStorage.setItem('equipment-token', data.token);
        localStorage.setItem('equipment-user', email);
        // Redirigir al dashboard
        router.push(`/${locale}/equipment/dashboard`);
      } else {
        setError('Credenciales incorrectas. Por favor, intenta de nuevo.');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <button onClick={() => router.push(`/${locale}`)}>
            <Image
              src="/socialroomnegro.svg"
              alt="Social Room"
              width={150}
              height={50}
              className="mx-auto mb-4 cursor-pointer hover:opacity-70 transition-opacity"
            />
          </button>
          <h1 className="text-3xl font-bold text-black mb-2">Gestión de Equipos</h1>
          <p className="text-black/60">Acceso solo para personal autorizado</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/50 transition-all"
                placeholder="equipo@socialroom.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>

        {/* Volver */}
        <button
          onClick={() => router.push(`/${locale}`)}
          className="mt-6 text-black/60 hover:text-black transition-colors text-sm flex items-center gap-2 mx-auto"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" />
          </svg>
          Volver al inicio
        </button>
      </div>
    </main>
  );
}
