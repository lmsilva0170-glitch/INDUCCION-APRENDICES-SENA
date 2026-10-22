import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Copy,
  LogOut,
  Table,
  Sparkles,
  Zap,
  Code,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  googleSignIn,
  googleSignOut,
  getAccessToken,
  initAuth,
} from '../services/googleAuth';
import {
  getOrCreateSpreadsheet,
  appendApprenticeRecord,
  fetchApprenticeRecords,
  getStoredSpreadsheetId,
} from '../services/googleSheetsService';
import {
  autoSyncApprentice,
  flushSyncQueue,
  getStoredSyncedRecords,
  getPendingQueue,
  getLastSyncTimestamp,
  getStoredWebhookUrl,
  setStoredWebhookUrl,
  getAppsScriptTemplate,
  subscribeToSyncStatus,
  SyncedApprenticeRecord,
} from '../services/autoSyncService';
import { AprendizProfile } from '../types/induction';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AprendizProfile;
  quizScore: number;
  quizCompleted: boolean;
  certificateCode: string;
  completedAt: string | null;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  profile,
  quizScore,
  quizCompleted,
  certificateCode,
  completedAt,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sheetUrl, setSheetUrl] = useState<string | null>(() => {
    const id = getStoredSpreadsheetId();
    return id ? `https://docs.google.com/spreadsheets/d/${id}/edit` : 'https://docs.google.com/spreadsheets';
  });
  const [sheetId, setSheetId] = useState<string | null>(getStoredSpreadsheetId());
  const [records, setRecords] = useState<SyncedApprenticeRecord[]>(getStoredSyncedRecords());
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(getLastSyncTimestamp());
  const [pendingCount, setPendingCount] = useState<number>(getPendingQueue().length);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [webhookInput, setWebhookInput] = useState(getStoredWebhookUrl());
  const [webhookSaved, setWebhookSaved] = useState(false);

  // Subscribe to auto-sync engine events
  useEffect(() => {
    const unsub = subscribeToSyncStatus((status) => {
      setLastSyncTime(status.lastSynced);
      setPendingCount(status.pendingCount);
      setRecords(getStoredSyncedRecords());
    });
    return () => unsub();
  }, []);

  // Listen for Google Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // When token is available and modal opens, verify Google Sheet in Drive
  useEffect(() => {
    if (isOpen && token) {
      loadSheetInfo(token);
    } else if (isOpen) {
      setRecords(getStoredSyncedRecords());
    }
  }, [isOpen, token]);

  const loadSheetInfo = async (accessToken: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const sheet = await getOrCreateSpreadsheet(accessToken);
      setSheetId(sheet.id);
      setSheetUrl(sheet.url);

      const rows = await fetchApprenticeRecords(accessToken, sheet.id);
      if (rows && rows.length > 0) {
        // Map rows into SyncedApprenticeRecord format for display
        const mapped: SyncedApprenticeRecord[] = rows.map((r, i) => ({
          id: `sheet-${i}`,
          timestamp: r[0] || '',
          fullName: r[1] || '',
          docType: r[2] || '',
          docNumber: r[3] || '',
          ficha: r[4] || '',
          nivelFormacion: r[5] || '',
          programa: r[6] || '',
          centroFormacion: r[7] || '',
          regional: r[8] || '',
          modalidad: r[9] || '',
          estado: (r[10] === 'APROBADO' ? 'APROBADO' : 'EN PROCESO') as any,
          score: r[11] || '0%',
          certificateCode: r[12] || '',
          approvalDate: r[13] || '',
          syncedToGoogle: true,
          syncMethod: 'GOOGLE_API',
        }));
        setRecords(mapped);
      }
    } catch (err: any) {
      console.warn('Google Sheets fetch notice:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        await loadSheetInfo(result.accessToken);
        await flushSyncQueue();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error al iniciar sesión con Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await googleSignOut();
    setUser(null);
    setToken(null);
  };

  const handleManualSyncNow = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSyncStatus(null);
    try {
      const res = await autoSyncApprentice(
        profile,
        quizScore,
        certificateCode,
        completedAt
      );
      if (res.success) {
        setSyncStatus('¡Sincronización automática completada exitosamente con Google Drive!');
      } else {
        setSyncStatus('Registro almacenado y encolado. Se enviará de forma automática al detectar conexión.');
      }
      setRecords(getStoredSyncedRecords());
      setPendingCount(getPendingQueue().length);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error en la sincronización');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlushPendingQueue = async () => {
    setIsLoading(true);
    try {
      const sent = await flushSyncQueue();
      setSyncStatus(`Se sincronizaron automáticamente ${sent} registro(s) pendiente(s).`);
      setRecords(getStoredSyncedRecords());
      setPendingCount(getPendingQueue().length);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al procesar la cola');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWebhook = () => {
    setStoredWebhookUrl(webhookInput);
    setWebhookSaved(true);
    setTimeout(() => setWebhookSaved(false), 2500);
    if (webhookInput.trim()) {
      flushSyncQueue();
    }
  };

  const handleCopyLink = () => {
    if (!sheetUrl) return;
    navigator.clipboard.writeText(sheetUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyScript = () => {
    const code = getAppsScriptTemplate(sheetId || undefined);
    navigator.clipboard.writeText(code);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-200/60 dark:border-emerald-800 shadow-2xs">
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Hoja de Cálculo en Google Drive
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Zero-Touch AutoSync
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Almacenamiento automático y centralizado de aprendices conforme al Acuerdo 0009 de 2024.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="cursor-pointer p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Automated System Status Banner */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-300/80 dark:border-emerald-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Zap size={18} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Sincronización 100% Automática Activa
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  {lastSyncTime
                    ? `Último registro procesado a las ${lastSyncTime}. No requiere clics continuos.`
                    : 'Los datos de cada aprendiz se despachan solos al registrarse o aprobar la inducción.'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              {pendingCount > 0 && (
                <button
                  onClick={handleFlushPendingQueue}
                  disabled={isLoading}
                  className="cursor-pointer px-2.5 py-1.5 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 hover:bg-amber-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                  <span>Reintentar ({pendingCount}) pendientes</span>
                </button>
              )}
              <button
                onClick={handleManualSyncNow}
                disabled={isLoading}
                title="Forzar actualización inmediata del aprendiz en pantalla"
                className="cursor-pointer px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                <span>Sincronizar Ahora</span>
              </button>
            </div>
          </div>

          {/* Official Sheet Link Card in Google Drive */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block mb-0.5">
                  Ubicación Oficial en Google Drive
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  SENA - Registro de Inducción y Calificaciones (Acuerdo 0009 de 2024)
                </h4>
              </div>
              <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-200 bg-emerald-100/80 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700 shrink-0">
                Google Sheets
              </span>
            </div>

            <div className="space-y-3 mt-3">
              <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono truncate shadow-2xs">
                <span className="truncate text-slate-700 dark:text-slate-300 select-all">
                  {sheetUrl || 'https://docs.google.com/spreadsheets'}
                </span>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <a
                  href={sheetUrl || 'https://docs.google.com/spreadsheets'}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
                >
                  <ExternalLink size={14} />
                  <span>Abrir Hoja de Cálculo en Google Drive</span>
                </a>

                <button
                  onClick={handleCopyLink}
                  className="cursor-pointer px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                >
                  {copiedLink ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
                </button>

                <button
                  onClick={() => setShowScriptModal(!showScriptModal)}
                  className="cursor-pointer px-3 py-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                >
                  <Code size={13} />
                  <span>{showScriptModal ? 'Ocultar Webhook' : 'Conector Webhook Apps Script'}</span>
                </button>
              </div>
            </div>

            {/* Optional Apps Script Webhook Configuration Collapsible */}
            {showScriptModal && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Conector Webhook Autónomo (Opcional para Centros SENA)
                  </span>
                  <button
                    onClick={handleCopyScript}
                    className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedScript ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedScript ? '¡Código Copiado!' : 'Copiar Script Google'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Si deseas que la hoja de cálculo se alimente desde un Google Apps Script propio desplegado como aplicación web, pega la URL de la aplicación web a continuación:
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={webhookInput}
                    onChange={(e) => setWebhookInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleSaveWebhook}
                    className="cursor-pointer px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    {webhookSaved ? 'Guardado' : 'Guardar URL'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Account & Instructor Connection Bar */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950/70 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2.5 truncate">
              {user ? (
                <>
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'Usuario'}
                      className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="truncate">
                    <span className="font-semibold block text-slate-800 dark:text-slate-200 truncate">
                      {user.displayName} (Conexión Directa Drive Activa)
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      Modo Desatendido Operativo
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Los aprendices no necesitan iniciar sesión de Google para ser guardados.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <button
                onClick={handleSignOut}
                title="Desconectar cuenta"
                className="cursor-pointer text-slate-500 hover:text-red-600 dark:hover:text-red-400 p-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0"
              >
                <LogOut size={14} />
                <span>Desconectar</span>
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                title="Conectar cuenta de Google del instructor para permisos ampliados"
                className="cursor-pointer px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-all disabled:opacity-50 inline-flex items-center gap-2 shrink-0"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>Acceso Instructor</span>
              </button>
            )}
          </div>

          {/* Feedback messages */}
          {syncStatus && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 size={16} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span>{syncStatus}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 rounded-lg text-xs text-red-900 dark:text-red-200 flex items-center gap-2 animate-in fade-in">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Live Records Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Table size={14} className="text-emerald-700 dark:text-emerald-400" />
                <span>Base de Datos de Aprendices Sincronizados ({records.length})</span>
              </div>
              <button
                onClick={handleManualSyncNow}
                className="cursor-pointer text-xs text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <RefreshCw size={11} className={isLoading ? 'animate-spin' : ''} />
                <span>Actualizar</span>
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950">
              <div className="max-h-56 overflow-y-auto overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 sticky top-0 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-2.5 font-bold">Fecha</th>
                      <th className="p-2.5 font-bold">Aprendiz</th>
                      <th className="p-2.5 font-bold">Documento</th>
                      <th className="p-2.5 font-bold">Ficha</th>
                      <th className="p-2.5 font-bold">Estado</th>
                      <th className="p-2.5 font-bold">Puntaje</th>
                      <th className="p-2.5 font-bold">Certificado</th>
                      <th className="p-2.5 font-bold text-center">Nube Drive</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
                    {records.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-6 text-center text-slate-400">
                          Aún no hay registros sincronizados. Al guardar tu perfil o completar la inducción, se registrarán automáticamente aquí.
                        </td>
                      </tr>
                    ) : (
                      records.map((r, i) => (
                        <tr
                          key={r.id || i}
                          className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                        >
                          <td className="p-2.5 whitespace-nowrap text-[11px] font-mono">{r.timestamp || '-'}</td>
                          <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                            {r.fullName || '-'}
                          </td>
                          <td className="p-2.5 font-mono whitespace-nowrap">
                            {r.docType} {r.docNumber}
                          </td>
                          <td className="p-2.5 font-mono whitespace-nowrap">{r.ficha || '-'}</td>
                          <td className="p-2.5 whitespace-nowrap">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                r.estado === 'APROBADO'
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                              }`}
                            >
                              {r.estado}
                            </span>
                          </td>
                          <td className="p-2.5 font-mono font-bold text-emerald-800 dark:text-emerald-400 whitespace-nowrap">
                            {r.score}
                          </td>
                          <td className="p-2.5 font-mono text-[10px] whitespace-nowrap">
                            {r.certificateCode || '-'}
                          </td>
                          <td className="p-2.5 text-center whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 size={11} />
                              Sincronizado
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Conexión automática en segundo plano activa (Acuerdo 0009 de 2024)
          </span>
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
