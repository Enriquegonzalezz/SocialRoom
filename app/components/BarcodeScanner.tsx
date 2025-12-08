'use client';

import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onError?: (error: string) => void;
  isActive?: boolean;
}

export default function BarcodeScanner({ onScan, onError, isActive = true }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (result: any) => {
    if (result && result[0]?.rawValue) {
      const barcode = result[0].rawValue;
      console.log('Código escaneado:', barcode);
      onScan(barcode);
      setIsScanning(false);
    }
  };

  const handleError = (error: any) => {
    console.error('Error en escáner:', error);
    onError?.('Error al escanear. Verifica los permisos de la cámara.');
  };

  return (
    <div className="barcode-scanner w-full flex flex-col items-center">
      {isScanning ? (
        <>
          <div className="w-full max-w-md rounded-lg overflow-hidden">
            <Scanner
              onScan={handleScan}
              onError={handleError}
              constraints={{
                facingMode: 'environment',
              }}
              formats={[
                'qr_code',
                'code_128',
                'code_39',
                'ean_13',
                'ean_8',
                'upc_a',
                'upc_e',
                'itf',
                'aztec',
                'data_matrix',
                'pdf417',
              ]}
              styles={{
                container: {
                  width: '100%',
                  maxWidth: '448px',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                },
                video: {
                  width: '100%',
                  height: 'auto',
                },
              }}
            />
          </div>

          <button
            onClick={() => setIsScanning(false)}
            className="w-full max-w-md bg-red-600 text-white py-4 rounded-lg font-medium hover:bg-red-700 transition-colors mt-4 flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="1"/>
            </svg>
            Detener Escáner
          </button>
          
          <div className="mt-4 text-center text-sm text-black/60">
            <p>Apunta la cámara al código de barras o QR</p>
          </div>
        </>
      ) : (
        <button
          onClick={() => setIsScanning(true)}
          disabled={!isActive}
          className="w-full max-w-md bg-black text-white py-4 rounded-lg font-medium hover:bg-black/80 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="3" x2="9" y2="21"/>
            <line x1="15" y1="3" x2="15" y2="21"/>
          </svg>
          Iniciar Escáner
        </button>
      )}
    </div>
  );
}

/* 
 * ============================================
 * CÓDIGO ANTERIOR CON html5-qrcode (COMENTADO)
 * ============================================
 * 
 * import { useEffect, useRef, useState } from 'react';
 * 
 * export default function BarcodeScannerOld({ onScan, onError, isActive = true }: BarcodeScannerProps) {
 *   const [isScanning, setIsScanning] = useState(false);
 *   const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
 *   const scannerRef = useRef<any>(null);
 *   const Html5QrcodeRef = useRef<any>(null);
 * 
 *   useEffect(() => {
 *     let mounted = true;
 * 
 *     import('html5-qrcode').then((module) => {
 *       if (mounted) {
 *         Html5QrcodeRef.current = module.Html5Qrcode;
 *         setIsLibraryLoaded(true);
 *       }
 *     }).catch((err) => {
 *       console.error('Error loading html5-qrcode:', err);
 *       onError?.('Error al cargar el escáner');
 *     });
 * 
 *     return () => {
 *       mounted = false;
 *       if (scannerRef.current) {
 *         try {
 *           scannerRef.current.stop().catch((e: any) => console.warn(e));
 *           scannerRef.current.clear().catch((e: any) => console.warn(e));
 *         } catch (e) {
 *           console.warn('Error cleaning up scanner', e);
 *         }
 *       }
 *     };
 *   }, []);
 * 
 *   const startScanning = async () => {
 *     if (!Html5QrcodeRef.current || !isActive || isScanning) return;
 *     setIsScanning(true);
 * 
 *     try {
 *       await new Promise(resolve => setTimeout(resolve, 100));
 *       const scanner = new Html5QrcodeRef.current('barcode-reader');
 *       scannerRef.current = scanner;
 * 
 *       const config = {
 *         fps: 10,
 *         qrbox: { width: 250, height: 250 },
 *         aspectRatio: 1.0,
 *         formatsToSupport: [0, 8, 13, 7, 2, 14, 5, 4, 1, 3, 6],
 *       };
 *       
 *       await scanner.start(
 *         { facingMode: "environment" }, 
 *         config,
 *         (decodedText: string) => {
 *           console.log('Código escaneado:', decodedText);
 *           onScan(decodedText);
 *           stopScanning();
 *         },
 *         (errorMessage: string) => {}
 *       );
 *     } catch (err: any) {
 *       console.error('Error starting scanner:', err);
 *       setIsScanning(false);
 *       onError?.(err.message || 'Error al iniciar el escáner.');
 *     }
 *   };
 * 
 *   const stopScanning = async () => {
 *     if (scannerRef.current) {
 *       try {
 *         await scannerRef.current.stop();
 *         scannerRef.current.clear();
 *         scannerRef.current = null;
 *       } catch (err) {
 *         console.warn('Error stopping scanner:', err);
 *       } finally {
 *         setIsScanning(false);
 *       }
 *     }
 *   };
 * }
 */