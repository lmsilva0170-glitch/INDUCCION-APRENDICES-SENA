import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ModulesView } from './components/ModulesView';
import { GamifiedQuizView } from './components/GamifiedQuizView';
import { CertificateView } from './components/CertificateView';
import { ProfileModal } from './components/ProfileModal';
import { GlossaryModal } from './components/GlossaryModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { InstructorDashboard } from './components/InstructorDashboard';
import { RoleSelectionLanding } from './components/RoleSelectionLanding';
import {
  DEFAULT_PROFILE,
  EMPTY_APPRENTICE_PROFILE,
  DEFAULT_INSTRUCTOR_PROFILE,
  MODULES_DATA,
  QUIZ_QUESTIONS,
} from './data/senaRegulationData';
import { AprendizProfile, InstructorProfile, UserRole } from './types/induction';
import {
  autoSyncApprentice,
  subscribeToSyncStatus,
  flushSyncQueue,
  getLastSyncTimestamp,
  SyncedApprenticeRecord,
} from './services/autoSyncService';
import { ShieldCheck, X, Award, CheckCircle } from 'lucide-react';

const STORAGE_KEYS = {
  USER_ROLE: 'sena_induction_user_role_v1',
  SESSION_ACTIVE: 'sena_induction_session_active_v1',
  PROFILE: 'sena_induction_profile_v1',
  INSTRUCTOR_PROFILE: 'sena_induction_instructor_profile_v1',
  COMPLETED_MODULES: 'sena_induction_completed_modules_v1',
  MODULE_CASES: 'sena_induction_module_cases_v1',
  QUIZ_ANSWERS: 'sena_induction_quiz_answers_v1',
  QUIZ_COMPLETED: 'sena_induction_quiz_completed_v1',
  QUIZ_SCORE: 'sena_induction_quiz_score_v1',
  CERT_CODE: 'sena_induction_cert_code_v1',
  COMPLETED_AT: 'sena_induction_completed_at_v1',
  THEME: 'sena_induction_theme_v1',
};

