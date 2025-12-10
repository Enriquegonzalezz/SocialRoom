'use client';

import { useState, useEffect, useRef } from 'react';
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
  checked_out_by?: string | null;
  checked_out_at?: string | null;
}

interface ScannedItem {
  barcode: string;
  name: string;
  category: string;
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
  
  // Estados para escaneo múltiple
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [showNameModal, setShowNameModal] = useState(false);
  const [personName, setPersonName] = useState('');
  const [scanMessage, setScanMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('equipment-token');
    const user = localStorage.getItem('equipment-user');
    
    if (!token) {
      router.push(`/${locale}/equipment/login`);
      return;
    }

    const resolvedUser = user || 'Usuario';
    setUserName(resolvedUser);

    // Cargar datos iniciales
    fetchLogs();
    fetchItems();
  }, [locale, router]);

  // Focus en el input de nombre cuando se abre el modal
  useEffect(() => {
    if (showNameModal && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showNameModal]);

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

  // Manejar escaneo - agregar a la lista
  const handleScan = async (barcode: string) => {
    // Verificar si ya está en la lista
    if (scannedItems.some(item => item.barcode === barcode)) {
      setScanMessage({ type: 'info', text: 'Este equipo ya está en la lista' });
      return;
    }

    // Buscar el equipo en la lista de items
    const equipment = items.find(item => item.barcode === barcode);
    
    if (!equipment) {
      setScanMessage({ type: 'error', text: 'Equipo no encontrado' });
      return;
    }

    // Validar estado según acción
    if (action === 'checkout' && equipment.status === 'checked_out') {
      setScanMessage({ type: 'error', text: `"${equipment.name}" ya está retirado por ${equipment.checked_out_by || 'alguien'}` });
      return;
    }

    if (action === 'return' && equipment.status === 'available') {
      setScanMessage({ type: 'error', text: `"${equipment.name}" ya está disponible` });
      return;
    }

    // Agregar a la lista
    setScannedItems(prev => [...prev, {
      barcode: equipment.barcode,
      name: equipment.name,
      category: equipment.category
    }]);
    setScanMessage({ type: 'success', text: `✓ ${equipment.name} agregado a la lista` });
  };

  // Remover item de la lista
  const handleRemoveItem = (barcode: string) => {
    setScannedItems(prev => prev.filter(item => item.barcode !== barcode));
    setScanMessage(null);
  };

  // Mostrar modal para pedir nombre
  const handleShowNameModal = () => {
    if (scannedItems.length === 0) return;
    setScanMessage(null);
    setShowNameModal(true);
  };

  // Confirmar todos los equipos
  const handleConfirmAll = async () => {
    if (scannedItems.length === 0 || !personName.trim()) {
      setScanMessage({ type: 'error', text: 'Por favor ingresa un nombre' });
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/equipment/batch-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcodes: scannedItems.map(item => item.barcode),
          action,
          userName: personName.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        const actionText = action === 'checkout' ? 'retirado(s)' : 'devuelto(s)';
        setMessage(`✅ ${data.results.success.length} equipo(s) ${actionText} por ${personName.trim()}`);
        setScannedItems([]);
        setShowNameModal(false);
        setPersonName('');
        setScanMessage(null);
        fetchLogs();
        fetchItems();
      } else {
        setScanMessage({ type: 'error', text: data.message || 'Error al procesar' });
      }
    } catch (err) {
      console.error('Error al procesar:', err);
      setScanMessage({ type: 'error', text: 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  };

  // Cancelar y limpiar lista
  const handleClearList = () => {
    setScannedItems([]);
    setScanMessage(null);
    setShowNameModal(false);
    setPersonName('');
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
          <h2 className="text-2xl font-bold text-black mb-4">Escanear Equipos</h2>

          {/* Selector de Acción */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => { setAction('checkout'); handleClearList(); }}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                action === 'checkout'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
            >
              📤 Retirar
            </button>
            <button
              onClick={() => { setAction('return'); handleClearList(); }}
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
            onError={(error) => setScanMessage({ type: 'error', text: error })}
            isActive={!loading && !showNameModal}
          />

          {/* Mensaje de escaneo */}
          {scanMessage && (
            <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${
              scanMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
              scanMessage.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {scanMessage.text}
            </div>
          )}

          {/* Lista de equipos escaneados */}
          {scannedItems.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-black">
                  📋 Lista ({scannedItems.length} equipo{scannedItems.length > 1 ? 's' : ''})
                </h3>
                <button
                  onClick={handleClearList}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Limpiar lista
                </button>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
                {scannedItems.map((item, index) => (
                  <div 
                    key={item.barcode}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-black text-sm">{item.name}</p>
                        <p className="text-xs text-black/50">{item.category}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.barcode)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Botón ¿Eso es todo? */}
              <button
                onClick={handleShowNameModal}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${
                  action === 'checkout' 
                    ? 'bg-black hover:bg-black/80' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                ¿Eso es todo?
              </button>
            </div>
          )}

          {/* Mensaje de confirmación */}
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
                    <div className="font-mono text-sm text-black/60 mb-1">
                      {log.barcode}
                    </div>
                    {/* Mostrar nombre de quien hizo la acción */}
                    <div className="flex items-center gap-1 text-sm text-black/70 mt-2">
                      <span className="font-medium">👤 {log.user_name}</span>
                      <span className="text-black/40">•</span>
                      <span className="text-black/40">
                        {new Date(log.timestamp).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
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
                <div className="font-mono text-sm text-black/60 mb-2">{item.barcode}</div>
                
                {/* Mostrar quién tiene el equipo si está retirado */}
                {item.status === 'checked_out' && item.checked_out_by && (
                  <div className="mt-2 pt-2 border-t border-orange-200">
                    <div className="text-xs text-orange-700 font-medium">
                      👤 Retirado por: {item.checked_out_by}
                    </div>
                    {item.checked_out_at && (
                      <div className="text-xs text-orange-600 mt-1">
                        📅 {new Date(item.checked_out_at).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                  </div>
                )}
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

      {/* Modal para ingresar nombre */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-black mb-2">
              {action === 'checkout' ? '¿Quién retira los equipos?' : '¿Quién devuelve los equipos?'}
            </h3>
            
            <p className="text-sm text-black/60 mb-4">
              {scannedItems.length} equipo{scannedItems.length > 1 ? 's' : ''} seleccionado{scannedItems.length > 1 ? 's' : ''}:
            </p>

            {/* Lista resumida */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4 max-h-32 overflow-y-auto">
              {scannedItems.map((item, i) => (
                <div key={item.barcode} className="text-sm text-black/70">
                  {i + 1}. {item.name}
                </div>
              ))}
            </div>

            <label className="block text-sm font-medium text-black mb-2">
              Nombre de la persona
            </label>
            <input
              ref={nameInputRef}
              type="text"
              className="w-full border-2 border-black/10 rounded-lg px-4 py-3 text-lg mb-4 focus:outline-none focus:border-black"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && personName.trim()) {
                  handleConfirmAll();
                }
              }}
              placeholder="Escribe el nombre..."
              disabled={loading}
            />

            <div className="flex flex-col gap-2">
              <button
                type="button"
                className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${
                  action === 'checkout' 
                    ? 'bg-black hover:bg-black/80' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } disabled:opacity-60 disabled:cursor-not-allowed`}
                onClick={handleConfirmAll}
                disabled={loading || !personName.trim()}
              >
                {loading ? 'Procesando...' : `Confirmar ${action === 'checkout' ? 'retiro' : 'devolución'}`}
              </button>
              <button
                type="button"
                className="w-full py-3 rounded-xl font-medium text-black/70 bg-gray-100 hover:bg-gray-200 transition-colors"
                onClick={() => setShowNameModal(false)}
                disabled={loading}
              >
                ← Volver
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
