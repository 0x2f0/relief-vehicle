import React, { useEffect, useRef, useState, useCallback } from 'react';
import jsQR from 'jsqr';
import { Camera, Upload, Type, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
}

export function QRScannerComponent({ onScanSuccess }: QRScannerProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [manualInput, setManualInput] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  const stopCamera = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (activeTab !== 'camera') return;

    let cancelled = false;

    function scanFrame() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || cancelled) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
        if (code && mountedRef.current) {
          onScanSuccess(code.data);
          return;
        }
      }

      rafRef.current = requestAnimationFrame(scanFrame);
    }

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraError(null);
        scanFrame();
      } catch {
        if (!cancelled && mountedRef.current) {
          setCameraError(
            'Camera access unavailable or permission denied. Use Photo Upload or Manual ID below.'
          );
        }
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [activeTab, onScanSuccess, stopCamera]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      stopCamera();
    };
  }, [stopCamera]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });
      if (code) {
        onScanSuccess(code.data);
      } else {
        alert(
          'Could not detect a valid QR code in this image. Please try another photo or enter ID manually.'
        );
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      alert('Failed to load image.');
    };
    img.src = url;
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

      {/* Tab 1: Live Camera Scanner */}
      {activeTab === 'camera' && (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl bg-black aspect-square border border-slate-700 flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
            <canvas ref={canvasRef} className="hidden" />
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
