import React, { useState, useEffect } from 'react';
import { SenaLogo } from './SenaLogo';
import { AprendizProfile, InstructorProfile } from '../types/induction';
import {
  GraduationCap,
  Shield,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  BookOpen,
  FileSpreadsheet,
  Building,
  MapPin,
  FileText,
  Hash,
  RotateCcw,
} from 'lucide-react';

interface RoleSelectionLandingProps {
  initialRole?: 'aprendiz' | 'instructor';
  currentApprenticeProfile: AprendizProfile;
  currentInstructorProfile: InstructorProfile;
  onEnterAsAprendiz: (profile: AprendizProfile) => void;
  onEnterAsInstructor: (profile: InstructorProfile) => void;
  onResetApprenticeData?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const REGIONAL_LIST = [
  'Regional Distrito Capital',
  'Regional Antioquia',
  'Regional Valle',
  'Regional Santander',
  'Regional Atlántico',
  'Regional Cundinamarca',
  'Regional Caldas',
  'Regional Risaralda',
  'Regional Bolívar',
  'Regional Boyacá',
  'Regional Huila',
  'Regional Nariño',
  'Regional Tolima',
  'Regional Norte de Santander',
  'Regional Meta',
  'Regional Cesar',
  'Regional Córdoba',
  'Regional Quindío',
  'Regional Cauca',
  'Regional Magdalena',
  'Otra Regional SENA',
];

const POPULAR_PROGRAMS = [
  'Análisis y Desarrollo de Software (ADSO)',
  'Gestión de Redes de Datos',
  'Contabilización de Operaciones Comerciales y Financieras',
  'Gestión del Talento Humano',
  'Gestión Empresarial',
  'Mantenimiento de Equipo de Cómputo',
  'Producción de Multimedia',
  'Mecatrónica Industrial',
  'Desarrollo Gráfico de Proyectos de Construcción',
  'Otro programa de formación',
];

export const RoleSelectionLanding: React.FC<RoleSelectionLandingProps> = ({
  initialRole = 'aprendiz',
  currentApprenticeProfile,
  currentInstructorProfile,
  onEnterAsAprendiz,
  onEnterAsInstructor,
  onResetApprenticeData,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [selectedRole, setSelectedRole] = useState<'aprendiz' | 'instructor'>(initialRole);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Aprendiz characterization form state - starts clean for each registration
  const [aprendizData, setAprendizData] = useState<AprendizProfile>({
    fullName: currentApprenticeProfile.fullName || '',
    docType: currentApprenticeProfile.docType || 'CC',
    docNumber: currentApprenticeProfile.docNumber || '',
    ficha: currentApprenticeProfile.ficha || '',
    programa: currentApprenticeProfile.programa || '',
    nivelFormacion: currentApprenticeProfile.nivelFormacion || 'Tecnólogo',
    centroFormacion: currentApprenticeProfile.centroFormacion || '',
    regional: currentApprenticeProfile.regional || 'Regional Distrito Capital',
    modalidad: currentApprenticeProfile.modalidad || 'Presencial',
  });

  const [aprendizFormErrors, setAprendizFormErrors] = useState<string | null>(null);

  // Synchronize when currentApprenticeProfile changes (e.g. after exiting or clearing)
  useEffect(() => {
    setAprendizData({
      fullName: currentApprenticeProfile.fullName || '',
      docType: currentApprenticeProfile.docType || 'CC',
      docNumber: currentApprenticeProfile.docNumber || '',
      ficha: currentApprenticeProfile.ficha || '',
      programa: currentApprenticeProfile.programa || '',
      nivelFormacion: currentApprenticeProfile.nivelFormacion || 'Tecnólogo',
      centroFormacion: currentApprenticeProfile.centroFormacion || '',
      regional: currentApprenticeProfile.regional || 'Regional Distrito Capital',
      modalidad: currentApprenticeProfile.modalidad || 'Presencial',
    });
    setAprendizFormErrors(null);
  }, [currentApprenticeProfile]);

  // Clean form completely so each apprentice registration is independent
  const handleResetAprendizForm = () => {
    setAprendizData({
      fullName: '',
      docType: 'CC',
      docNumber: '',
      ficha: '',
      programa: '',
      nivelFormacion: 'Tecnólogo',
      centroFormacion: '',
      regional: 'Regional Distrito Capital',
      modalidad: 'Presencial',
    });
    setAprendizFormErrors(null);
    if (onResetApprenticeData) {
      onResetApprenticeData();
    }
  };

  // Instructor login form state
  const [instructorPassword, setInstructorPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [instructorData, setInstructorData] = useState<InstructorProfile>(currentInstructorProfile);

  // Apprentice submission
  const handleAprendizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aprendizData.fullName.trim()) {
      setAprendizFormErrors('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!aprendizData.docNumber.trim()) {
      setAprendizFormErrors('Por favor ingresa tu número de documento.');
      return;
    }
    if (!aprendizData.ficha.trim()) {
      setAprendizFormErrors('Por favor ingresa el número de ficha de tu programa.');
      return;
    }
    if (!aprendizData.programa.trim()) {
      setAprendizFormErrors('Por favor indica tu programa de formación.');
      return;
    }

    setAprendizFormErrors(null);
    onEnterAsAprendiz(aprendizData);
  };

  // Instructor submission (Strict validation for Sena1234)
  const handleInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    const cleanPassword = instructorPassword.trim();
    if (cleanPassword === 'Sena1234') {
      onEnterAsInstructor(instructorData);
    } else {
      setPasswordError('Clave incorrecta. Por favor verifica e intenta nuevamente.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Top Bar with SENA Branding and Theme Toggle */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SenaLogo size={42} />
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white block">
                Servicio Nacional de Aprendizaje - SENA
              </span>
              <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold block -mt-0.5">
                Plataforma de Inducción · Acuerdo 0009 de 2024 (act. 2026)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleDarkMode}
              aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
              className="cursor-pointer p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Landing Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
        {/* Subtle decorative background spots */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-emerald-500/10 dark:bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="w-full max-w-4xl mx-auto space-y-6">
          {/* Welcome Banner */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 mb-1">
              <Sparkles size={14} className="text-emerald-700 dark:text-emerald-400" />
              <span>Inducción Oficial y Reglamento del Aprendiz</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Bienvenido al Portal de Inducción SENA
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Portal institucional para la inducción y apropiación del Reglamento del Aprendiz SENA.
            </p>
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-lg text-sm font-bold hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors cursor-pointer border border-emerald-200 dark:border-emerald-800"
            >
              <BookOpen size={18} />
              Ver Video Tutorial
            </button>
          </div>

          {/* Role Selector Tabs (Aprendiz vs Instructor) */}
          <div className="grid grid-cols-2 gap-3 max-w-xl mx-auto p-1.5 bg-slate-200/80 dark:bg-slate-900 rounded-2xl border border-slate-300/80 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('aprendiz');
                setPasswordError(null);
              }}
              className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                selectedRole === 'aprendiz'
                  ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-md border border-emerald-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap size={18} className={selectedRole === 'aprendiz' ? 'text-emerald-700 dark:text-emerald-400' : ''} />
              <span>Soy Aprendiz</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('instructor');
                setAprendizFormErrors(null);
              }}
              className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                selectedRole === 'instructor'
                  ? 'bg-white dark:bg-slate-800 text-purple-800 dark:text-purple-300 shadow-md border border-purple-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Shield size={18} className={selectedRole === 'instructor' ? 'text-purple-700 dark:text-purple-400' : ''} />
              <span>Soy Instructor</span>
            </button>
          </div>

          {/* ======================================================== */}
          {/* TAB 1: APRENDIZ CHARACTERIZATION FORM (NO PASSWORD)     */}
          {/* ======================================================== */}
          {selectedRole === 'aprendiz' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-200">
              <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/20 border-b border-emerald-100 dark:border-emerald-900/40">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-sm">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        Ingreso del Aprendiz SENA
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        Ingresa con tus datos de caracterización. <strong>No requieres contraseña.</strong>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetAprendizForm}
                      title="Limpiar todos los campos del formulario para ingresar otro aprendiz"
                      className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                    >
                      <RotateCcw size={12} />
                      <span>Limpiar Formulario</span>
                    </button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleAprendizSubmit} className="p-5 sm:p-8 space-y-5">
                {aprendizFormErrors && (
                  <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 rounded-xl text-xs sm:text-sm flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0 text-rose-600 dark:text-rose-400" />
                    <span>{aprendizFormErrors}</span>
                  </div>
                )}

