'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/app/hooks/useTranslation';
import BarcodeScanner from '@/app/components/BarcodeScanner';
import Image from 'next/image';

interface EquipmentLog {
  id: string;
  barcode: string;
  action: 'checkout' | 'return';
  timestamp: string;
  user_name: string;
  equipment_items?: {
    name: string;
    category: string;
  };
}

interface EquipmentItem {
  id: string;
  name: string;
  barcode: string;
  category: string;
  status: 'available' | 'checked_out';
}

export default function EquipmentDashboard() {
  const router = useRouter();
  const { locale } = useTranslation();
  const [action, setAction] = useState<'checkout' | 'return'>('checkout');
  const [logs, setLogs] = useState<EquipmentLog[]>([]);
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('equipment-token');
    const user = localStorage.getItem('equipment-user');
    
    if (!token) {
      router.push(`/${locale}/equipment/login`);
      return;
    }

    setUserName(user || 'Usuario');

    // Cargar datos iniciales
    fetchLogs();
    fetchItems();
  }, [locale, router]);

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/equipment/scan?limit=20');
      const data = await response.json();
      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/equipment/items');
      const data = await response.json();
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  const handleScan = async (barcode: string) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/equipment/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcode,
          action,
          userName
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ ${data.message}`);
        fetchLogs(); // Actualizar historial
        fetchItems(); // Actualizar lista de equipos
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage('❌ Error al registrar el escaneo');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('equipment-token');
    localStorage.removeItem('equipment-user');
    router.push(`/${locale}/equipment/login`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'camera':
        return '📷';
      case 'microphone':
        return '🎤';
      case 'tripod':
        return '📐';
      case 'lighting':
        return '💡';
      default:
        return '📦';
    }
  };

  const availableCount = items.filter(i => i.status === 'available').length;
  const checkedOutCount = items.filter(i => i.status === 'checked_out').length;

  return (
    <main className="min-h-screen bg-[#f3f3f3] px-6 py-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <Image
            src="/socialroomnegro.svg"
            alt="Social Room"
            width={120}
            height={40}
          />
          <button
            onClick={handleLogout}
            className="text-sm text-black/60 hover:text-black transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Cerrar Sesión
          </button>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-black">Gestión de Equipos</h1>
        <p className="text-black/60 mt-2">Bienvenido, {userName}</p>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="text-3xl font-bold text-black">{items.length}</div>
          <div className="text-sm text-black/60">Total Equipos</div>
        </div>
        <div className="bg-green-50 rounded-xl shadow p-6">
          <div className="text-3xl font-bold text-green-700">{availableCount}</div>
          <div className="text-sm text-green-700">Disponibles</div>
        </div>
        <div className="bg-orange-50 rounded-xl shadow p-6">
          <div className="text-3xl font-bold text-orange-700">{checkedOutCount}</div>
          <div className="text-sm text-orange-700">En Uso</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Escáner */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-black mb-4">Escanear Equipo</h2>

          {/* Selector de Acción */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setAction('checkout')}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                action === 'checkout'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
            >
              📤 Retirar
            </button>
            <button
              onClick={() => setAction('return')}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                action === 'return'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
            >
              📥 Devolver
            </button>
          </div>

          {/* Escáner */}
          <BarcodeScanner
            onScan={handleScan}
            onError={(error) => setMessage(`❌ ${error}`)}
            isActive={!loading}
          />

          {/* Mensaje */}
          {message && (
            <div className={`mt-4 p-4 rounded-lg text-center font-medium ${
              message.includes('✅') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}
        </div>

        {/* Historial */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-black">Historial Reciente</h2>
            <button
              onClick={fetchLogs}
              className="text-sm text-black/60 hover:text-black transition-colors"
            >
              🔄 Actualizar
            </button>
          </div>
          
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {logs.map((log) => (
              <div
                key={log.id}
                className="border border-black/10 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-bold text-black mb-1">
                      {log.equipment_items?.name || 'Equipo desconocido'}
                    </div>
                    <div className="font-mono text-sm text-black/60">
                      {log.barcode}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                    log.action === 'checkout'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {log.action === 'checkout' ? '📤 Retirado' : '📥 Devuelto'}
                  </span>
                </div>
                <div className="text-xs text-black/40">
                  {new Date(log.timestamp).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })} • {log.user_name}
                </div>
              </div>
            ))}

            {logs.length === 0 && (
              <div className="text-center text-black/40 py-12">
                <div className="text-4xl mb-2">📋</div>
                <p>No hay registros aún</p>
                <p className="text-sm mt-1">Escanea un equipo para comenzar</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Equipos */}
      <div className="max-w-6xl mx-auto mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-black mb-4">Inventario de Equipos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`border-2 rounded-lg p-4 transition-all ${
                  item.status === 'available'
                    ? 'border-green-200 bg-green-50'
                    : 'border-orange-200 bg-orange-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="text-2xl">{getCategoryIcon(item.category)}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'available'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-orange-200 text-orange-800'
                  }`}>
                    {item.status === 'available' ? 'Disponible' : 'En Uso'}
                  </span>
                </div>
                <div className="font-bold text-black mb-1">{item.name}</div>
                <div className="font-mono text-sm text-black/60">{item.barcode}</div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="col-span-full text-center text-black/40 py-12">
                <div className="text-4xl mb-2">📦</div>
                <p>No hay equipos registrados</p>
                <p className="text-sm mt-1">Configura tu base de datos en Supabase</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
