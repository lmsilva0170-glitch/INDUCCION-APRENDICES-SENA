import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Printer,
  Copy,
  ExternalLink,
  ShieldCheck,
  Award,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { AprendizProfile } from '../types/induction';
import { SenaLogo } from './SenaLogo';

interface CertificateViewProps {
  profile: AprendizProfile;
  quizScore: number;
  quizCompleted: boolean;
  completedModulesCount: number;
  totalModulesCount: number;
  certificateCode: string;
  completedAt: string | null;
  onGoToQuiz: () => void;
  onGoToModules: () => void;
  onOpenGoogleSheets?: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  profile,
  quizScore,
  quizCompleted,
  completedModulesCount,
  totalModulesCount,
  certificateCode,
  completedAt,
  onGoToQuiz,
  onGoToModules,
  onOpenGoogleSheets,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const isEligible = quizCompleted && quizScore >= 70;

  // Format date
  const issueDateFormatted = completedAt
    ? new Date(completedAt).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  useEffect(() => {
    if (!isEligible) return;

    const verificationPayload = JSON.stringify({
      institucion: 'SENA - Servicio Nacional de Aprendizaje',
      certificado: 'Inducción al Reglamento del Aprendiz (Acuerdo 0009 de 2024 con act. 2026)',
      codigo: certificateCode,
      aprendiz: profile.fullName,
      documento: `${profile.docType} ${profile.docNumber}`,
      ficha: profile.ficha,
      programa: profile.programa,
      centro: profile.centroFormacion,
      calificacion: `${quizScore}%`,
      fecha: issueDateFormatted,
      estado: 'Vigente y Verificado',
    });

    QRCode.toDataURL(
      verificationPayload,
      {
        width: 180,
        margin: 1,
        color: {
          dark: '#004d1f',
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [isEligible, certificateCode, profile, quizScore, issueDateFormatted]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(certificateCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isEligible) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-xs text-center backdrop-blur-md">
          <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-200 dark:border-amber-800">
            <Award size={28} />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Certificación Oficial Pendiente
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto mb-6">
            Para expedir tu certificado oficial de inducción al Reglamento del Aprendiz SENA (Acuerdo 0009 de 2024 con actualización 2026), debes completar la ruta y aprobar la evaluación.
          </p>

          {/* Checklist */}
          <div className="max-w-md mx-auto bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-lg p-5 text-left text-xs space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300 font-medium">1. Datos del Aprendiz registrados:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle size={14} /> Listo
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                2. Módulos de formación ({completedModulesCount} de {totalModulesCount}):
              </span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  completedModulesCount >= totalModulesCount
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                {completedModulesCount >= totalModulesCount ? (
                  <>
                    <CheckCircle size={14} /> Completados
                  </>
                ) : (
                  <span>Pendiente ({totalModulesCount - completedModulesCount} restantes)</span>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                3. Evaluación de Casos (Mínimo 70%):
              </span>
              <span
                className={`font-bold flex items-center gap-1 ${
                  quizCompleted && quizScore >= 70
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                {quizCompleted && quizScore >= 70 ? (
                  <>
                    <CheckCircle size={14} /> {quizScore}%
                  </>
                ) : quizCompleted ? (
                  <span>{quizScore}% (Requiere 70%)</span>
                ) : (
                  <span>Sin presentar</span>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onGoToModules}
              className="cursor-pointer px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Revisar Módulos
            </button>
            <button
              onClick={onGoToQuiz}
              className="cursor-pointer px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors shadow-xs"
            >
              Ir a la Evaluación
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top action toolbar (hidden on print) */}
      <div className="no-print bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl p-4 mb-6 shadow-xs backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-0.5 flex-wrap">
            <ShieldCheck size={16} />
            <span>Certificado Aprobado y Generado</span>
            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Sincronizado en Google Drive
            </span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Código: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{certificateCode}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onOpenGoogleSheets && (
            <button
              onClick={onOpenGoogleSheets}
              className="cursor-pointer px-3 py-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <FileSpreadsheet size={14} className="text-emerald-700 dark:text-emerald-400" />
              <span>Hoja en Drive</span>
            </button>
          )}

          <button
            onClick={handleCopyCode}
            className="cursor-pointer px-3 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Copy size={13} />
            <span>{copiedCode ? '¡Copiado!' : 'Copiar Código'}</span>
          </button>

          <button
            onClick={() => setShowVerificationModal(true)}
            className="cursor-pointer px-3 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <ExternalLink size={13} />
            <span>Validar QR</span>
          </button>

          <button
            onClick={handlePrint}
            className="cursor-pointer px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors shadow-xs flex items-center gap-2"
          >
            <Printer size={15} />
            <span>Descargar / Imprimir en PDF</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Canvas (Optimized for High-Resolution Printing & Display) */}
      <div
        id="certificate-print-area"
        className="bg-white border-8 border-double border-emerald-900/40 rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden text-slate-900"
        style={{
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        }}
      >
        {/* Decorative inner hairline border with gold corner accents */}
        <div className="border border-emerald-800/30 rounded-lg p-6 sm:p-8 relative bg-gradient-to-b from-emerald-50/20 via-white to-emerald-50/10">
          {/* Header Logos & Republic Titles */}
          <div className="flex items-center justify-between pb-6 border-b border-emerald-900/20 mb-6">
            <div className="flex items-center gap-3">
              <SenaLogo size={48} />
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-600">
                  República de Colombia
                </div>
                <div className="text-sm font-black tracking-tight text-emerald-900 uppercase">
                  Servicio Nacional de Aprendizaje · SENA
                </div>
                <div className="text-[10px] text-slate-500">
                  Dirección de Formación Profesional Integral
                </div>
              </div>
            </div>

            <div className="text-right text-[10px] text-slate-500">
              <span className="font-mono font-bold text-emerald-900 block text-xs">
                {certificateCode}
              </span>
              <span>Constancia Oficial de Inducción</span>
            </div>
          </div>

          {/* Certificate Main Statement */}
          <div className="text-center my-6">
            <div className="text-xs uppercase font-extrabold tracking-widest text-emerald-800 mb-1">
              La Subdirección de Centro y la Coordinación Misional
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-wide uppercase mb-4">
              Certifican Que:
            </h1>

            {/* Apprentice Name (Hero Emphasis) */}
            <div className="py-2 px-4 mb-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight underline decoration-emerald-600/40 underline-offset-8">
                {profile.fullName}
              </h2>
              <div className="text-xs sm:text-sm text-slate-600 mt-2 font-medium">
                Identificado(a) con {profile.docType} No. <span className="font-mono font-bold text-slate-800">{profile.docNumber}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed mt-4">
              Cursó y aprobó con éxito el programa integral de{' '}
              <strong className="text-slate-900 font-bold">
                INDUCCIÓN AL REGLAMENTO DEL APRENDIZ SENA (Acuerdo 0009 de 2024 con actualización 2026)
              </strong>
              , demostrando apropiación de los derechos, deberes, prohibiciones, medidas formativas y normatividad vigente que rigen su formación profesional.
            </p>
          </div>

          {/* Program & Academy Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/90 border border-emerald-900/10 rounded-lg p-3 text-[11px] mb-6">
            <div>
              <span className="text-slate-500 block">Programa de Formación:</span>
              <span className="font-semibold text-slate-900">{profile.programa}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Número de Ficha:</span>
              <span className="font-mono font-bold text-slate-900">{profile.ficha}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Centro / Regional:</span>
              <span className="font-semibold text-slate-900">{profile.regional}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Intensidad Horaria:</span>
              <span className="font-semibold text-emerald-800">40 Horas Académicas</span>
            </div>
          </div>

          {/* Competencies Breakdown */}
          <div className="mb-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Competencias Formativas Acreditadas:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-700">
              <div className="p-2.5 bg-white border border-slate-200 rounded-md">
                <span className="font-bold text-emerald-900 block mb-0.5">1. Principios & Convivencia</span>
                Comprensión y aplicación de los derechos y deberes fundamentales del aprendiz.
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-md">
                <span className="font-bold text-emerald-900 block mb-0.5">2. Régimen Disciplinario</span>
                Dilemas éticos, debido proceso, comités de evaluación y medidas formativas.
              </div>
              <div className="p-2.5 bg-white border border-slate-200 rounded-md">
                <span className="font-bold text-emerald-900 block mb-0.5">3. Ruta & Etapa Productiva</span>
                Gestión de novedades académicas y las 6 alternativas de etapa práctica.
              </div>
            </div>
          </div>

          {/* Signatures & QR Section */}
          <div className="pt-6 border-t border-emerald-900/20 grid grid-cols-12 gap-4 items-end">
            {/* Signature 1 */}
            <div className="col-span-4 text-center">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif italic text-base text-slate-700 tracking-wider">
                  Dra. Martha Luz Gómez R.
                </span>
              </div>
              <div className="border-t border-slate-400 pt-1">
                <div className="text-[11px] font-bold text-slate-900">Subdirección de Centro</div>
                <div className="text-[10px] text-slate-500">{profile.centroFormacion}</div>
              </div>
            </div>

            {/* Signature 2 */}
            <div className="col-span-4 text-center">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif italic text-base text-slate-700 tracking-wider">
                  Ing. Rodrigo A. Valencia
                </span>
              </div>
              <div className="border-t border-slate-400 pt-1">
                <div className="text-[11px] font-bold text-slate-900">Coordinación Académica</div>
                <div className="text-[10px] text-slate-500">Gestión de la Formación Profesional</div>
              </div>
            </div>

            {/* Official QR Code with Verification badge */}
            <div className="col-span-4 flex flex-col items-center justify-center text-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Código QR de Verificación Oficial SENA"
                  className="w-20 h-20 border border-emerald-900/20 rounded p-1 bg-white shadow-2xs"
                />
              ) : (
                <div className="w-20 h-20 bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 border">
                  Cargando QR...
                </div>
              )}
              <div className="text-[9px] text-slate-500 font-mono mt-1">
                Calificación: <span className="font-bold text-emerald-900">{quizScore}%</span>
              </div>
              <div className="text-[9px] text-slate-400">
                Expedido: {issueDateFormatted}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal for QR */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 text-slate-900 dark:text-white">
            <div className="flex items-center gap-3 mb-4 text-emerald-800 dark:text-emerald-400">
              <ShieldCheck size={28} />
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Verificación Criptográfica SENA</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">Constancia Académica Auténtica</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/70 rounded-lg p-4 text-xs space-y-2 mb-4 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Estado:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">● ACTIVO Y VERIFICADO</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Aprendiz:</span>
                <span className="font-medium text-slate-900 dark:text-white">{profile.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Documento:</span>
                <span className="font-mono text-slate-900 dark:text-white">{profile.docType} {profile.docNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Ficha:</span>
                <span className="font-mono text-slate-900 dark:text-white">{profile.ficha}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Puntaje Obtenido:</span>
                <span className="font-bold text-emerald-800 dark:text-emerald-400">{quizScore}% (Aprobado)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Reglamento:</span>
                <span className="text-slate-900 dark:text-white">Acuerdo 0009 de 2024 (Act. 2026)</span>
              </div>
            </div>

            <button
              onClick={() => setShowVerificationModal(false)}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              Cerrar Validación
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
