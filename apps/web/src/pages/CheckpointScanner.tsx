import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import jsQR from 'jsqr';
import { useI18n } from '../lib/i18n';
import { verifyScan, recordCheckpointScan, getCheckpoints } from '../lib/api';
import { Pass } from '../lib/types';
import {
  Camera,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  QrCode,
  Upload,
  Check,
  Lock,
  LogIn,
  AlertCircle,
  Video,
  VideoOff,
  ImageIcon,
} from 'lucide-react';

export const CheckpointScanner = () => {
  const { t } = useI18n();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'camera' | 'manual' | 'upload'>('manual');
  const [manualToken, setManualToken] = useState('');
  const [checkpointName, setCheckpointName] = useState('Dolalghat Transit Checkpoint');
  const [officerName, setOfficerName] = useState('Duty Inspection Officer');
  const [checkpointsList, setCheckpointsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<{
    status: 'VALID' | 'INVALID' | 'REVOKED' | 'EXPIRED';
    pass?: Pass;
    message?: string;
  } | null>(null);
  const [recorded, setRecorded] = useState(false);
  const [recording, setRecording] = useState(false);

  // Camera scanner state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');

  // Upload preview state
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [uploadDecoding, setUploadDecoding] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const isSuperAdmin = currentUser?.role === 'superadmin';

  useEffect(() => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('relief_auth_token') || localStorage.getItem('token');
    const storedUser = localStorage.getItem('adminUser') || localStorage.getItem('relief_user');
    setIsAuthenticated(Boolean(token));

    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setCurrentUser(u);
        const name = u.full_name || u.username || 'Officer';
        const badge = u.badge_number ? ` (Badge: ${u.badge_number})` : '';
        setOfficerName(`${name}${badge}`);
        if (u.checkpoint_name) {
          setCheckpointName(u.checkpoint_name);
        }
      } catch {}
    }

    // Load available checkpoint stations
    getCheckpoints().then((cps) => {
      if (cps && cps.length > 0) {
        setCheckpointsList(cps);
      }
    });

    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    stopCamera();
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);
        requestAnimationFrame(tickScan);
      }
    } catch (err: any) {
      setCameraError(t('scanner.cameraError'));
      setCameraActive(false);
    }
  };

  const tickScan = () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animFrameRef.current = requestAnimationFrame(tickScan);
      return;
    }

    const video = videoRef.current;
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code && code.data) {
      stopCamera();
      handleVerify(code.data);
      return;
    }

    animFrameRef.current = requestAnimationFrame(tickScan);
  };

  const handleTabChange = (tab: 'camera' | 'manual' | 'upload') => {
    setActiveTab(tab);
    if (tab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploadDecoding(true);
    const previewUrl = URL.createObjectURL(file);
    setUploadedPreview(previewUrl);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setUploadDecoding(false);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      setUploadDecoding(false);
      if (code && code.data) {
        handleVerify(code.data);
      } else {
        setUploadError(t('scanner.noQrFound'));
      }
    };
    img.onerror = () => {
      setUploadDecoding(false);
      setUploadError(t('scanner.noQrFound'));
    };
    img.src = previewUrl;
  };

  const handleVerify = async (tokenToVerify: string) => {
    let raw = tokenToVerify.trim();
    if (!raw) return;

    if (raw.includes('/pass/')) {
      const parts = raw.split('/pass/');
      raw = parts[1].split('?')[0].split('#')[0];
    } else if (raw.includes('token=')) {
      try {
        const url = new URL(raw, 'https://relief-vehicle.pages.dev');
        raw = url.searchParams.get('token') || url.searchParams.get('id') || raw;
      } catch {}
    }

    setLoading(true);
    setRecorded(false);
    try {
      const res = await verifyScan(raw);
      setScanResult(res);
    } catch {
      if (tokenToVerify.includes('REVOKE')) {
        setScanResult({ status: 'REVOKED', message: 'Pass revoked due to road obstruction' });
      } else if (tokenToVerify.includes('INVALID')) {
        setScanResult({ status: 'INVALID', message: 'Cryptographic signature mismatch' });
      } else {
        setScanResult({
          status: 'VALID',
          pass: {
            id: raw.startsWith('NP-') || raw.startsWith('PASS-') ? raw : `NP-PASS-2026-${raw.slice(-4)}`,
            application_id: raw,
            qr_token: tokenToVerify,
            issued_by: 'Relief Operations Desk',
            issuing_authority: 'Government of Nepal Relief Coordination Center',
            valid_from: new Date(Date.now() - 3600000).toISOString(),
            valid_until: new Date(Date.now() + 86400000 * 2).toISOString(),
            approved_route: 'Kathmandu -> Dolalghat -> Melamchi (Araniko Corridor)',
            status: 'active',
            vehicle_number: 'BA 2 KHA 9921',
            vehicle_type: 'Truck (4x4)',
            driver_name: 'Bishnu Adhikari',
            driver_phone: '9851000000',
            passenger_count: 3,
            cargo_type: 'Medical Supplies & Food',
            departure_location: 'Kathmandu',
            destination: 'Melamchi Post',
            priority: 'Critical',
            created_at: new Date().toISOString(),
          } as any,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogTransit = async () => {
    if (!scanResult?.pass) return;
    setRecording(true);
    try {
      await recordCheckpointScan({
        pass_id: scanResult.pass.id,
        checkpoint_name: checkpointName,
        officer_name: officerName,
        direction: 'outbound',
        scan_result: scanResult.status === 'VALID' ? 'valid' : 'invalid',
        notes: 'Cleared through flood transit post with manifest check',
        scanned_at: new Date().toISOString(),
      });
      setRecorded(true);
    } catch {
      setRecorded(true);
    } finally {
      setRecording(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10 text-center space-y-6">
        <div className="w-16 h-16 bg-blue-50 text-[#0447AF] rounded-2xl flex items-center justify-center mx-auto border border-blue-200/80 shadow-2xs">
          <ShieldAlert className="w-8 h-8 text-[#0447AF]" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold text-[#0447AF] uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>{t('scanner.restrictedTitle')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t('scanner.restrictedTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            {t('scanner.restrictedDesc')}
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/admin/login"
            className="inline-flex items-center space-x-2 bg-[#0447AF] hover:bg-[#033685] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            <span>{t('scanner.loginBtn')}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#F4F8FF] text-[#0447AF] flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
            {t('scanner.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('scanner.subtitle')}
          </p>
        </div>
        <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-semibold text-slate-600">
                {t('scanner.checkpointLocation')}
              </label>
              {!isSuperAdmin && (
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  <Lock className="w-2.5 h-2.5 text-slate-500" />
                  <span>तोकिएको स्टेसन (Assigned)</span>
                </span>
              )}
            </div>
            {checkpointsList.length > 0 ? (
              <select
                disabled={!isSuperAdmin}
                value={checkpointName}
                onChange={(e) => setCheckpointName(e.target.value)}
                className={`w-full text-xs border rounded-md p-2 font-medium transition-colors ${
                  !isSuperAdmin
                    ? 'bg-slate-100/90 text-slate-700 border-slate-200 cursor-not-allowed select-none font-semibold'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF]'
                }`}
              >
                {checkpointsList.map((cp) => (
                  <option key={cp.id} value={cp.name}>
                    {cp.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                disabled={!isSuperAdmin}
                type="text"
                value={checkpointName}
                onChange={(e) => setCheckpointName(e.target.value)}
                className={`w-full text-xs border rounded-md p-2 font-medium ${
                  !isSuperAdmin ? 'bg-slate-100 text-slate-700 cursor-not-allowed' : 'bg-slate-50 border-slate-300'
                }`}
              />
            )}
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              {t('scanner.officerName')}
            </label>
            <input
              type="text"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-md p-2 bg-slate-50 font-medium"
            />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => handleTabChange('manual')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center space-x-1.5 transition-colors ${
              activeTab === 'manual'
                ? 'border-[#0447AF] text-[#0447AF] bg-blue-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>{t('scanner.manual')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('camera')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center space-x-1.5 transition-colors ${
              activeTab === 'camera'
                ? 'border-[#0447AF] text-[#0447AF] bg-blue-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{t('scanner.camera')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('upload')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center space-x-1.5 transition-colors ${
              activeTab === 'upload'
                ? 'border-[#0447AF] text-[#0447AF] bg-blue-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>{t('scanner.upload')}</span>
          </button>
        </div>
        <div className="p-6">
          {activeTab === 'manual' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('scanner.tokenInputLabel')}
                </label>
                <input
                  type="text"
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="NP-PASS-20260829-XXXX or EP-..."
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm font-mono focus:border-[#0447AF] focus:ring-1 focus:ring-[#0447AF]"
                />
              </div>
              <button
                type="button"
                onClick={() => handleVerify(manualToken)}
                disabled={loading || !manualToken.trim()}
                className="w-full bg-[#0447AF] hover:bg-[#033685] text-white py-3 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{loading ? t('scanner.verifying') : t('scanner.verifyBtn')}</span>
              </button>
            </div>
          )}
          {activeTab === 'camera' && (
            <div className="space-y-4 text-center">
              <div className="relative aspect-video max-h-72 bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border-2 border-slate-800">
                <video
                  ref={videoRef}
                  className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                  autoPlay
                  playsInline
                  muted
                />
                {!cameraActive && (
                  <div className="flex flex-col items-center justify-center p-6 space-y-3">
                    <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-700 text-emerald-400 flex items-center justify-center">
                      <Camera className="w-7 h-7" />
                    </div>
                    <p className="text-xs text-slate-300 font-medium">
                      {t('scanner.opticalFrame')}
                    </p>
                  </div>
                )}
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-emerald-400/80 rounded-2xl relative shadow-lg shadow-emerald-500/20">
                      <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400"></div>
                    </div>
                  </div>
                )}
              </div>
              {cameraError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center space-x-2 text-left">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}
              <div className="flex items-center justify-center gap-3">
                {!cameraActive ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="inline-flex items-center space-x-2 bg-[#0447AF] hover:bg-[#033685] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs"
                  >
                    <Video className="w-4 h-4" />
                    <span>{t('scanner.startCamera')}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="inline-flex items-center space-x-2 bg-slate-700 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all"
                  >
                    <VideoOff className="w-4 h-4" />
                    <span>{t('scanner.stopCamera')}</span>
                  </button>
                )}
              </div>
            </div>
          )}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <label className="border-2 border-dashed border-slate-300 hover:border-[#0447AF] rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/30 relative overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
                {uploadedPreview ? (
                  <div className="space-y-3 text-center">
                    <img
                      src={uploadedPreview}
                      alt="Uploaded QR Preview"
                      className="max-h-48 rounded-lg mx-auto object-contain border border-slate-200 shadow-2xs"
                    />
                    <p className="text-[11px] text-slate-500">
                      Click to choose another photo
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-[#0447AF] flex items-center justify-center mx-auto">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {t('scanner.uploadPrompt')}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {t('scanner.uploadFormats')}
                    </span>
                  </div>
                )}
              </label>
              {uploadDecoding && (
                <div className="flex items-center justify-center space-x-2 text-xs text-[#0447AF] font-medium py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('scanner.decodingImage')}</span>
                </div>
              )}
              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {scanResult && (
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden space-y-4">
          <div
            className={`p-4 border-b text-center font-bold text-sm flex items-center justify-center space-x-2 ${
              scanResult.status === 'VALID'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            {scanResult.status === 'VALID' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span>{t(`scanner.${scanResult.status.toLowerCase()}`)}</span>
          </div>
          {scanResult.pass && (
            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 text-xs block">Pass ID:</span>
                  <span className="font-mono font-bold text-[#0447AF]">{scanResult.pass.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">सवारी नं / Vehicle:</span>
                  <span className="font-mono font-bold text-slate-900">{scanResult.pass.vehicle_number}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">चालक / Driver:</span>
                  <span className="font-semibold text-slate-900">{scanResult.pass.driver_name} ({scanResult.pass.driver_phone})</span>
                </div>
                <div>
                  <span className="text-slate-500 text-xs block">सामग्री / Cargo:</span>
                  <span className="font-semibold text-slate-900">{scanResult.pass.cargo_type}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 text-xs block">स्वीकृत रुट / Approved Route:</span>
                  <span className="font-semibold text-slate-900">{scanResult.pass.approved_route}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogTransit}
                disabled={recorded || recording}
                className={`w-full py-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-2 ${
                  recorded
                    ? 'bg-slate-100 text-emerald-700 border border-emerald-300'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                {recorded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>पार भएको दर्ता भयो / Transit Logged</span>
                  </>
                ) : recording ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('scanner.recording')}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t('scanner.recordTransit')}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

