"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface EmployeeSession {
  username: string;
  name: string;
  role: string;
  loginTime: string;
}

interface ScannedItem {
  barcode: string;
  name: string;
  category: string;
  status: string;
}

type ScanMode = 'checkout' | 'return';

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
  
  // Estados para el escáner
  const [showScanner, setShowScanner] = useState(false);
  const [scanMode, setScanMode] = useState<ScanMode>('checkout');
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [scanMessage, setScanMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [personName, setPersonName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

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

  // Focus en el input cuando se abre el escáner
  useEffect(() => {
    if (showScanner && inputRef.current && !showNameInput) {
      inputRef.current.focus();
    }
  }, [showScanner, showNameInput]);

  // Focus en el input de nombre cuando se muestra
  useEffect(() => {
    if (showNameInput && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showNameInput]);

  const handleLogout = () => {
    localStorage.removeItem('employee_session');
    router.push('/equipment/login');
  };

  // Escanear un código de barras individual
  const handleScanBarcode = async (barcode: string) => {
    if (!barcode.trim()) return;
    
    // Verificar si ya está en la lista
    if (scannedItems.some(item => item.barcode === barcode)) {
      setScanMessage({ type: 'info', text: 'Este equipo ya está en la lista' });
      setBarcodeInput('');
      return;
    }

    setIsProcessing(true);
    setScanMessage(null);

    try {
      // Verificar el equipo en la base de datos
      const response = await fetch(`/api/equipment/items`);
      const data = await response.json();
      
      if (data.success) {
        const equipment = data.items.find((item: any) => item.barcode === barcode);
        
        if (!equipment) {
          setScanMessage({ type: 'error', text: 'Equipo no encontrado' });
        } else if (scanMode === 'checkout' && equipment.status === 'checked_out') {
          setScanMessage({ type: 'error', text: `"${equipment.name}" ya está retirado por ${equipment.checked_out_by || 'alguien'}` });
        } else if (scanMode === 'return' && equipment.status === 'available') {
          setScanMessage({ type: 'error', text: `"${equipment.name}" ya está disponible` });
        } else {
          // Agregar a la lista
          setScannedItems(prev => [...prev, {
            barcode: equipment.barcode,
            name: equipment.name,
            category: equipment.category,
            status: equipment.status
          }]);
          setScanMessage({ type: 'success', text: `✓ ${equipment.name} agregado` });
        }
      }
    } catch (error) {
      setScanMessage({ type: 'error', text: 'Error al verificar el equipo' });
    }

    setBarcodeInput('');
    setIsProcessing(false);
    inputRef.current?.focus();
  };

  // Remover item de la lista
  const handleRemoveItem = (barcode: string) => {
    setScannedItems(prev => prev.filter(item => item.barcode !== barcode));
  };

  // Mostrar input de nombre al hacer clic en "¿Eso es todo?"
  const handleShowNameInput = () => {
    if (scannedItems.length === 0) return;
    setShowNameInput(true);
    setScanMessage(null);
  };

  // Confirmar todos los equipos con el nombre ingresado
  const handleConfirmAll = async () => {
    if (scannedItems.length === 0 || !personName.trim()) {
      setScanMessage({ type: 'error', text: 'Por favor ingresa un nombre' });
      return;
    }
    
    setIsConfirming(true);
    setScanMessage(null);

    try {
      const response = await fetch('/api/equipment/batch-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barcodes: scannedItems.map(item => item.barcode),
          action: scanMode,
          userName: personName.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        const actionText = scanMode === 'checkout' ? 'retirado(s)' : 'devuelto(s)';
        setScanMessage({ 
          type: 'success', 
          text: `✓ ${data.results.success.length} equipo(s) ${actionText} por ${personName.trim()}` 
        });
        setScannedItems([]);
        setShowNameInput(false);
        setPersonName('');
        
        // Cerrar el escáner después de 2 segundos
        setTimeout(() => {
          setShowScanner(false);
          setScanMessage(null);
        }, 2500);
      } else {
        setScanMessage({ type: 'error', text: data.message || 'Error al procesar' });
      }
    } catch (error) {
      setScanMessage({ type: 'error', text: 'Error de conexión' });
    }

    setIsConfirming(false);
  };

  // Volver atrás desde el input de nombre
  const handleBackFromName = () => {
    setShowNameInput(false);
    setPersonName('');
  };

  // Cancelar y limpiar
  const handleCancelScan = () => {
    setScannedItems([]);
    setScanMessage(null);
    setShowScanner(false);
    setShowNameInput(false);
    setPersonName('');
  };

  // Abrir escáner con modo específico
  const openScanner = (mode: ScanMode) => {
    setScanMode(mode);
    setScannedItems([]);
    setScanMessage(null);
    setShowScanner(true);
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
        <h2 className="text-xl font-bold text-black mb-4">Gestión de Equipos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Card 1 - Retirar Equipos */}
          <button
            onClick={() => openScanner('checkout')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all hover:scale-[1.02] text-left cursor-pointer border-2 border-transparent hover:border-[#233a28]"
          >
            <div className="w-12 h-12 bg-[#233a28] rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Retirar Equipos</h3>
            <p className="text-gray-500 text-sm">Escanea los equipos que vas a llevar.</p>
          </button>

          {/* Card 2 - Devolver Equipos */}
          <button
            onClick={() => openScanner('return')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all hover:scale-[1.02] text-left cursor-pointer border-2 border-transparent hover:border-blue-500"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Devolver Equipos</h3>
            <p className="text-gray-500 text-sm">Escanea los equipos que estás devolviendo.</p>
          </button>
        </div>

        {/* Session Info */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4 text-sm text-gray-500">
          <p>Sesión iniciada: {new Date(session.loginTime).toLocaleString('es-ES')}</p>
        </div>
      </main>

      {/* Modal de Escáner */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header del modal */}
            <div className={`p-6 ${scanMode === 'checkout' ? 'bg-[#233a28]' : 'bg-blue-500'} text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {scanMode === 'checkout' ? 'Retirar Equipos' : 'Devolver Equipos'}
                  </h2>
                  <p className="text-white/80 text-sm mt-1">
                    Escanea los códigos QR de los equipos
                  </p>
                </div>
                <button
                  onClick={handleCancelScan}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Input de escaneo */}
            <div className="p-4 border-b">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleScanBarcode(barcodeInput);
                    }
                  }}
                  placeholder="Escanea o escribe el código..."
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-[#233a28] focus:outline-none text-lg"
                  disabled={isProcessing}
                />
                {isProcessing && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#233a28] border-t-transparent"></div>
                  </div>
                )}
              </div>
              
              {/* Mensaje de estado */}
              {scanMessage && (
                <div className={`mt-3 p-3 rounded-lg text-sm font-medium ${
                  scanMessage.type === 'success' ? 'bg-green-100 text-green-700' :
                  scanMessage.type === 'error' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {scanMessage.text}
                </div>
              )}
            </div>

            {/* Lista de equipos escaneados */}
            <div className="flex-1 overflow-y-auto p-4">
              {scannedItems.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <p>Escanea equipos para agregarlos a la lista</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 mb-3">
                    {scannedItems.length} equipo(s) en la lista:
                  </p>
                  {scannedItems.map((item, index) => (
                    <div 
                      key={item.barcode}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-[#233a28] text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-black text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.category}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.barcode)}
                        className="w-8 h-8 rounded-full hover:bg-red-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer con botón de confirmar */}
            <div className="p-4 border-t bg-gray-50">
              {!showNameInput ? (
                // Paso 1: Botón "¿Eso es todo?"
                <>
                  {scannedItems.length > 0 && (
                    <button
                      onClick={handleShowNameInput}
                      className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${
                        scanMode === 'checkout' 
                          ? 'bg-[#233a28] hover:bg-[#1a2d1f]' 
                          : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                    >
                      ¿Eso es todo?
                    </button>
                  )}
                  
                  <button
                    onClick={handleCancelScan}
                    className="w-full mt-2 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                // Paso 2: Input de nombre
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {scanMode === 'checkout' ? '¿Quién retira los equipos?' : '¿Quién devuelve los equipos?'}
                    </label>
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={personName}
                      onChange={(e) => setPersonName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && personName.trim()) {
                          handleConfirmAll();
                        }
                      }}
                      placeholder="Escribe el nombre..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#233a28] focus:outline-none text-lg"
                      disabled={isConfirming}
                    />
                  </div>

                  {/* Mensaje de estado */}
                  {scanMessage && (
                    <div className={`p-3 rounded-lg text-sm font-medium ${
                      scanMessage.type === 'success' ? 'bg-green-100 text-green-700' :
                      scanMessage.type === 'error' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {scanMessage.text}
                    </div>
                  )}

                  <button
                    onClick={handleConfirmAll}
                    disabled={isConfirming || !personName.trim()}
                    className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${
                      scanMode === 'checkout' 
                        ? 'bg-[#233a28] hover:bg-[#1a2d1f]' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    } ${(isConfirming || !personName.trim()) ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isConfirming ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Procesando...
                      </span>
                    ) : (
                      <>
                        {scanMode === 'checkout' 
                          ? `Confirmar retiro por ${personName.trim() || '...'}`
                          : `Confirmar devolución por ${personName.trim() || '...'}`
                        }
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleBackFromName}
                    disabled={isConfirming}
                    className="w-full py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    ← Volver a escanear
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
