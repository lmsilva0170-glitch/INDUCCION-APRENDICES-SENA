import React from 'react';
import { BookOpen, CheckCircle, FileText, Sparkles, UserCheck } from 'lucide-react';
import { AprendizProfile } from '../types/induction';

interface HeroSectionProps {
  profile: AprendizProfile;
  completedModulesCount: number;
  totalModulesCount: number;
  quizScore: number;
  quizCompleted: boolean;
  onStartModules: () => void;
  onStartQuiz: () => void;
  onOpenCertificate: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  completedModulesCount,
  totalModulesCount,
  quizScore,
  quizCompleted,
  onStartModules,
  onStartQuiz,
  onOpenCertificate,
}) => {
  const progressPercent = Math.round(
    ((completedModulesCount + (quizCompleted ? 1 : 0)) / (totalModulesCount + 1)) * 100
  );

  return (
    <div className="relative bg-white dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800/80 overflow-hidden transition-colors">
      {/* Background visual asset with adaptive gradient scrim */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-15 pointer-events-none">
        <img
          src="/src/assets/images/hero_sena_campus_1792527247828.jpg"
          alt="Campus de formación profesional SENA"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/40 dark:from-slate-950 dark:via-slate-950/90 dark:to-slate-900/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Hero Column */}
          <div className="lg:col-span-7">
            {/* Unboxed metadata line with typographic bullet separators */}
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 mb-3">
              <span>SENA Colombia</span>
              <span aria-hidden="true">·</span>
              <span>Acuerdo 0009 de 2024 (Act. 2026)</span>
              <span aria-hidden="true">·</span>
              <span>Inducción Integral</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
              Inducción al Reglamento del Aprendiz SENA
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-6">
              Conoce tus <strong className="text-slate-900 dark:text-white font-semibold">derechos fundamentales</strong>, tus <strong className="text-slate-900 dark:text-white font-semibold">deberes éticos</strong> y las normativas vigentes del nuevo reglamento. Resuelve dilemas prácticos reales de tu formación y obtén tu <strong className="text-emerald-800 dark:text-emerald-400 font-semibold">certificado oficial verificable</strong>.
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onStartModules}
                className="cursor-pointer px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-medium text-sm rounded-lg transition-colors shadow-xs flex items-center gap-2 whitespace-nowrap"
              >
                <BookOpen size={16} />
                <span>Explorar Módulos</span>
              </button>

              <button
                onClick={onStartQuiz}
                className="cursor-pointer px-5 py-2.5 bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-sm rounded-lg transition-colors shadow-xs flex items-center gap-2 whitespace-nowrap"
              >
                <Sparkles size={16} className="text-amber-600 dark:text-amber-400" />
                <span>Evaluación de Casos ({quizCompleted ? `${quizScore}%` : 'Pendiente'})</span>
              </button>

              {quizCompleted && (
                <button
                  onClick={onOpenCertificate}
                  className="cursor-pointer px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 font-semibold text-sm rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <FileText size={16} />
                  <span>Ver Certificado</span>
                </button>
              )}
            </div>
          </div>

          {/* Apprentice Status Card with Dark blur glassmorphism */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50/90 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs backdrop-blur-md">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium mb-1">
                    Aprendiz Registrado
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {profile.fullName || 'Aprendiz SENA'}
                  </h2>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {profile.docNumber ? `${profile.docType} ${profile.docNumber}` : 'Documento en caracterización'} · Ficha:{' '}
                    <span className="font-mono text-slate-800 dark:text-slate-200">{profile.ficha || 'Pendiente'}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-800 dark:text-emerald-300 shrink-0">
                  <UserCheck size={20} />
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {profile.programa || 'Programa de Formación SENA'}
                </span>
                <div className="truncate mt-0.5">{profile.centroFormacion || 'Centro de Formación'}</div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300">Progreso de Inducción</span>
                  <span className="font-mono text-emerald-800 dark:text-emerald-400 tabular-nums">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 dark:bg-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  <span>Módulos: {completedModulesCount} de {totalModulesCount}</span>
                  <span>
                    Examen: {quizCompleted ? 'Completado' : 'Sin presentar'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Indicator Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Norma Vigente</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Acuerdo 0009 de 2024 (Act. 2026)</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Horas de Inducción</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">40 Horas Certificables</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Enfoque Pedagógico</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">Casos & Dilemas Reales</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block">Certificación</span>
            <span className="font-semibold text-emerald-800 dark:text-emerald-400">PDF con QR Oficial</span>
          </div>
        </div>
      </div>
    </div>
  );
};