export default function App() {
  // Determine role: checks URL parameter (?rol=aprendiz or ?rol=instructor), then localStorage, defaults to 'aprendiz'
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlRol = params.get('rol');
      if (urlRol === 'aprendiz' || urlRol === 'instructor') {
        return urlRol as UserRole;
      }
      const stored = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
      if (stored === 'aprendiz' || stored === 'instructor') {
        return stored as UserRole;
      }
    } catch {
      // fallback
    }
    return 'aprendiz';
  });

  // Landing Page view state: defaults to true on initial entry, or false if already active in this session
  const [isLandingView, setIsLandingView] = useState<boolean>(() => {
    try {
      const sessionActive = sessionStorage.getItem(STORAGE_KEYS.SESSION_ACTIVE);
      if (sessionActive === 'true') {
        return false;
      }
    } catch {
      // fallback
    }
    return true;
  });

  // Pre-selected tab in Landing Page based on URL parameter (?rol=aprendiz or ?rol=instructor)
  const [landingInitialRole, setLandingInitialRole] = useState<'aprendiz' | 'instructor'>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlRol = params.get('rol');
      if (urlRol === 'aprendiz' || urlRol === 'instructor') {
        return urlRol as 'aprendiz' | 'instructor';
      }
    } catch {
      // fallback
    }
    return 'aprendiz';
  });

  const [activeTab, setActiveTab] = useState<'modulos' | 'evaluacion' | 'certificado' | 'instructor'>(() => {
    return userRole === 'instructor' ? 'instructor' : 'modulos';
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isGoogleSheetsOpen, setIsGoogleSheetsOpen] = useState(false);
  const [isBlurTransitioning, setIsBlurTransitioning] = useState(false);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(getLastSyncTimestamp());

  // Inspected Apprentice Record (for Instructor to view certificate)
  const [inspectedRecord, setInspectedRecord] = useState<SyncedApprenticeRecord | null>(null);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME);
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Apprentice Profile State (defaults to empty so each apprentice fills their own data)
  const [profile, setProfile] = useState<AprendizProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return stored ? JSON.parse(stored) : EMPTY_APPRENTICE_PROFILE;
    } catch {
      return EMPTY_APPRENTICE_PROFILE;
    }
  });

  // Instructor Profile State
  const [instructorProfile, setInstructorProfile] = useState<InstructorProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INSTRUCTOR_PROFILE);
      return stored ? JSON.parse(stored) : DEFAULT_INSTRUCTOR_PROFILE;
    } catch {
      return DEFAULT_INSTRUCTOR_PROFILE;
    }
  });

  // Completed modules
  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.COMPLETED_MODULES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Module case answers
  const [moduleCaseAnswered, setModuleCaseAnswered] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MODULE_CASES);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUIZ_ANSWERS);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [quizCompleted, setQuizCompleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.QUIZ_COMPLETED) === 'true';
    } catch {
      return false;
    }
  });

  const [quizScore, setQuizScore] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUIZ_SCORE);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [certificateCode, setCertificateCode] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CERT_CODE);
      if (stored) return stored;
    } catch {
      // fallback
    }
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `SENA-IND-2024-${rand}`;
  });

  const [completedAt, setCompletedAt] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.COMPLETED_AT) || null;
    } catch {
      return null;
    }
  });

  // Apply dark mode class to root HTML & body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDarkMode]);

  // Subscribe to automatic background sync & perform initial queue flush
  useEffect(() => {
    const unsub = subscribeToSyncStatus((status) => {
      setIsAutoSyncing(status.isSyncing);
      setLastSyncTime(status.lastSynced);
    });

    if (profile.fullName && profile.docNumber) {
      autoSyncApprentice(profile, quizScore, certificateCode, completedAt);
    }
    flushSyncQueue();

    return () => unsub();
  }, []);

  // Comprehensive reset function to ensure every apprentice registration is 100% independent
  const handleResetApprenticeState = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.SESSION_ACTIVE);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_MODULES);
      localStorage.removeItem(STORAGE_KEYS.MODULE_CASES);
      localStorage.removeItem(STORAGE_KEYS.QUIZ_ANSWERS);
      localStorage.removeItem(STORAGE_KEYS.QUIZ_COMPLETED);
      localStorage.removeItem(STORAGE_KEYS.QUIZ_SCORE);
      localStorage.removeItem(STORAGE_KEYS.CERT_CODE);
      localStorage.removeItem(STORAGE_KEYS.COMPLETED_AT);
    } catch {
      // ignore
    }

    setProfile(EMPTY_APPRENTICE_PROFILE);
    setCompletedModuleIds([]);
    setModuleCaseAnswered({});
    setQuizAnswers({});
    setQuizCompleted(false);
    setQuizScore(0);
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCertificateCode(`SENA-IND-2024-${rand}`);
    setCompletedAt(null);
  };

  // Handler for Apprentice entry from Landing Page (characterization filled, no password needed)
  const handleEnterAsAprendiz = (formData: AprendizProfile) => {
    // Check if registering a new apprentice or changing user identity
    const isDifferentApprentice =
      !profile.docNumber || profile.docNumber !== formData.docNumber;

    let targetCertCode = certificateCode;
    let targetScore = quizScore;
    let targetCompleted = quizCompleted;
    let targetCompletedAt = completedAt;

    if (isDifferentApprentice) {
      // Fresh clean slate: do NOT inherit scores, completed modules or certificate from previous apprentice
      targetScore = 0;
      targetCompleted = false;
      targetCompletedAt = null;
      const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
      targetCertCode = `SENA-IND-2024-${rand}`;

      setCompletedModuleIds([]);
      setModuleCaseAnswered({});
      setQuizAnswers({});
      setQuizCompleted(false);
      setQuizScore(0);
      setCertificateCode(targetCertCode);
      setCompletedAt(null);

      try {
        localStorage.removeItem(STORAGE_KEYS.COMPLETED_MODULES);
        localStorage.removeItem(STORAGE_KEYS.MODULE_CASES);
        localStorage.removeItem(STORAGE_KEYS.QUIZ_ANSWERS);
        localStorage.removeItem(STORAGE_KEYS.QUIZ_COMPLETED);
        localStorage.removeItem(STORAGE_KEYS.QUIZ_SCORE);
        localStorage.setItem(STORAGE_KEYS.CERT_CODE, targetCertCode);
        localStorage.removeItem(STORAGE_KEYS.COMPLETED_AT);
      } catch {
        // ignore
      }
    }

    setProfile(formData);
    setUserRole('aprendiz');
    setActiveTab('modulos');
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(formData));
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, 'aprendiz');
      sessionStorage.setItem(STORAGE_KEYS.SESSION_ACTIVE, 'true');
    } catch (e) {
      console.error(e);
    }
    setIsLandingView(false);

    // Immediate background auto-sync to Google Drive sheet with independent apprentice record
    autoSyncApprentice(formData, targetScore, targetCertCode, targetCompletedAt);
  };

  // Handler for Instructor entry from Landing Page (validated with Sena1234)
  const handleEnterAsInstructor = (formData: InstructorProfile) => {
    setInstructorProfile(formData);
    setUserRole('instructor');
    setActiveTab('instructor');
    try {
      localStorage.setItem(STORAGE_KEYS.INSTRUCTOR_PROFILE, JSON.stringify(formData));
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, 'instructor');
      sessionStorage.setItem(STORAGE_KEYS.SESSION_ACTIVE, 'true');
    } catch (e) {
      console.error(e);
    }
    setIsLandingView(false);
  };

  // Return to Landing Page and clear apprentice form so another apprentice can register independently
  const handleExitToLanding = (roleHint?: 'aprendiz' | 'instructor') => {
    handleResetApprenticeState();
    setActiveTab('modulos');

    if (roleHint) {
      setLandingInitialRole(roleHint);
    } else {
      setLandingInitialRole('aprendiz');
    }
    setIsLandingView(true);
  };

  // Switch role handler with strict protection: entering instructor role requires password on landing page
  const handleSwitchRole = (newRole: UserRole) => {
    if (newRole === 'instructor') {
      // Redirects to password gateway for security
      handleExitToLanding('instructor');
      return;
    }
    setUserRole(newRole);
    try {
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, newRole);
    } catch {
      // ignore
    }
    setActiveTab('modulos');
  };

  // Toggle Dark Mode with Screen Blur Effect
  const handleToggleDarkMode = () => {
    setIsBlurTransitioning(true);
    setIsDarkMode((prev) => !prev);
    setTimeout(() => {
      setIsBlurTransitioning(false);
    }, 450);
  };

  // Persist Apprentice Profile and Auto-sync in background to Google Drive
  const handleSaveProfile = (updated: AprendizProfile) => {
    setProfile(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    // Zero-Touch background sync to Google Sheets
    autoSyncApprentice(updated, quizScore, certificateCode, completedAt);
  };

  // Persist Instructor Profile
  const handleUpdateInstructorProfile = (updated: InstructorProfile) => {
    setInstructorProfile(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.INSTRUCTOR_PROFILE, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Answer a module case dilemma
  const handleAnswerModuleCase = (moduleId: string, optionIndex: number, isCorrect: boolean) => {
    const updated = { ...moduleCaseAnswered, [moduleId]: optionIndex };
    setModuleCaseAnswered(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.MODULE_CASES, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    if (isCorrect && !completedModuleIds.includes(moduleId)) {
      const updatedModules = [...completedModuleIds, moduleId];
      setCompletedModuleIds(updatedModules);
      try {
        localStorage.setItem(STORAGE_KEYS.COMPLETED_MODULES, JSON.stringify(updatedModules));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Answer a quiz question
  const handleAnswerQuizQuestion = (questionId: number, selectedIndex: number) => {
    const updated = { ...quizAnswers, [questionId]: selectedIndex };
    setQuizAnswers(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.QUIZ_ANSWERS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Finish quiz & Auto-sync completed score and certification to Google Sheets
  const handleFinishQuiz = (score: number) => {
    setQuizScore(score);
    setQuizCompleted(true);
    const now = new Date().toISOString();
    setCompletedAt(now);

    try {
      localStorage.setItem(STORAGE_KEYS.QUIZ_SCORE, score.toString());
      localStorage.setItem(STORAGE_KEYS.QUIZ_COMPLETED, 'true');
      localStorage.setItem(STORAGE_KEYS.COMPLETED_AT, now);
      localStorage.setItem(STORAGE_KEYS.CERT_CODE, certificateCode);
    } catch (e) {
      console.error(e);
    }

    // Zero-Touch background sync to Google Sheets in Google Drive
    autoSyncApprentice(profile, score, certificateCode, now);
  };

  // Reset quiz
  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizCompleted(false);
    setQuizScore(0);
    try {
      localStorage.removeItem(STORAGE_KEYS.QUIZ_ANSWERS);
      localStorage.removeItem(STORAGE_KEYS.QUIZ_COMPLETED);
      localStorage.removeItem(STORAGE_KEYS.QUIZ_SCORE);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLandingView) {
    return (
      <RoleSelectionLanding
        initialRole={landingInitialRole}
        currentApprenticeProfile={profile}
        currentInstructorProfile={instructorProfile}
        onEnterAsAprendiz={handleEnterAsAprendiz}
        onEnterAsInstructor={handleEnterAsInstructor}
        onResetApprenticeData={handleResetApprenticeState}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      {/* Ambient background glows with heavy blur for dark mode atmosphere */}
      {isDarkMode && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-600/15 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 -right-32 w-96 h-96 bg-emerald-700/10 rounded-full blur-[140px]" />
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-cyan-700/10 rounded-full blur-[140px]" />
        </div>
      )}

      {/* Screen Blur Overlay effect during theme transition */}
      {isBlurTransitioning && (
        <div
          className="fixed inset-0 z-50 pointer-events-none backdrop-blur-md bg-emerald-950/20 dark:bg-black/30 transition-all duration-300 animate-in fade-in"
          aria-hidden="true"
        />
      )}

      {/* Header with strict role-based separation */}
      <Header
        currentRole={userRole}
        onSwitchRole={handleSwitchRole}
        onExitToLanding={() => handleExitToLanding()}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openGlossary={() => setIsGlossaryOpen(true)}
        openProfile={() => setIsProfileOpen(true)}
        openGoogleSheets={() => setIsGoogleSheetsOpen(true)}
        aprendizName={profile.fullName}
        instructorName={instructorProfile.fullName}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        isAutoSyncing={isAutoSyncing}
        lastSyncTime={lastSyncTime}
      />

      <main className="flex-1 relative z-10">
        
        {/* ======================================================== */}
        {/* INSTRUCTOR SCREEN: Dashboard, Tracking, Drive Controls   */}
        {/* ======================================================== */}
        {userRole === 'instructor' && activeTab === 'instructor' && (
          <InstructorDashboard
            instructorProfile={instructorProfile}
            onUpdateInstructorProfile={handleUpdateInstructorProfile}
            onOpenGoogleSheetsModal={() => setIsGoogleSheetsOpen(true)}
            onSwitchToAprendiz={() => handleSwitchRole('aprendiz')}
            onExitToLanding={() => handleExitToLanding('instructor')}
            onInspectApprenticeCertificate={(rec) => setInspectedRecord(rec)}
          />
        )}

        {/* ======================================================== */}
        {/* APPRENTICE SCREEN: Modules, Quiz, Certificate            */}
        {/* (Only accessible to apprentice or previewing instructor) */}
        {/* ======================================================== */}
        {activeTab === 'modulos' && (
          <>
            <HeroSection
              profile={profile}
              completedModulesCount={completedModuleIds.length}
              totalModulesCount={MODULES_DATA.length}
              quizScore={quizScore}
              quizCompleted={quizCompleted}
              onStartModules={() => {
                const el = document.getElementById('modules-container');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onStartQuiz={() => setActiveTab('evaluacion')}
              onOpenCertificate={() => setActiveTab('certificado')}
            />
            <div id="modules-container">
              <ModulesView
                modules={MODULES_DATA}
                completedModuleIds={completedModuleIds}
                moduleCaseAnswered={moduleCaseAnswered}
                onAnswerModuleCase={handleAnswerModuleCase}
                onGoToQuiz={() => setActiveTab('evaluacion')}
              />
            </div>
          </>
        )}

        {/* Tab 2: Gamified Quiz */}
        {activeTab === 'evaluacion' && (
          <GamifiedQuizView
            questions={QUIZ_QUESTIONS}
            quizAnswers={quizAnswers}
            quizCompleted={quizCompleted}
            quizScore={quizScore}
            onAnswerQuestion={handleAnswerQuizQuestion}
            onFinishQuiz={handleFinishQuiz}
            onResetQuiz={handleResetQuiz}
            onGoToCertificate={() => setActiveTab('certificado')}
          />
        )}

        {/* Tab 3: Official Certificate View */}
        {activeTab === 'certificado' && (
          <CertificateView
            profile={profile}
            quizScore={quizScore}
            quizCompleted={quizCompleted}
            completedModulesCount={completedModuleIds.length}
            totalModulesCount={MODULES_DATA.length}
            certificateCode={certificateCode}
            completedAt={completedAt}
            onGoToQuiz={() => setActiveTab('evaluacion')}
            onGoToModules={() => setActiveTab('modulos')}
            onOpenGoogleSheets={userRole === 'instructor' ? () => setIsGoogleSheetsOpen(true) : undefined}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="no-print relative z-10 bg-white dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 mt-16 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">Servicio Nacional de Aprendizaje - SENA</span>
            <span aria-hidden="true">·</span>
            <span>Reglamento del Aprendiz (Acuerdo 0009 de 2024 con act. 2026)</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {userRole === 'instructor' ? (
              <>
                <button
                  onClick={() => setIsGoogleSheetsOpen(true)}
                  className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer font-semibold"
                >
                  Hoja en Google Drive
                </button>
                <button
                  onClick={() => setActiveTab('instructor')}
                  className="hover:text-purple-700 dark:hover:text-purple-400 transition-colors cursor-pointer font-semibold"
                >
                  Panel del Instructor
                </button>
                <button
                  onClick={() => handleExitToLanding('instructor')}
                  className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer font-semibold"
                >
                  Cambiar Rol / Salir
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleExitToLanding('instructor')}
                  className="hover:text-purple-700 dark:hover:text-purple-400 transition-colors cursor-pointer font-semibold"
                >
                  ¿Eres Instructor? Acceder con Clave
                </button>
                <button
                  onClick={() => handleExitToLanding('aprendiz')}
                  className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Cambiar Rol / Salir
                </button>
              </>
            )}
            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              Glosario Normativo
            </button>
            {userRole === 'aprendiz' && (
              <button
                onClick={() => setIsProfileOpen(true)}
                className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                Mi Ficha y Perfil
              </button>
            )}
            <span className="text-slate-400 dark:text-slate-600">Colombia</span>
          </div>
        </div>
      </footer>

      {/* Modal: Apprentice Profile (Only in apprentice mode) */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Modal: Glossary */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* Modal: Google Sheets Configuration (Exclusively for Instructor) */}
      {userRole === 'instructor' && (
        <GoogleSheetsModal
          isOpen={isGoogleSheetsOpen}
          onClose={() => setIsGoogleSheetsOpen(false)}
          profile={profile}
          quizScore={quizScore}
          quizCompleted={quizCompleted}
          certificateCode={certificateCode}
          completedAt={completedAt}
        />
      )}

      {/* Modal: Instructor Apprentice Certificate Inspector */}
      {inspectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 text-slate-900 dark:text-white animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-3 mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-400">
                <ShieldCheck size={24} />
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Constancia Oficial del Aprendiz
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Inspección del Instructor · SENA 2026
                  </span>
                </div>
              </div>
              <button
                onClick={() => setInspectedRecord(null)}
                className="cursor-pointer p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/70 rounded-xl p-4 text-xs space-y-2.5 mb-5 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-slate-500">Estado de Inducción:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    inspectedRecord.estado === 'APROBADO'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                  }`}
                >
                  {inspectedRecord.estado}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Aprendiz:</span>
                <span className="font-bold text-slate-900 dark:text-white">{inspectedRecord.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Documento:</span>
                <span className="font-mono">{inspectedRecord.docType} {inspectedRecord.docNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ficha:</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{inspectedRecord.ficha}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Programa:</span>
                <span className="text-right max-w-[240px] truncate">{inspectedRecord.programa}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Centro:</span>
                <span className="text-right max-w-[240px] truncate">{inspectedRecord.centroFormacion}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Calificación Evaluación:</span>
                <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">{inspectedRecord.score}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Código de Certificado:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{inspectedRecord.certificateCode || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fecha de Expedición:</span>
                <span>{inspectedRecord.approvalDate || inspectedRecord.timestamp}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setInspectedRecord(null)}
                className="cursor-pointer w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
