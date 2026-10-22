import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  FileSpreadsheet,
  Download,
  Eye,
  Sliders,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Settings,
  Filter,
  LogOut,
  Trash2,
} from 'lucide-react';
import { InstructorProfile, AprendizProfile } from '../types/induction';
import { getAccessToken } from '../services/googleAuth';

import {
  getStoredSyncedRecords,
  getPendingQueue,
  flushSyncQueue,
  getLastSyncTimestamp,
  subscribeToSyncStatus,
  SyncedApprenticeRecord,
} from '../services/autoSyncService';
import {
  getStoredSpreadsheetId,
  cleanDuplicateRowsInSpreadsheet,
} from '../services/googleSheetsService';



interface InstructorDashboardProps {
  instructorProfile: InstructorProfile;
  onUpdateInstructorProfile: (updated: InstructorProfile) => void;
  onOpenGoogleSheetsModal: () => void;
  onSwitchToAprendiz: () => void;
  onExitToLanding?: () => void;
  onInspectApprenticeCertificate: (record: SyncedApprenticeRecord) => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  instructorProfile,
  onUpdateInstructorProfile,
  onOpenGoogleSheetsModal,
  onSwitchToAprendiz,
  onExitToLanding,
  onInspectApprenticeCertificate,
}) => {
  const [records, setRecords] = useState<SyncedApprenticeRecord[]>(getStoredSyncedRecords());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'APROBADO' | 'EN PROCESO'>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFlushing, setIsFlushing] = useState(false);
  const [flushMessage, setFlushMessage] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<InstructorProfile>(instructorProfile);
  const [lastSync, setLastSync] = useState<string | null>(getLastSyncTimestamp());
  const [pendingCount, setPendingCount] = useState<number>(getPendingQueue().length);
  const [isCleaning, setIsCleaning] = useState(false);

  // Auto-subscribe to changes in synced records
  useEffect(() => {
    const unsub = subscribeToSyncStatus((status) => {
      setLastSync(status.lastSynced);
      setPendingCount(status.pendingCount);
      setRecords(getStoredSyncedRecords());
    });
    return () => unsub();
  }, []);

  const handleCleanDuplicates = async () => {
    if (!spreadsheetId) return;
    setIsCleaning(true);
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error('No hay sesión activa.');
      const result = await cleanDuplicateRowsInSpreadsheet(accessToken, spreadsheetId);
      alert(`Limpieza completada: Se eliminaron ${result.cleanedCount} filas duplicadas.`);
      setRecords(getStoredSyncedRecords());
    } catch (e: any) {
      alert('Error al limpiar duplicados: ' + e.message);
    } finally {
      setIsCleaning(false);
    }
  };

  const spreadsheetId = getStoredSpreadsheetId();
  const spreadsheetUrl = spreadsheetId
    ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
    : 'https://docs.google.com/spreadsheets';

  // Compute live apprentice induction URL
  const apprenticeShareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?rol=aprendiz`
    : 'https://plataforma-induccion-sena.edu.co/?rol=aprendiz';

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(apprenticeShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleFlushQueue = async () => {
    setIsFlushing(true);
    setFlushMessage(null);
    try {
      const count = await flushSyncQueue();
      setRecords(getStoredSyncedRecords());
      setFlushMessage(`Se sincronizaron con éxito ${count} registros pendientes en Google Drive.`);
      setTimeout(() => setFlushMessage(null), 4000);
    } catch (e: any) {
      setFlushMessage('Error al sincronizar con Google Drive: ' + e.message);
    } finally {
      setIsFlushing(false);
    }
  };

  const handleSaveProfileForm = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateInstructorProfile(profileForm);
    setIsEditingProfile(false);
  };

  // Export records to CSV
  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = [
      'Fecha',
      'Nombres y Apellidos',
      'Tipo Doc',
      'Numero Doc',
      'Ficha',
      'Nivel',
      'Programa',
      'Centro Formacion',
      'Regional',
      'Modalidad',
      'Estado',
      'Puntaje',
      'Codigo Certificado',
      'Fecha Aprobacion',
    ];

    const rows = records.map((r) => [
      `"${r.timestamp}"`,
      `"${r.fullName}"`,
      `"${r.docType}"`,
      `"${r.docNumber}"`,
      `"${r.ficha}"`,
      `"${r.nivelFormacion}"`,
      `"${r.programa}"`,
      `"${r.centroFormacion}"`,
      `"${r.regional}"`,
      `"${r.modalidad}"`,
      `"${r.estado}"`,
      `"${r.score}"`,
      `"${r.certificateCode}"`,
      `"${r.approvalDate}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SENA_Induccion_Aprendices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations for KPI Metrics
  const totalAprendices = records.length;
  const aprobadosCount = records.filter((r) => r.estado === 'APROBADO').length;
  const enProcesoCount = records.filter((r) => r.estado !== 'APROBADO').length;
  const promedioPuntaje = totalAprendices > 0
    ? Math.round(
        records.reduce((acc, curr) => acc + (parseInt(curr.score, 10) || 0), 0) / totalAprendices
      )
    : 0;

  // Filtered records
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.docNumber.includes(searchTerm) ||
      r.ficha.includes(searchTerm) ||
      r.programa.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || r.estado === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header / Instructor Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            <GraduationCap size={15} />
            <span>Portal Oficial del Instructor SENA · Acuerdo 0009 de 2024</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Panel de Gestión y Seguimiento de Inducción
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            Bienvenido, <strong className="text-emerald-700 dark:text-emerald-400">{instructorProfile.fullName}</strong> ({instructorProfile.cargo}).
            Monitorea el progreso de tus aprendices, administra la base de datos en Google Drive y comparte el acceso oficial a la inducción.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1 flex-wrap">
            <span><strong>Centro:</strong> {instructorProfile.centroFormacion}</span>
            <span>·</span>
            <span><strong>Regional:</strong> {instructorProfile.regional}</span>
            <span>·</span>
            <span><strong>Ficha:</strong> {instructorProfile.fichaPrincipal || 'General'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <button
            onClick={() => setIsEditingProfile(true)}
            className="cursor-pointer px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Settings size={15} />
            <span>Editar Datos Instructor</span>
          </button>

          <button
            onClick={onSwitchToAprendiz}
            className="cursor-pointer px-4 py-2 text-xs font-bold text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl transition-colors flex items-center gap-2 shadow-2xs"
          >
            <Eye size={15} className="text-emerald-700 dark:text-emerald-400" />
            <span>Ver Modo Aprendiz</span>
          </button>

          {onExitToLanding && (
            <button
              onClick={onExitToLanding}
              className="cursor-pointer px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
              title="Cerrar sesión de instructor y volver a la selección de roles"
            >
              <LogOut size={14} />
              <span>Salir al Portal</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Direct Share Link Card for Apprentices */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider bg-white/20 px-3 py-1 rounded-full text-emerald-100">
              <Sparkles size={14} /> Enlace para tus Aprendices
            </span>
            <h2 className="text-xl sm:text-2xl font-bold">
              Comparte este enlace para que tus aprendices realicen la inducción
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Los aprendices ingresan directamente con este link a la plataforma de inducción. No tendrán acceso a configuraciones de sincronización ni a privilegios de instructor. Cada vez que culminen la prueba o guarden su perfil, se registrarán automáticamente en tu hoja de Google Drive.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <div className="flex-1 bg-black/30 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono truncate select-all">
                {apprenticeShareUrl}
              </div>

              <button
                onClick={handleCopyShareLink}
                className="cursor-pointer px-5 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0"
              >
                {copiedLink ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shrink-0 text-xs space-y-2 self-stretch lg:self-auto min-w-[240px]">
            <div className="font-bold text-white text-sm">Privilegios separados:</div>
            <div className="flex items-center gap-2 text-emerald-100">
              <CheckCircle2 size={14} className="text-emerald-300 shrink-0" />
              <span>Aprendiz: Solo contenidos y examen</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-100">
              <CheckCircle2 size={14} className="text-emerald-300 shrink-0" />
              <span>Aprendiz: Sincronización transparente</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-100">
              <CheckCircle2 size={14} className="text-emerald-300 shrink-0" />
              <span>Instructor: Control exclusivo de Drive</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Aprendices</span>
            <Users size={18} className="text-emerald-700 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalAprendices}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Registrados en el sistema
          </p>
        </div>

        {/* Card 2: Aprobados */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Aprobados (&ge; 70%)</span>
            <Award size={18} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
            {aprobadosCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Certificados oficiales generados
          </p>
        </div>

        {/* Card 3: En Proceso */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">En Proceso</span>
            <Clock size={18} className="text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
            {enProcesoCount}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Pendientes por completar examen
          </p>
        </div>

        {/* Card 4: Promedio */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Promedio General</span>
            <CheckCircle2 size={18} className="text-cyan-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {promedioPuntaje}%
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Calificación media en evaluación
          </p>
        </div>
      </div>

      {/* 4. Google Drive Integration & Sync Action Hub (Exclusivo Instructor) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Hoja de Cálculo Central en Google Drive
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Conexión Activa
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {lastSync
                  ? `Último registro procesado a las ${lastSync}. Privilegio administrativo exclusivo del instructor.`
                  : 'Sincronización desatendida en segundo plano activa.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap self-end sm:self-auto">
            <a
              href={spreadsheetUrl}
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1.5"
            >
              <ExternalLink size={14} />
              <span>Abrir Hoja en Drive</span>
            </a>

            <button
              onClick={onOpenGoogleSheetsModal}
              className="cursor-pointer px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
            >
              <Sliders size={14} />
              <span>Configuración y Webhook</span>
            </button>

            <button
              onClick={handleFlushQueue}
              disabled={isFlushing}
              className="cursor-pointer px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
            >
              <RefreshCw size={13} className={isFlushing ? 'animate-spin' : ''} />
              <span>Sincronizar Pendientes ({pendingCount})</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="cursor-pointer px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5 border border-slate-200 dark:border-slate-800"
            >
              <Download size={14} />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={handleCleanDuplicates}
              disabled={isCleaning}
              className="cursor-pointer px-3.5 py-2 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5 border border-amber-200 dark:border-amber-800"
            >
              <Trash2 size={13} className={isCleaning ? 'animate-pulse' : ''} />
              <span>{isCleaning ? 'Limpiando...' : 'Limpiar Duplicados'}</span>
            </button>
          </div>
        </div>

        {flushMessage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{flushMessage}</span>
          </div>
        )}
      </div>

      {/* 5. Apprentices Tracking Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Lista de Aprendices y Calificaciones ({filteredRecords.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Registros capturados de la inducción al Reglamento del Aprendiz (Acuerdo 0009 de 2024 con act. 2026).
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
            <div className="relative flex-1 sm:w-64">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, cédula o ficha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-950 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setStatusFilter('APROBADO')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                  statusFilter === 'APROBADO'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Aprobados
              </button>
              <button
                onClick={() => setStatusFilter('EN PROCESO')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                  statusFilter === 'EN PROCESO'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold shadow-xs'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                En Proceso
              </button>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-950/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3 font-bold">Fecha / Hora</th>
                  <th className="p-3 font-bold">Aprendiz</th>
                  <th className="p-3 font-bold">Documento</th>
                  <th className="p-3 font-bold">Ficha</th>
                  <th className="p-3 font-bold">Programa</th>
                  <th className="p-3 font-bold">Estado</th>
                  <th className="p-3 font-bold">Calificación</th>
                  <th className="p-3 font-bold">Código Certificado</th>
                  <th className="p-3 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400">
                      No se encontraron aprendices con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors"
                    >
                      <td className="p-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                        {record.timestamp}
                      </td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {record.fullName}
                      </td>
                      <td className="p-3 font-mono whitespace-nowrap">
                        {record.docType} {record.docNumber}
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {record.ficha}
                      </td>
                      <td className="p-3 max-w-[200px] truncate" title={record.programa}>
                        {record.programa}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            record.estado === 'APROBADO'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              record.estado === 'APROBADO' ? 'bg-emerald-600' : 'bg-amber-500'
                            }`}
                          ></span>
                          {record.estado}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {record.score}
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono text-[11px]">
                        {record.certificateCode || '-'}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => onInspectApprenticeCertificate(record)}
                          title="Inspeccionar constancia de inducción"
                          className="cursor-pointer px-2.5 py-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800 inline-flex items-center gap-1"
                        >
                          <Eye size={12} />
                          <span>Ver</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. Edit Instructor Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 text-slate-900 dark:text-white animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Editar Datos del Instructor / Coordinador
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Estos datos identificarán tu centro de formación y tus reportes de inducción.
            </p>

            <form onSubmit={handleSaveProfileForm} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cargo o Rol
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.cargo}
                  onChange={(e) => setProfileForm({ ...profileForm, cargo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={profileForm.correo}
                  onChange={(e) => setProfileForm({ ...profileForm, correo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Centro de Formación
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.centroFormacion}
                  onChange={(e) => setProfileForm({ ...profileForm, centroFormacion: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Regional
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.regional}
                  onChange={(e) => setProfileForm({ ...profileForm, regional: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="cursor-pointer px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold transition-colors"
                >
                  Guardar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
