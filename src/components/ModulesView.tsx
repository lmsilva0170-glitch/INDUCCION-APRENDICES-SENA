import React, { useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Award,
  AlertCircle,
  ShieldCheck,
  Scale,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { ModuleData } from '../types/induction';
import { CircularProgress } from './CircularProgress';

interface ModulesViewProps {
  modules: ModuleData[];
  completedModuleIds: string[];
  moduleCaseAnswered: Record<string, number>;
  onAnswerModuleCase: (moduleId: string, optionIndex: number, isCorrect: boolean) => void;
  onGoToQuiz: () => void;
}

export const ModulesView: React.FC<ModulesViewProps> = ({
  modules,
  completedModuleIds,
  moduleCaseAnswered,
  onAnswerModuleCase,
  onGoToQuiz,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(modules[0].id);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const currentModule = modules.find((m) => m.id === selectedModuleId) || modules[0];
  const currentIndex = modules.findIndex((m) => m.id === selectedModuleId);
  const selectedCaseOptionIndex = moduleCaseAnswered[currentModule.id];
  
  const progress = Math.round((completedModuleIds.length / modules.length) * 100);

  const handleSelectOption = (idx: number) => {
    const isCorrect = currentModule.caseDilemma.options[idx].isCorrect;
    onAnswerModuleCase(currentModule.id, idx, isCorrect);
  };

  const handleNext = () => {
    if (currentIndex < modules.length - 1) {
      setSelectedModuleId(modules[currentIndex + 1].id);
      setExpandedArticle(null);
    } else {
      onGoToQuiz();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedModuleId(modules[currentIndex - 1].id);
      setExpandedArticle(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Module Selector Strip */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <CircularProgress progress={progress} />
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Ruta Formativa del Reglamento
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supera cada módulo y resuelve el dilema práctico para desbloquear la insignia correspondiente.
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Módulo {currentIndex + 1} de {modules.length}
          </div>
        </div>

        {/* Tab row */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {modules.map((mod, i) => {
            const isCompleted = completedModuleIds.includes(mod.id);
            const isSelected = mod.id === selectedModuleId;

            return (
              <button
                key={mod.id}
                onClick={() => {
                  setSelectedModuleId(mod.id);
                  setExpandedArticle(null);
                }}
                className={`cursor-pointer p-3 rounded-xl border text-left transition-all backdrop-blur-xs ${
                  isSelected
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-xs'
                    : isCompleted
                    ? 'border-emerald-200 dark:border-emerald-900/60 bg-white dark:bg-slate-900/70 hover:border-emerald-300'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-500 dark:text-slate-400">Módulo 0{i + 1}</span>
                  {isCompleted ? (
                    <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
                  )}
                </div>
                <div
                  className={`text-xs font-semibold truncate ${
                    isSelected
                      ? 'text-emerald-900 dark:text-emerald-300'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {mod.title.split(',')[0]}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {mod.badgeName}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Module Layout (Split: Content & Case Dilemma) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Conceptual Stage & Normative Articles */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Header & Core Summary with dark glass blur */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs backdrop-blur-md">
            {/* Unboxed Chapter Kicker */}
            <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 mb-1">
              {currentModule.capitulo} · {currentModule.acuerdoRef}
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {currentModule.title}
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
              {currentModule.summary}
            </p>

            {/* Key Topics List */}
            <div className="bg-slate-50 dark:bg-slate-950/60 rounded-lg p-4 border border-slate-200/80 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Info size={14} className="text-emerald-700 dark:text-emerald-400" />
                <span>Puntos Clave a Recordar</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {currentModule.keyTopics.map((topic, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Visual Workshop Spotlight for modules 3 and 4 */}
          {(currentModule.id === 'm3-deberes' || currentModule.id === 'm4-prohibiciones') && (
            <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs backdrop-blur-md">
              <div className="h-44 sm:h-52 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src="/src/assets/images/sena_training_workshop_1792527248287.jpg"
                  alt="Taller técnico SENA de aprendizaje seguro"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                  <div className="text-white text-xs">
                    <span className="font-semibold block text-sm">
                      Seguridad y Convivencia en Ambientes de Aprendizaje
                    </span>
                    <span className="text-slate-200">
                      El respeto a las normas técnicas y EPP salva vidas y garantiza la certificación.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Articles Accordion */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs backdrop-blur-md">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-emerald-700 dark:text-emerald-400" />
              <span>Artículos Destacados del Reglamento</span>
            </h3>

            <div className="space-y-3">
              {currentModule.articles.map((art) => {
                const isExpanded = expandedArticle === art.article;

                return (
                  <div
                    key={art.article}
                    className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() =>
                        setExpandedArticle(isExpanded ? null : art.article)
                      }
                      className="cursor-pointer w-full p-3.5 bg-slate-50 dark:bg-slate-950/60 hover:bg-slate-100/80 dark:hover:bg-slate-900/80 flex items-center justify-between text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                          {art.article}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {art.title}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown size={16} className="text-slate-500 dark:text-slate-400 shrink-0" />
                      ) : (
                        <ChevronRight size={16} className="text-slate-500 dark:text-slate-400 shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-4 bg-white dark:bg-slate-900/90 text-xs leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 space-y-2">
                        <p>{art.content}</p>
                        <div className="pt-2 text-[11px] font-semibold text-emerald-900 dark:text-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/50 p-2.5 rounded border border-emerald-100 dark:border-emerald-900/60 flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
                          <span>Conclusión práctica: {art.keyTakeaway}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Case Dilemma (Gamification Component) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900/80 border-2 border-emerald-600/30 dark:border-emerald-500/30 rounded-xl p-6 shadow-sm sticky top-24 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold text-emerald-800 dark:text-emerald-400">
                    Reto Gamificado
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Dilema de la Vida Real
                  </h3>
                </div>
              </div>

              {completedModuleIds.includes(currentModule.id) && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 size={13} />
                  <span>Completado</span>
                </div>
              )}
            </div>

            {/* Context Box */}
            <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 mb-4">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Situación en el Centro:
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentModule.caseDilemma.context}
              </p>
            </div>

            <p className="text-xs font-bold text-slate-900 dark:text-white mb-3">
              {currentModule.caseDilemma.question}
            </p>

            {/* Option Buttons */}
            <div className="space-y-2.5 mb-5">
              {currentModule.caseDilemma.options.map((opt, idx) => {
                const isSelected = selectedCaseOptionIndex === idx;
                const hasAnswered = selectedCaseOptionIndex !== undefined;

                let buttonStyle =
                  'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300';

                if (hasAnswered) {
                  if (opt.isCorrect) {
                    buttonStyle =
                      'border-emerald-500 dark:border-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 font-medium';
                  } else if (isSelected && !opt.isCorrect) {
                    buttonStyle =
                      'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-950/60 text-red-950 dark:text-red-100';
                  } else {
                    buttonStyle =
                      'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-400 dark:text-slate-600 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`cursor-pointer w-full p-3.5 rounded-lg border text-left text-xs leading-snug transition-all ${buttonStyle}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Instant Feedback Panel */}
            {selectedCaseOptionIndex !== undefined && (
              <div
                className={`p-4 rounded-lg border text-xs leading-relaxed mb-5 ${
                  currentModule.caseDilemma.options[selectedCaseOptionIndex].isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                    : 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  {currentModule.caseDilemma.options[selectedCaseOptionIndex].isCorrect ? (
                    <>
                      <CheckCircle2 size={16} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
                      <span>¡Respuesta Acertada!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} className="text-amber-700 dark:text-amber-400 shrink-0" />
                      <span>Atención pedagógica:</span>
                    </>
                  )}
                </div>
                <p className="mb-2">
                  {currentModule.caseDilemma.options[selectedCaseOptionIndex].feedback}
                </p>
                <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 border-t border-slate-300/40 dark:border-slate-700/60 pt-1.5">
                  Fundamento: {currentModule.caseDilemma.options[selectedCaseOptionIndex].legalBasis}
                </div>
              </div>
            )}

            {/* Badge Earned Card */}
            {completedModuleIds.includes(currentModule.id) && (
              <div className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    Insignia Desbloqueada: {currentModule.badgeName}
                  </div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    {currentModule.badgeDescription}
                  </div>
                </div>
              </div>
            )}

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`cursor-pointer px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                  currentIndex === 0
                    ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ArrowLeft size={14} />
                <span>Anterior</span>
              </button>

              <button
                onClick={handleNext}
                className="cursor-pointer px-4 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>
                  {currentIndex < modules.length - 1
                    ? 'Siguiente Módulo'
                    : 'Ir a Evaluación Final'}
                </span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
