import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Upload, Type, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
}

export function QRScannerComponent({ onScanSuccess }: QRScannerProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [manualInput, setManualInput] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (activeTab === 'camera') {
      const elementId = 'reader-container';
      const html5QrCode = new Html5Qrcode(elementId);
      scannerRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      html5QrCode
        .start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            if (isMounted) {
              onScanSuccess(decodedText);
            }
          },
          () => {
            // Frame error - ignore
          }
        )
        .then(() => {
          if (isMounted) {
            setIsScanning(true);
            setCameraError(null);
          }
        })
        .catch((err) => {
          if (isMounted) {
            console.warn('Camera start error:', err);
            setCameraError('Camera access unavailable or permission denied. Use Photo Upload or Manual ID below.');
            setIsScanning(false);
          }
        });
    }

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().then(() => {
            try {
              scannerRef.current?.clear();
            } catch {}
          }).catch(() => {});
        } else {
          try {
            scannerRef.current.clear();
          } catch {}
        }
      }
    };
  }, [activeTab, onScanSuccess]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode('file-scanner-hidden');
      const decodedText = await html5QrCode.scanFile(file, true);
      onScanSuccess(decodedText);
    } catch (err) {
      alert('Could not detect a valid QR code in this image. Please try another photo or enter ID manually.');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScanSuccess(manualInput.trim());
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl max-w-lg mx-auto">
      {/* Scanner Mode Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-xl mb-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('camera')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
            activeTab === 'camera' ? 'bg-red-700 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Camera className="w-3.5 h-3.5" /> Camera
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
            activeTab === 'upload' ? 'bg-red-700 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" /> Upload File
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
            activeTab === 'manual' ? 'bg-red-700 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Type className="w-3.5 h-3.5" /> Manual ID
        </button>
      </div>

      {/* Hidden file scanner container */}
      <div id="file-scanner-hidden" className="hidden"></div>

      {/* Tab 1: Live Camera Scanner */}
      {activeTab === 'camera' && (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl bg-black aspect-square border border-slate-700 flex items-center justify-center">
            <div id="reader-container" className="w-full h-full"></div>
            {cameraError && (
              <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-10 h-10 text-amber-400 mb-2" />
                <p className="text-xs text-slate-300 mb-3">{cameraError}</p>
                <button
                  onClick={() => setActiveTab('manual')}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-lg border border-slate-700"
                >
                  Switch to Manual ID Input
                </button>
              </div>
            )}
          </div>
          <p className="text-[11px] text-center text-slate-400">
            Point camera at the QR code on the driver&apos;s digital E-Pass or printed document.
          </p>
        </div>
      )}

      {/* Tab 2: Image File Upload */}
      {activeTab === 'upload' && (
        <div className="space-y-4 py-4 text-center">
          <div className="border-2 border-dashed border-slate-700 hover:border-red-500 rounded-xl p-8 transition-colors">
            <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-300 mb-1">Select or drop pass photo / screenshot</p>
            <p className="text-[11px] text-slate-500 mb-4">Supports PNG, JPG, WEBP formats</p>
            <label className="inline-block bg-red-700 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors">
              Browse Image File
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {/* Tab 3: Manual Input */}
      {activeTab === 'manual' && (
        <form onSubmit={handleManualSubmit} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Enter Pass Number or Scanned Token String
            </label>
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="e.g. NP-PASS-20260829-XXXX"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-2.5 rounded-lg text-xs transition-colors shadow-md"
          >
            Verify Pass
          </button>
        </form>
      )}
    </div>
  );
}