                {/* Section 1: Personal Data */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <FileText size={14} className="text-emerald-700 dark:text-emerald-400" />
                    1. Identificación del Aprendiz
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Nombres y Apellidos Completos <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={aprendizData.fullName}
                      onChange={(e) => setAprendizData({ ...aprendizData, fullName: e.target.value })}
                      placeholder="Ej. Carlos Eduardo Ramírez Peña"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Tipo de Documento <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={aprendizData.docType}
                        onChange={(e) =>
                          setAprendizData({
                            ...aprendizData,
                            docType: e.target.value as AprendizProfile['docType'],
                          })
                        }
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="CC">Cédula de Ciudadanía (C.C.)</option>
                        <option value="TI">Tarjeta de Identidad (T.I.)</option>
                        <option value="CE">Cédula de Extranjería (C.E.)</option>
                        <option value="PEP">Permiso Especial de Permanencia (PEP)</option>
                        <option value="PPT">Permiso por Protección Temporal (PPT)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Número de Documento de Identidad <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={aprendizData.docNumber}
                        onChange={(e) => setAprendizData({ ...aprendizData, docNumber: e.target.value })}
                        placeholder="Ej. 1025894120"
                        className="w-full px-3.5 py-2.5 text-sm font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Program & Ficha */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <Hash size={14} className="text-emerald-700 dark:text-emerald-400" />
                    2. Programa y Ficha de Caracterización
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Número de Ficha <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={aprendizData.ficha}
                        onChange={(e) => setAprendizData({ ...aprendizData, ficha: e.target.value })}
                        placeholder="Ej. 2874910"
                        className="w-full px-3.5 py-2.5 text-sm font-mono font-bold bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-emerald-800 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Nivel de Formación <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={aprendizData.nivelFormacion}
                        onChange={(e) =>
                          setAprendizData({
                            ...aprendizData,
                            nivelFormacion: e.target.value as AprendizProfile['nivelFormacion'],
                          })
                        }
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Tecnólogo">Tecnólogo</option>
                        <option value="Técnico">Técnico</option>
                        <option value="Operario">Operario</option>
                        <option value="Especialización Tecnológica">Especialización Tecnológica</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Modalidad <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={aprendizData.modalidad}
                        onChange={(e) =>
                          setAprendizData({
                            ...aprendizData,
                            modalidad: e.target.value as AprendizProfile['modalidad'],
                          })
                        }
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Presencial">Presencial</option>
                        <option value="Virtual">Virtual</option>
                        <option value="A Distancia">A Distancia</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Programa de Formación <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={aprendizData.programa}
                      onChange={(e) => setAprendizData({ ...aprendizData, programa: e.target.value })}
                      placeholder="Ej. Análisis y Desarrollo de Software (ADSO)"
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Section 3: Center and Regional */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <Building size={14} className="text-emerald-700 dark:text-emerald-400" />
                    3. Centro de Formación y Regional
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Regional SENA
                      </label>
                      <select
                        value={aprendizData.regional}
                        onChange={(e) => setAprendizData({ ...aprendizData, regional: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        {REGIONAL_LIST.map((reg) => (
                          <option key={reg} value={reg}>
                            {reg}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Centro de Formación
                      </label>
                      <input
                        type="text"
                        value={aprendizData.centroFormacion}
                        onChange={(e) =>
                          setAprendizData({ ...aprendizData, centroFormacion: e.target.value })
                        }
                        placeholder="Ej. Centro de Electricidad, Electrónica y Telecomunicaciones"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Apprentice Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/30 flex items-center justify-center gap-2.5 text-base transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Ingresar como Aprendiz e Iniciar Inducción</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: INSTRUCTOR LOGIN FORM (REQUIRES Sena1234)         */}
          {/* ======================================================== */}
          {selectedRole === 'instructor' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in duration-200">
              <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/20 border-b border-purple-100 dark:border-purple-900/40">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-600 text-white rounded-xl shadow-sm">
                      <Shield size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        Acceso para Instructores y Líderes
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        Panel exclusivo de seguimiento de cohortes y sincronización con Google Drive.
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-200/80 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200">
                    <Lock size={13} />
                    Acceso Protegido
                  </span>
                </div>
              </div>

              <form onSubmit={handleInstructorSubmit} className="p-5 sm:p-8 space-y-6">
                {/* Mandatory password entry */}
                <div className="p-5 bg-purple-50/60 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-purple-950 dark:text-purple-300">
                      Clave de Instructor <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] font-medium text-purple-700 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-2 py-0.5 rounded">
                      Acceso Restringido
                    </span>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-600 dark:text-purple-400">
                      <Lock size={17} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={instructorPassword}
                      onChange={(e) => {
                        setInstructorPassword(e.target.value);
                        setPasswordError(null);
                      }}
                      placeholder="Ingresa la clave institucional..."
                      className={`w-full pl-10 pr-11 py-3 text-sm font-mono bg-white dark:bg-slate-950 border rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                        passwordError
                          ? 'border-rose-400 focus:ring-rose-500'
                          : 'border-purple-300 dark:border-purple-700 focus:ring-purple-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {passwordError && (
                    <div className="p-2.5 bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 rounded-lg text-xs font-medium flex items-center gap-2">
                      <AlertCircle size={15} className="shrink-0 text-rose-600" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Solo los instructores autorizados tienen privilegios para vincular y sincronizar la hoja de cálculo de Google Drive y descargar los registros consolidados.
                  </p>
                </div>

                {/* Instructor Profile Details (Pre-filled, editable) */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <UserCheck size={14} className="text-purple-700 dark:text-purple-400" />
                    Datos del Instructor Líder
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Nombre del Instructor
                      </label>
                      <input
                        type="text"
                        value={instructorData.fullName}
                        onChange={(e) =>
                          setInstructorData({ ...instructorData, fullName: e.target.value })
                        }
                        placeholder="Ej. Luz Marina Silva Torres"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Correo Institucional
                      </label>
                      <input
                        type="email"
                        value={instructorData.correo}
                        onChange={(e) =>
                          setInstructorData({ ...instructorData, correo: e.target.value })
                        }
                        placeholder="lmsilva0170@gmail.com"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Centro de Formación
                      </label>
                      <input
                        type="text"
                        value={instructorData.centroFormacion}
                        onChange={(e) =>
                          setInstructorData({ ...instructorData, centroFormacion: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Ficha Principal a Cargo
                      </label>
                      <input
                        type="text"
                        value={instructorData.fichaPrincipal || '2874910'}
                        onChange={(e) =>
                          setInstructorData({ ...instructorData, fichaPrincipal: e.target.value })
                        }
                        placeholder="2874910"
                        className="w-full px-3.5 py-2.5 text-sm font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Instructor Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-purple-700 hover:bg-purple-800 text-white font-extrabold rounded-xl shadow-lg shadow-purple-700/20 hover:shadow-purple-700/30 flex items-center justify-center gap-2.5 text-base transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Lock size={18} />
                  <span>Validar Clave y Acceder al Panel de Control</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
        
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 w-full max-w-3xl shadow-2xl relative">
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute -top-3 -right-3 p-2 bg-slate-900 text-white rounded-full hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <EyeOff size={18} />
              </button>
              <video
                src="/assets/aistudio/2026__4_28_p.m._61086484.mp4"
                controls
                autoPlay
                className="w-full rounded-xl"
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-950/70">
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          Servicio Nacional de Aprendizaje - SENA · Dirección de Formación Profesional
        </p>
        <p className="text-[11px] mt-1 text-slate-400 dark:text-slate-500">
          Reglamento del Aprendiz · Versión Normativa Vigente 2026 · República de Colombia
        </p>
      </footer>
    </div>
  );
};
