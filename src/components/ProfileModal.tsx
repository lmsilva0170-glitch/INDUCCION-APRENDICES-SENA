import React, { useState, useEffect } from 'react';
import { X, User, Check } from 'lucide-react';
import { AprendizProfile } from '../types/induction';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AprendizProfile;
  onSaveProfile: (updated: AprendizProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<AprendizProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData(profile);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-lg">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Datos del Aprendiz SENA</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Estos datos se reflejarán oficialmente en tu certificado de inducción.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nombres y Apellidos Completos *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ej. Carlos Eduardo Ramírez Peña"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tipo Doc.
              </label>
              <select
                value={formData.docType}
                onChange={(e) =>
                  setFormData({ ...formData, docType: e.target.value as AprendizProfile['docType'] })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="CC">C.C.</option>
                <option value="TI">T.I.</option>
                <option value="CE">C.E.</option>
                <option value="PEP">PEP</option>
                <option value="PPT">PPT</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Número de Documento *
              </label>
              <input
                type="text"
                required
                value={formData.docNumber}
                onChange={(e) => setFormData({ ...formData, docNumber: e.target.value })}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="1025894120"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Número de Ficha *
              </label>
              <input
                type="text"
                required
                value={formData.ficha}
                onChange={(e) => setFormData({ ...formData, ficha: e.target.value })}
                className="w-full px-3 py-2 text-sm font-mono border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="2874910"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nivel de Formación
              </label>
              <select
                value={formData.nivelFormacion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nivelFormacion: e.target.value as AprendizProfile['nivelFormacion'],
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Tecnólogo">Tecnólogo</option>
                <option value="Técnico">Técnico</option>
                <option value="Operario">Operario</option>
                <option value="Especialización Tecnológica">Especialización</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Programa de Formación *
            </label>
            <input
              type="text"
              required
              value={formData.programa}
              onChange={(e) => setFormData({ ...formData, programa: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ej. Análisis y Desarrollo de Software (ADSO)"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Centro de Formación *
            </label>
            <input
              type="text"
              required
              value={formData.centroFormacion}
              onChange={(e) => setFormData({ ...formData, centroFormacion: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ej. Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Regional
              </label>
              <input
                type="text"
                value={formData.regional}
                onChange={(e) => setFormData({ ...formData, regional: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ej. Regional Distrito Capital"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Modalidad
              </label>
              <select
                value={formData.modalidad}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    modalidad: e.target.value as AprendizProfile['modalidad'],
                  })
                }
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Presencial">Presencial</option>
                <option value="Virtual">Virtual</option>
                <option value="A Distancia">A Distancia</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check size={14} />
                  <span>Guardado</span>
                </>
              ) : (
                <span>Guardar Cambios</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
