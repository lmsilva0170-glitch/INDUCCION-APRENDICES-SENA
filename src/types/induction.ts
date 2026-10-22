export type UserRole = 'aprendiz' | 'instructor';

export interface InstructorProfile {
  fullName: string;
  cargo: string;
  correo: string;
  centroFormacion: string;
  regional: string;
  fichaPrincipal?: string;
}

export interface AprendizProfile {
  fullName: string;
  docType: 'CC' | 'TI' | 'CE' | 'PEP' | 'PPT';
  docNumber: string;
  ficha: string;
  programa: string;
  nivelFormacion: 'Tecnólogo' | 'Técnico' | 'Operario' | 'Especialización Tecnológica';
  centroFormacion: string;
  regional: string;
  modalidad: 'Presencial' | 'Virtual' | 'A Distancia';
}

export interface RegulationArticle {
  article: string;
  title: string;
  content: string;
  category: 'principios' | 'derechos' | 'deberes' | 'prohibiciones' | 'disciplinario' | 'etapas';
  keyTakeaway: string;
}

export interface CaseDilemmaOption {
  text: string;
  isCorrect: boolean;
  feedback: string;
  legalBasis: string;
}

export interface InteractiveCase {
  id: string;
  title: string;
  context: string;
  question: string;
  options: CaseDilemmaOption[];
}

export interface ModuleData {
  id: string;
  number: number;
  title: string;
  capitulo: string;
  acuerdoRef: string;
  summary: string;
  badgeName: string;
  badgeDescription: string;
  badgeIcon: string;
  keyTopics: string[];
  articles: RegulationArticle[];
  caseDilemma: InteractiveCase;
}

export interface QuizQuestion {
  id: number;
  category: 'Derechos' | 'Deberes' | 'Prohibiciones' | 'Faltas y Sanciones' | 'Etapa Productiva';
  situation: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  articleRef: string;
}

export interface ProgressState {
  profile: AprendizProfile;
  completedModuleIds: string[];
  moduleCaseAnswered: Record<string, number>; // moduleId -> selected option index
  quizAnswers: Record<number, number>; // questionId -> selected option index
  quizCompleted: boolean;
  quizScore: number; // 0 to 100
  certificateCode: string;
  completedAt: string | null;
}
