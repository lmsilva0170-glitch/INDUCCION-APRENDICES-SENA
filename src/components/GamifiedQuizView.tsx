import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  FileCheck,
  HelpCircle,
} from 'lucide-react';
import { QuizQuestion } from '../types/induction';

interface GamifiedQuizViewProps {
  questions: QuizQuestion[];
  quizAnswers: Record<number, number>;
  quizCompleted: boolean;
  quizScore: number;
  onAnswerQuestion: (questionId: number, selectedIndex: number) => void;
  onFinishQuiz: (finalScore: number) => void;
  onResetQuiz: () => void;
  onGoToCertificate: () => void;
}

export const GamifiedQuizView: React.FC<GamifiedQuizViewProps> = ({
  questions,
  quizAnswers,
  quizCompleted,
  quizScore,
  onAnswerQuestion,
  onFinishQuiz,
  onResetQuiz,
  onGoToCertificate,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQ = questions[currentQuestionIndex];
  const answeredCount = Object.keys(quizAnswers).length;

  const handleSelectOption = (index: number) => {
    onAnswerQuestion(currentQ.id, index);

    // If all questions are now answered, calculate score
    const newAnswers = { ...quizAnswers, [currentQ.id]: index };
    if (Object.keys(newAnswers).length === questions.length) {
      let correct = 0;
      questions.forEach((q) => {
        if (newAnswers[q.id] === q.correctIndex) {
          correct++;
        }
      });
      const scorePercent = Math.round((correct / questions.length) * 100);
      onFinishQuiz(scorePercent);

      if (scorePercent >= 70) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#39A900', '#007832', '#0284C7', '#F59E0B'],
        });
      }
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Progress Header */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-6 shadow-xs backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>Evaluación Diagnóstica y Formativa</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Reto de Casos: Reglamento del Aprendiz
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Puntaje mínimo aprobatorio para certificación: <strong className="text-slate-800 dark:text-slate-200">70%</strong>. Cada caso presenta una situación auténtica de formación.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Progreso del Examen</span>
            <span className="font-mono text-lg font-bold text-slate-900 dark:text-white tabular-nums">
              {answeredCount} / {questions.length}
            </span>
          </div>
        </div>

        {/* Question Selector Dots/Tabs */}
        <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1">
          {questions.map((q, idx) => {
            const hasAnswered = quizAnswers[q.id] !== undefined;
            const isCorrect = hasAnswered && quizAnswers[q.id] === q.correctIndex;
            const isCurrent = idx === currentQuestionIndex;

            let dotStyle =
              'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700';
            if (hasAnswered) {
              dotStyle = isCorrect
                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700 font-bold'
                : 'bg-red-100 dark:bg-red-950/80 text-red-900 dark:text-red-200 border-red-300 dark:border-red-700 font-bold';
            }
            if (isCurrent) {
              dotStyle += ' ring-2 ring-emerald-600 dark:ring-emerald-400 ring-offset-1 dark:ring-offset-slate-900';
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`cursor-pointer w-8 h-8 rounded-lg border text-xs flex items-center justify-center shrink-0 transition-all ${dotStyle}`}
                title={`Pregunta ${idx + 1}: ${q.category}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Completion Banner if finished */}
      {quizCompleted && (
        <div
          className={`rounded-xl p-6 mb-6 border shadow-xs backdrop-blur-md ${
            quizScore >= 70
              ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100'
              : 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-100'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-full shrink-0 ${
                  quizScore >= 70
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {quizScore >= 70 ? <Award size={24} /> : <HelpCircle size={24} />}
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {quizScore >= 70
                    ? '¡Felicitaciones! Has Aprobado la Inducción'
                    : 'Casi lo logras: Refuerza tus conocimientos'}
                </h3>
                <p className="text-xs mt-1 max-w-xl leading-relaxed opacity-90">
                  {quizScore >= 70
                    ? `Obtuviste una calificación de ${quizScore}%. Ya cumples con los requisitos normativos para generar y descargar tu Certificado Oficial de Inducción con código QR.`
                    : `Obtuviste ${quizScore}%. Necesitas al menos 70% para certificar la inducción. Puedes reiniciar el cuestionario para repasar los artículos y mejorar tu calificación.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onResetQuiz}
                className="cursor-pointer px-3.5 py-2 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RotateCcw size={14} />
                <span>Reiniciar</span>
              </button>

              {quizScore >= 70 && (
                <button
                  onClick={onGoToCertificate}
                  className="cursor-pointer px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <FileCheck size={16} />
                  <span>Generar Certificado</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-xs backdrop-blur-md">
        {/* Category & Step Header */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="font-semibold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
            Eje: {currentQ.category}
          </span>
          <span className="font-medium">
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </span>
        </div>

        {/* Real life situation context */}
        <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-4 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Caso Práctico:
          </span>
          <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            {currentQ.situation}
          </p>
        </div>

        {/* Question Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5">
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQ.options.map((optionText, idx) => {
            const hasAnsweredThis = quizAnswers[currentQ.id] !== undefined;
            const isUserChoice = quizAnswers[currentQ.id] === idx;
            const isCorrectAnswer = idx === currentQ.correctIndex;

            let optionStyle =
              'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300';

            if (hasAnsweredThis) {
              if (isCorrectAnswer) {
                optionStyle =
                  'border-emerald-500 dark:border-emerald-400 bg-emerald-50/90 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500';
              } else if (isUserChoice && !isCorrectAnswer) {
                optionStyle =
                  'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-950/70 text-red-950 dark:text-red-100 ring-1 ring-red-400';
              } else {
                optionStyle =
                  'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 text-slate-400 dark:text-slate-600 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`cursor-pointer w-full p-4 rounded-xl border text-left text-xs sm:text-sm leading-relaxed transition-all flex items-start gap-3 ${optionStyle}`}
              >
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1">{optionText}</span>
                {hasAnsweredThis && isCorrectAnswer && (
                  <CheckCircle2 size={18} className="text-emerald-700 dark:text-emerald-400 shrink-0" />
                )}
                {hasAnsweredThis && isUserChoice && !isCorrectAnswer && (
                  <XCircle size={18} className="text-red-700 dark:text-red-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Pedagogical Explanation */}
        {quizAnswers[currentQ.id] !== undefined && (
          <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-lg p-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300 mb-6 space-y-2">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Fundamentación Normativa</span>
            </div>
            <p>{currentQ.explanation}</p>
            <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
              Cita: {currentQ.articleRef}
            </div>
          </div>
        )}

        {/* Question Footer Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className={`cursor-pointer px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              currentQuestionIndex === 0
                ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowLeft size={14} />
            <span>Caso Anterior</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
            className={`cursor-pointer px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              currentQuestionIndex === questions.length - 1
                ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                : 'bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-xs'
            }`}
          >
            <span>Siguiente Caso</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
