import React from 'react';
import { Moon, Sun, FileSpreadsheet, User, Shield, GraduationCap, ArrowRightLeft, LogOut } from 'lucide-react';
import { SenaLogo } from './SenaLogo';
import { UserRole } from '../types/induction';

interface HeaderProps {
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onExitToLanding: () => void;
  activeTab: 'modulos' | 'evaluacion' | 'certificado' | 'instructor';
  setActiveTab: (tab: 'modulos' | 'evaluacion' | 'certificado' | 'instructor') => void;
  openGlossary: () => void;
  openProfile: () => void;
  openGoogleSheets: () => void;
  aprendizName: string;
  instructorName: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isAutoSyncing?: boolean;
  lastSyncTime?: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSwitchRole,
  onExitToLanding,
  activeTab,
  setActiveTab,
  openGlossary,
  openProfile,
  openGoogleSheets,
  aprendizName,
  instructorName,
  isDarkMode,
  onToggleDarkMode,
  isAutoSyncing = false,
  lastSyncTime,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-6">
        
        {/* Zone 1: Brand element + Role Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab(currentRole === 'instructor' ? 'instructor' : 'modulos')}
            className="flex items-center gap-2.5 text-left text-slate-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
          >
            <SenaLogo size={46} />
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap block">
                SENA Inducción
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono -mt-0.5 block">
                Acuerdo 0009 de 2024
              </span>
            </div>
          </button>

          {/* Role Indicator Pill */}
          <span
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
              currentRole === 'instructor'
                ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-300 border border-purple-300 dark:border-purple-800'
                : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
            }`}
          >
            {currentRole === 'instructor' ? (
              <>
                <GraduationCap size={12} />
                <span>Instructor</span>
              </>
            ) : (
              <>
                <User size={12} />
                <span>Aprendiz</span>
              </>
            )}
          </span>
        </div>

        {/* Zone 2: Navigation Links (Apprentice vs Instructor) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          {currentRole === 'aprendiz' ? (
            <>
              <button
                onClick={() => setActiveTab('modulos')}
                className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 dark:hover:text-white pb-1 border-b-2 ${
                  activeTab === 'modulos'
                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-emerald-600 dark:border-emerald-500'
                    : 'border-transparent text-slate-600 dark:text-slate-400'
                }`}
              >
                Módulos del Reglamento
              </button>
              <button
                onClick={() => setActiveTab('evaluacion')}
                className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 dark:hover:text-white pb-1 border-b-2 ${
                  activeTab === 'evaluacion'
                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-emerald-600 dark:border-emerald-500'
                    : 'border-transparent text-slate-600 dark:text-slate-400'
                }`}
              >
                Evaluación de Casos
              </button>
              <button
                onClick={openGlossary}
                className="cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 dark:hover:text-white pb-1 border-b-2 border-transparent text-slate-600 dark:text-slate-400"
              >
                Glosario Normativo
              </button>
              <button
                onClick={() => setActiveTab('certificado')}
                className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 dark:hover:text-white pb-1 border-b-2 ${
                  activeTab === 'certificado'
                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold border-emerald-600 dark:border-emerald-500'
                    : 'border-transparent text-slate-600 dark:text-slate-400'
                }`}
              >
                Certificado Oficial
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('instructor')}
                className={`cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 dark:hover:text-white pb-1 border-b-2 ${
                  activeTab === 'instructor'
                    ? 'text-purple-700 dark:text-purple-400 font-semibold border-purple-600 dark:border-purple-500'
                    : 'border-transparent text-slate-600 dark:text-slate-400'
                }`}
              >
                Panel de Seguimiento
              </button>
              <button
                onClick={() => {
                  onSwitchRole('aprendiz');
                  setActiveTab('modulos');
                }}
                className="cursor-pointer whitespace-nowrap shrink-0 transition-colors hover:text-slate-900 dark:hover:text-white pb-1 border-b-2 border-transparent text-slate-600 dark:text-slate-400 flex items-center gap-1.5"
              >
                <ArrowRightLeft size={13} />
                <span>Ver Contenido como Aprendiz</span>
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Actions area */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Privilege: Google Sheets Drive Button IS ONLY SHOWN FOR INSTRUCTORS */}
          {currentRole === 'instructor' && (
            <button
              onClick={openGoogleSheets}
              title={
                isAutoSyncing
                  ? 'Sincronizando automáticamente con Google Drive...'
                  : lastSyncTime
                  ? `Sincronización activa con Google Drive (Última: ${lastSyncTime}). Clic para ver hoja.`
                  : 'Sincronización con Google Drive activa. Clic para ver configuración y hoja.'
              }
              className="cursor-pointer px-2.5 py-1.5 text-xs font-semibold text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors flex items-center gap-2 shadow-2xs whitespace-nowrap"
            >
              <div className="relative flex items-center justify-center">
                <FileSpreadsheet size={15} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isAutoSyncing ? 'bg-amber-400' : 'bg-emerald-400'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isAutoSyncing ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                </span>
              </div>
              <span className="hidden sm:inline">Hoja Drive</span>
              <span className="hidden lg:inline text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-900/50 px-1.5 py-0.2 rounded">
                Admin
              </span>
            </button>
          )}

          {/* Dark Mode Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro con efecto blur'}
            className="cursor-pointer p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 transition-all flex items-center justify-center shadow-2xs"
          >
            {isDarkMode ? (
              <Sun size={17} className="text-amber-400 animate-in fade-in zoom-in-75 duration-200" />
            ) : (
              <Moon size={17} className="text-slate-700 animate-in fade-in zoom-in-75 duration-200" />
            )}
          </button>

          {/* Apprentice Profile Button (Only in Apprentice Mode) */}
          {currentRole === 'aprendiz' ? (
            <button
              onClick={openProfile}
              title="Ver o editar tus datos de aprendiz"
              className="px-3 py-1.5 text-xs font-semibold text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300/80 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 max-w-[170px]"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 shrink-0" aria-hidden="true" />
              <span className="truncate">{aprendizName || 'Mi Perfil'}</span>
            </button>
          ) : (
            /* Instructor Profile Badge */
            <div
              className="px-3 py-1.5 text-xs font-semibold text-purple-900 dark:text-purple-200 bg-purple-50 dark:bg-purple-950/70 border border-purple-300 dark:border-purple-800 rounded-lg whitespace-nowrap shrink-0 flex items-center gap-2 max-w-[190px]"
            >
              <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 shrink-0" aria-hidden="true" />
              <span className="truncate">{instructorName || 'Instructor'}</span>
            </div>
          )}

          {/* Role Actions & Exit to Landing */}
          {currentRole === 'aprendiz' ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onExitToLanding}
                title="Volver a la selección de rol / Salir"
                className="cursor-pointer px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-2xs whitespace-nowrap"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  onSwitchRole('aprendiz');
                  setActiveTab('modulos');
                }}
                title="Probar vista como aprendiz"
                className="cursor-pointer px-2.5 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-800 shadow-2xs whitespace-nowrap"
              >
                <User size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Modo Aprendiz</span>
              </button>

              <button
                onClick={onExitToLanding}
                title="Cerrar sesión y volver al Portal de Roles"
                className="cursor-pointer px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-2xs whitespace-nowrap"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Mobile nav sub-bar */}
      <div className="flex md:hidden border-t border-slate-100 dark:border-slate-800 px-4 py-2 bg-slate-50 dark:bg-slate-950/90 overflow-x-auto gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
        {currentRole === 'aprendiz' ? (
          <>
            <button
              onClick={() => setActiveTab('modulos')}
              className={`whitespace-nowrap px-2 py-1 rounded ${
                activeTab === 'modulos'
                  ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 font-semibold shadow-xs'
                  : ''
              }`}
            >
              Módulos
            </button>
            <button
              onClick={() => setActiveTab('evaluacion')}
              className={`whitespace-nowrap px-2 py-1 rounded ${
                activeTab === 'evaluacion'
                  ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 font-semibold shadow-xs'
                  : ''
              }`}
            >
              Evaluación
            </button>
            <button
              onClick={openGlossary}
              className="whitespace-nowrap px-2 py-1 rounded hover:text-slate-900 dark:hover:text-white"
            >
              Glosario
            </button>
            <button
              onClick={() => setActiveTab('certificado')}
              className={`whitespace-nowrap px-2 py-1 rounded ${
                activeTab === 'certificado'
                  ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 font-semibold shadow-xs'
                  : ''
              }`}
            >
              Certificado
            </button>
            <button
              onClick={onExitToLanding}
              className="whitespace-nowrap px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1"
            >
              <LogOut size={12} />
              <span>Cambiar Rol</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('instructor')}
              className={`whitespace-nowrap px-2 py-1 rounded ${
                activeTab === 'instructor'
                  ? 'bg-white dark:bg-slate-800 text-purple-800 dark:text-purple-400 font-semibold shadow-xs'
                  : ''
              }`}
            >
              Panel Seguimiento
            </button>
            <button
              onClick={openGoogleSheets}
              className="whitespace-nowrap px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <FileSpreadsheet size={13} />
              <span>Hoja Drive</span>
            </button>
            <button
              onClick={() => {
                onSwitchRole('aprendiz');
                setActiveTab('modulos');
              }}
              className="whitespace-nowrap px-2 py-1 rounded hover:text-slate-900 dark:hover:text-white"
            >
              Ver como Aprendiz
            </button>
            <button
              onClick={onExitToLanding}
              className="whitespace-nowrap px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1"
            >
              <LogOut size={12} />
              <span>Salir</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
};
