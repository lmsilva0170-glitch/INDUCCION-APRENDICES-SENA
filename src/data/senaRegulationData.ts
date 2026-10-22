import { ModuleData, QuizQuestion, RegulationArticle } from '../types/induction';

export const EMPTY_APPRENTICE_PROFILE = {
  fullName: '',
  docType: 'CC' as const,
  docNumber: '',
  ficha: '',
  programa: '',
  nivelFormacion: 'Tecnólogo' as const,
  centroFormacion: '',
  regional: 'Regional Distrito Capital',
  modalidad: 'Presencial' as const,
};

export const DEFAULT_PROFILE = {
  fullName: 'Carlos Eduardo Ramírez Peña',
  docType: 'CC' as const,
  docNumber: '1025894120',
  ficha: '2874910',
  programa: 'Análisis y Desarrollo de Software (ADSO)',
  nivelFormacion: 'Tecnólogo' as const,
  centroFormacion: 'Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)',
  regional: 'Regional Distrito Capital',
  modalidad: 'Presencial' as const,
};

export const DEFAULT_INSTRUCTOR_PROFILE = {
  fullName: 'Luz Marina Silva Torres',
  cargo: 'Instructora Líder de Formación e Inducción',
  correo: 'lmsilva0170@gmail.com',
  centroFormacion: 'Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)',
  regional: 'Regional Distrito Capital',
  fichaPrincipal: '2874910',
};

export const CURRENT_NORMATIVE_REFERENCE =
  'Acuerdo 0009 de 2024 (con actualización 2026 por Acuerdo 002 de 2026)';

export const MODULES_DATA: ModuleData[] = [
  {
    id: 'm1-identidad',
    number: 1,
    title: 'Principios Generales, Identidad y Alcance Institucional',
    capitulo: 'Capítulo I - Principios Generales (Arts. 1 al 6)',
    acuerdoRef: 'Acuerdo 0009 de 2024 (con actualización 2026)',
    summary:
      'Comprende el propósito del SENA, sus valores rectores (honestidad, respeto, compromiso, diligencia y justicia), sus símbolos institucionales y el rol del aprendiz como protagonista activo de su formación profesional integral.',
    badgeName: 'Pionero SENA 2026',
    badgeDescription: 'Comprende la misión institucional, los valores éticos y el rol de la comunidad.',
    badgeIcon: 'Award',
    keyTopics: [
      'Misión: Formación profesional integral para el desarrollo socioeconómico del país.',
      'Valores institucionales: Honestidad, Respeto, Compromiso, Diligencia y Justicia.',
      'Símbolos: Escudo, Bandera, Himno y el Logo-símbolo (camino y proyección al futuro).',
      'El Centro de Convivencia y el ambiente de aprendizaje colaborativo.',
    ],
    articles: [
      {
        article: 'Art. 1',
        title: 'Alcance y Naturaleza del Reglamento',
        content:
          'El Reglamento del Aprendiz SENA se aplica a todas las personas matriculadas en los programas de formación profesional integral en sus diversas modalidades (presencial, virtual, a distancia y combinada). Rige las relaciones formativas, académicas y de convivencia.',
        category: 'principios',
        keyTakeaway: 'Aplica a todos los aprendices del país, independientemente de la modalidad o jornada.',
      },
      {
        article: 'Art. 3',
        title: 'Principios Orientadores',
        content:
          'La formación se fundamenta en la dignidad de la persona humana, la libertad con responsabilidad, la equidad, la solidaridad, el diálogo social y la resolución pacífica de controversias como pilares de la convivencia institucional.',
        category: 'principios',
        keyTakeaway: 'La dignidad y el respeto mutuo son la base innegociable de toda la vida institucional.',
      },
      {
        article: 'Art. 4',
        title: 'El Aprendiz como Protagonista',
        content:
          'Se considera aprendiz a toda persona matriculada en el SENA. Es el artífice de su propio desarrollo personal, técnico y profesional, responsable de mantener una actitud reflexiva, crítica, creativa e innovadora.',
        category: 'principios',
        keyTakeaway: 'El aprendizaje es activo y autónomo; el instructor es un facilitador del conocimiento.',
      },
    ],
    caseDilemma: {
      id: 'case-m1',
      title: 'Dilema de Principios: Colaboración en el Ambiente',
      context:
        'Durante la primera semana de formación técnica, tu equipo debe entregar una propuesta de proyecto formativo. Uno de tus compañeros afirma que "como el SENA es gratuito, no es obligatorio asistir puntualmente ni colaborar si los demás hacen el trabajo".',
      question: '¿Cuál es la postura correcta según los principios orientadores del SENA?',
      options: [
        {
          text: 'Tiene razón, porque al ser educación pública cada quien avanza a su propio ritmo sin compromisos con el equipo.',
          isCorrect: false,
          feedback: 'Incorrecto. La gratuidad no exime de la responsabilidad; el SENA exige compromiso y corresponsabilidad.',
          legalBasis: 'Acuerdo 0009 de 2024, Arts. 3 y 4 (Principios y protagonismo del aprendiz).',
        },
        {
          text: 'La formación profesional integral exige compromiso, diligencia y corresponsabilidad ética en el trabajo en equipo y el aprovechamiento de los recursos públicos.',
          isCorrect: true,
          feedback: '¡Excelente! El aprendiz es artífice de su aprendizaje y asume el deber ético de aportar activamente a su formación y a la de su comunidad.',
          legalBasis: 'Acuerdo 0009 de 2024, Art. 3 y Valores Institucionales de Compromiso y Diligencia.',
        },
        {
          text: 'Deben expulsarlo de inmediato del centro de formación sin escucharlo ni mediar diálogo.',
          isCorrect: false,
          feedback: 'Incorrecto. Antes de cualquier medida disciplinaria, prima el diálogo pedagógico y el debido proceso.',
          legalBasis: 'Acuerdo 0009 de 2024, Art. 3 (Resolución pacífica de controversias).',
        },
      ],
    },
  },
  {
    id: 'm2-derechos',
    number: 2,
    title: 'Derechos del Aprendiz SENA',
    capitulo: 'Capítulo II - Derechos del Aprendiz (Arts. 7 al 11)',
    acuerdoRef: 'Acuerdo 0009 de 2024 (con actualización 2026)',
    summary:
      'Reconoce todas las prerrogativas y garantías que el SENA te confiere: desde recibir inducción y carné institucional, hasta acceso a infraestructura tecnológica, programas de bienestar, representatividad y debido proceso en cualquier actuación.',
    badgeName: 'Defensor de Garantías',
    badgeDescription: 'Domina los derechos de formación, bienestar, representatividad y debido proceso.',
    badgeIcon: 'ShieldCheck',
    keyTopics: [
      'Derecho a recibir una inducción completa al inicio del programa de formación.',
      'Derecho a portar el carné estudiantil institucional y su expedición oportuna.',
      'Acceso a ambientes de aprendizaje, laboratorios, biblioteca física y virtual SENA.',
      'Disfrute de los programas de Bienestar al Aprendiz (salud, deporte, cultura, apoyos).',
      'Garantía inquebrantable al Debido Proceso y la presunción de inocencia.',
      'Derecho a elegir y ser elegido Vocero de Ficha o Representante de Centro.',
    ],
    articles: [
      {
        article: 'Art. 7, Numeral 1',
        title: 'Derecho a la Inducción Integral',
        content:
          'Recibir oportunamente la inducción al ingresar al SENA, la cual incluirá información institucional, tecnológica, de entorno, normatividad, derechos, deberes y la ruta integral de aprendizaje de su programa.',
        category: 'derechos',
        keyTakeaway: 'Esta plataforma interactiva materializa precisamente tu derecho fundamental a la inducción.',
      },
      {
        article: 'Art. 7, Numeral 3',
        title: 'Formación y Fuentes de Conocimiento',
        content:
          'Acceder en condiciones de equidad a los ambientes de aprendizaje, herramientas tecnológicas, conectividad, plataformas LMS (Zajuna) y fuentes de información que faciliten el aprendizaje.',
        category: 'derechos',
        keyTakeaway: 'Tienes derecho al uso adecuado de las instalaciones y tecnologías para tu capacitación.',
      },
      {
        article: 'Art. 7, Numeral 6',
        title: 'Bienestar al Aprendiz',
        content:
          'Ser beneficiario de los planes y programas institucionales de Bienestar al Aprendiz (psicología, salud integral, recreación, arte, cultura, estímulos y monitorías).',
        category: 'derechos',
        keyTakeaway: 'Bienestar es un eje formativo con programas de apoyo socioeconómico y de salud mental.',
      },
      {
        article: 'Art. 7, Numeral 9',
        title: 'Garantía del Debido Proceso',
        content:
          'Ser escuchado en descargos, aportar pruebas, ser notificado por escrito y contar con presunción de inocencia en cualquier queja o proceso de investigación académica o disciplinaria.',
        category: 'derechos',
        keyTakeaway: 'Nadie puede ser sancionado en el SENA sin antes haber sido escuchado y respetado su debido proceso.',
      },
    ],
    caseDilemma: {
      id: 'case-m2',
      title: 'Dilema de Derechos: Apoyo de Bienestar y Debido Proceso',
      context:
        'Mateo, aprendiz de segundo trimestre, está experimentando dificultades emocionales y socioeconómicas complejas que están afectando su concentración en los talleres. Un compañero le dice que en el SENA no hay ayuda para esos temas y que si baja su rendimiento lo expulsarán sin aviso.',
      question: '¿Qué derechos amparan a Mateo según el Reglamento del Aprendiz?',
      options: [
        {
          text: 'No tiene derechos en este caso, pues el SENA es una entidad exclusivamente técnica y no atiende asuntos personales.',
          isCorrect: false,
          feedback: 'Falso. El SENA brinda Formación Profesional Integral, lo cual involucra el ser humano en su totalidad.',
          legalBasis: 'Acuerdo 0009 de 2024, Art. 7 num. 6.',
        },
        {
          text: 'Tiene derecho a acceder a los programas de Bienestar al Aprendiz (apoyo psicosocial, nutricional o estímulos) y, si su rendimiento baja, a un plan de mejoramiento pedagógico con debido proceso.',
          isCorrect: true,
          feedback: '¡Exacto! El aprendiz cuenta con Bienestar al Aprendiz para acompañarlo y, en lo académico, con medidas formativas pedagógicas antes de cualquier sanción.',
          legalBasis: 'Acuerdo 0009 de 2024, Art. 7 (Bienestar y Debido Proceso).',
        },
        {
          text: 'Debe abandonar inmediatamente el programa de formación sin solicitar ninguna asesoría.',
          isCorrect: false,
          feedback: 'Incorrecto. El aprendiz puede solicitar aplazamiento formal o apoyo de bienestar antes de desertar.',
          legalBasis: 'Acuerdo 0009 de 2024, Capítulo IV (Novedades Académicas).',
        },
      ],
    },
  },
  {
    id: 'm3-deberes',
    number: 3,
    title: 'Deberes del Aprendiz SENA',
    capitulo: 'Capítulo III - Deberes y Prohibiciones (Arts. 12 al 17)',
    acuerdoRef: 'Acuerdo 0009 de 2024 (con actualización 2026)',
    summary:
      'Identifica las obligaciones legales, sociales y morales que aseguran una convivencia respetuosa, el cuidado de los recursos públicos, la seguridad industrial y el éxito de tu proceso formativo.',
    badgeName: 'Guardián del Deber',
    badgeDescription: 'Cumple con rigor sus deberes de asistencia, uso de EPP, respeto y cuidado ambiental.',
    badgeIcon: 'CheckCircle2',
    keyTopics: [
      'Cumplir con las actividades y evidencias en los plazos fijados por los instructores.',
      'Portar siempre el carné institucional de manera visible al ingresar y permanecer en el SENA.',
      'Uso obligatorio de Elementos de Protección Personal (EPP) y uniformes según el área técnica.',
      'Cuidar la infraestructura, maquinaria, equipos y redes del centro de formación.',
      'Informar novedades e inasistencias en los términos legales (máx. 3 días hábiles).',
      'Acatar el Plan de Gestión Ambiental (clasificación de residuos, ahorro de agua y energía).',
    ],
    articles: [
      {
        article: 'Art. 12, Numeral 1',
        title: 'Cumplimiento del Plan Formativo',
        content:
          'Cumplir con todas las actividades propias de su proceso de aprendizaje o plan de mejoramiento, asistiendo puntualmente a las sesiones y entregando las evidencias en los plazos previstos en la guía de aprendizaje.',
        category: 'deberes',
        keyTakeaway: 'La puntualidad y entrega oportuna de evidencias reflejan la disciplina laboral requerida.',
      },
      {
        article: 'Art. 12, Numeral 3',
        title: 'Porte del Carné y Presentación Personal',
        content:
          'Portar visiblemente el carné institucional durante su permanencia en las instalaciones del SENA o cuando represente a la entidad, así como la indumentaria y elementos de seguridad industrial requeridos.',
        category: 'deberes',
        keyTakeaway: 'El carné te identifica como aprendiz activo y es obligatorio por seguridad de toda la comunidad.',
      },
      {
        article: 'Art. 12, Numeral 7',
        title: 'Cuidado de Infraestructura y Equipos',
        content:
          'Cuidar y hacer uso responsable de las instalaciones, maquinaria, herramientas, mobiliario y recursos tecnológicos puestos a su disposición, reportando averías de inmediato.',
        category: 'deberes',
        keyTakeaway: 'Los talleres y laboratorios son bienes públicos al servicio de las presentes y futuras generaciones.',
      },
      {
        article: 'Art. 12, Numeral 10',
        title: 'Justificación Oportuna de Inasistencias',
        content:
          'Informar oportunamente al instructor sobre novedades, solicitudes o inasistencias, presentando los soportes respectivos (médicos, laborales o de fuerza mayor) dentro de los tres (3) días hábiles siguientes.',
        category: 'deberes',
        keyTakeaway: 'Tienes máximo 3 días hábiles para radicar tus justificaciones con soportes verificables.',
      },
    ],
    caseDilemma: {
      id: 'case-m3',
      title: 'Dilema de Deberes: Inasistencia por Causa de Fuerza Mayor',
      context:
        'Lucía no pudo asistir a clase durante dos días consecutivos debido a un cuadro de salud que requirió atención de urgencias y reposo médico certificado por su EPS.',
      question: '¿Cuál es el procedimiento y plazo que debe cumplir Lucía según el reglamento actualizado?',
      options: [
        {
          text: 'No necesita hacer nada; cuando vuelva el mes siguiente le explica verbalmente al instructor.',
          isCorrect: false,
          feedback: 'Incorrecto. Dejar pasar el tiempo sin soporte genera reporte de inasistencia injustificada y posible deserción.',
          legalBasis: 'Acuerdo 0009 de 2024, Art. 12 num. 10 y trámite de deserción.',
        },
        {
          text: 'Debe presentar la justificación por escrito con la incapacidad médica original al instructor y coordinación dentro de los tres (3) días hábiles siguientes a su reintegro.',
          isCorrect: true,
          feedback: '¡Exacto! El reglamento fija 3 días hábiles para soportar ausencias y acordar la entrega de evidencias pendientes.',
          legalBasis: 'Acuerdo 0009 de 2024, Art. 12 num. 10 (Justificación oportuna de inasistencias).',
        },
        {
          text: 'Pedirle a un amigo que falsifique la firma del médico para que la fecha coincida exactamente.',
          isCorrect: false,
          feedback: '¡Peligro! Falsificar documentos es una falta gravísima que conduce a la cancelación inmediata de matrícula.',
          legalBasis: 'Acuerdo 0009 de 2024, Art. 15 (Prohibiciones) y Régimen Sancionatorio.',
        },
      ],
    },
  },
  {
    id: 'm4-prohibiciones',
    number: 4,
    title: 'Prohibiciones y Límites de la Convivencia',
    capitulo: 'Capítulo III - Deberes y Prohibiciones (Arts. 14 al 17)',
    acuerdoRef: 'Acuerdo 0009 de 2024 (con actualización 2026)',
    summary:
      'Conoce las conductas expresamente vetadas en el SENA para proteger la integridad física, moral y académica de la comunidad. El fraude, el plagio y las sustancias ilícitas son incompatibles con el perfil del aprendiz.',
    badgeName: 'Líder de Integridad',
    badgeDescription: 'Comprende la ética académica, prevención del plagio y normas de seguridad comunitaria.',
    badgeIcon: 'AlertTriangle',
    keyTopics: [
      'Prohibición tajante de plagio, copia, compra o suplantación en evidencias de aprendizaje.',
      'Prohibición de ingresar bajo efectos o consumir alcohol o sustancias psicoactivas.',
      'Prohibición de ingresar armas u objetos peligrosos al centro o actividades formativas.',
      'Cero tolerancia ante violencia física, verbal, acoso escolar, sexual o discriminación.',
      'Prohibición de comercializar productos o realizar rifas no autorizadas en el Centro.',
      'Prohibición del uso indebido o no autorizado de la marca, insignias y documentos del SENA.',
    ],
    articles: [
      {
        article: 'Art. 15, Numeral 2',
        title: 'Fraude y Plagio Académico',
        content:
          'Plagiar, copiar, comercializar o presentar como propios trabajos, investigaciones, códigos fuente o evidencias elaboradas por otras personas o mediante uso deshonesto de herramientas sin la debida citación y autoría.',
        category: 'prohibiciones',
        keyTakeaway: 'Toda fuente o herramienta debe ser referenciada; el plagio anula la evidencia y genera proceso disciplinario.',
      },
      {
        article: 'Art. 15, Numeral 4',
        title: 'Sustancias Psicoactivas y Alcohol',
        content:
          'Ingresar, comercializar, portar o consumir bebidas embriagantes o sustancias psicoactivas dentro de las instalaciones del SENA o en actividades donde se represente a la institución.',
        category: 'prohibiciones',
        keyTakeaway: 'El ambiente de formación debe permanecer 100% libre de alcohol y sustancias ilícitas.',
      },
      {
        article: 'Art. 15, Numeral 8',
        title: 'Agresión, Acoso y Discriminación',
        content:
          'Incurrir en actos de agresión física, verbal, psicológica, ciberacoso o cualquier manifestación de discriminación por motivos de etnia, género, orientación sexual, religión u opinión política.',
        category: 'prohibiciones',
        keyTakeaway: 'El respeto absoluto a la diversidad humana es un principio rector incondicional.',
      },
    ],
    caseDilemma: {
      id: 'case-m4',
      title: 'Dilema de Prohibiciones: Proyecto y Autoría Intelectual',
      context:
        'Para la evidencia final de una competencia, Daniel encuentra en internet un proyecto terminado idéntico al solicitado. Su plan es cambiarle el nombre y la carátula y subirlo a la plataforma Zajuna como si fuera propio para ganar tiempo.',
      question: '¿Qué implicaciones tiene esta conducta según el Acuerdo 0009 de 2024?',
      options: [
        {
          text: 'Es una práctica permitida si el proyecto original era de código libre o estaba en internet sin clave.',
          isCorrect: false,
          feedback: 'Falso. Aunque sea público, atribuirse la autoría de un trabajo ajeno constituye plagio y fraude.',
          legalBasis: 'Acuerdo 0009 de 2024, Art. 15 num. 2.',
        },
        {
          text: 'Constituye una prohibición expresa de fraude y plagio, calificada como falta que amerita reprobación de la evidencia y apertura de investigación en el Comité de Evaluación.',
          isCorrect: true,
          feedback: '¡Exacto! El fraude académico atenta contra la ética profesional y conlleva consecuencias disciplinarias que pueden condicionar o cancelar la matrícula.',
          legalBasis: 'Acuerdo 0009 de 2024, Art. 15 num. 2 y Capítulo V.',
        },
        {
          text: 'Solo es falta si el autor original del archivo viene en persona al Centro a presentar una queja formal.',
          isCorrect: false,
          feedback: 'Incorrecto. El instructor y la coordinación pueden iniciar el proceso de oficio tan pronto detecten el plagio.',
          legalBasis: 'Acuerdo 0009 de 2024, Capítulo V (Régimen de Faltas).',
        },
      ],
    },
  },
  {
    id: 'm5-disciplinario',
    number: 5,
    title: 'Comité con Voz y Voto, Medidas y Etapa Productiva (Actualización 2026)',
    capitulo: 'Capítulos IV y V - Etapas y Régimen Disciplinario (Arts. 18 al 53)',
    acuerdoRef: 'Acuerdo 0009 de 2024 (Modificado por Acuerdo 002 de 2026 en Art. 48)',
    summary:
      'Comprende las novedades de 2026: el representante de los aprendices en el Comité de Evaluación cuenta ahora con voz y voto (Acuerdo 002 de 2026); medidas formativas pedagógicas vs sanciones; y las condiciones de etapa práctica (Decreto 223 de 2026).',
    badgeName: 'Magíster de la Ruta Formativa 2026',
    badgeDescription: 'Domina el proceso disciplinario, comités de evaluación y alternativas de etapa productiva.',
    badgeIcon: 'Scale',
    keyTopics: [
      'Actualización 2026 (Acuerdo 002 de 2026): El Representante de los Aprendices tiene voz y voto en el Comité de Evaluación.',
      'Clasificación de las faltas: Académicas y Disciplinarias (leves, graves o gravísimas).',
      'Medidas formativas pedagógicas: Llamado de atención verbal y Plan de Mejoramiento concertado.',
      'Sanciones disciplinarias: Llamado de atención escrito, Condicionamiento de matrícula y Cancelación de matrícula.',
      'Etapa Productiva (Decreto 223 de 2026 y Cap. IV): Contrato de aprendizaje, vínculo laboral, proyectos, pasantías y monitorías.',
      'Trámites académicos: Traslado, Aplazamiento (hasta por 6 meses prorrogables), Reingreso y Retiro Voluntario.',
    ],
    articles: [
      {
        article: 'Art. 48 (Modificado 2026)',
        title: 'Comité de Evaluación y Seguimiento con Voz y Voto',
        content:
          'El Comité de Evaluación y Seguimiento es el órgano consultor de la Subdirección de Centro. Con la reforma del Acuerdo 002 de 2026, el Representante de los Aprendices participa activamente con derecho a voz y voto en la valoración de los casos académicos y disciplinarios.',
        category: 'disciplinario',
        keyTakeaway: '¡Hito 2026! Los aprendices ahora tienen voto directo en las decisiones colegiadas del Comité.',
      },
      {
        article: 'Art. 39 & 40',
        title: 'Medidas Formativas Pedagógicas vs. Sanciones',
        content:
          'Las medidas formativas tienen carácter pedagógico y preventivo (Plan de Mejoramiento concertado). Las sanciones disciplinarias se aplican tras el debido proceso en faltas graves o gravísimas e implican registro en la hoja de vida.',
        category: 'disciplinario',
        keyTakeaway: 'El SENA prioriza la pedagogía; la sanción es el último recurso ante la reincidencia o faltas graves.',
      },
      {
        article: 'Art. 22 & Decreto 223/2026',
        title: 'Alternativas de Etapa Productiva',
        content:
          'La etapa práctica puede desarrollarse a través de: 1. Contrato de aprendizaje, 2. Vínculo laboral, 3. Participación en proyectos productivos en el SENA, 4. Pasantías en empresas, ONGs o entidades públicas, 5. Monitorías académicas, o 6. Apoyo a unidades familiares.',
        category: 'etapas',
        keyTakeaway: 'Existen 6 vías legales para validar tu etapa práctica; el contrato de aprendizaje es solo una de ellas.',
      },
    ],
    caseDilemma: {
      id: 'case-m5',
      title: 'Dilema de Comité 2026: Participación Estudiantil y Plan de Mejoramiento',
      context:
        'Un aprendiz asiste a audiencia ante el Comité de Evaluación y Seguimiento por dificultades en el logro de competencias. El representante de los aprendices propone un Plan de Mejoramiento Pedagógico en lugar de una sanción formal.',
      question: '¿Qué peso tiene la participación del Representante de Aprendices según la reforma del Acuerdo 002 de 2026?',
      options: [
        {
          text: 'Solo puede escuchar sin hablar ni votar, pues los aprendices no tienen peso legal en el Comité.',
          isCorrect: false,
          feedback: 'Falso. Con la actualización de 2026 (Acuerdo 002 de 2026 que modifica el Art. 48), el Representante participa con voz y voto.',
          legalBasis: 'Acuerdo 002 de 2026 que modificó el Art. 48 del Acuerdo 0009 de 2024.',
        },
        {
          text: 'Tiene derecho a voz y voto pleno dentro del Comité para deliberar, defender el debido proceso y votar las recomendaciones de medidas formativas.',
          isCorrect: true,
          feedback: '¡Exacto! La reforma de 2026 garantiza una representación estudiantil vinculante con voz y voto en las decisiones del Comité.',
          legalBasis: 'Acuerdo 002 de 2026 (Modificación del Art. 48 del Reglamento del Aprendiz).',
        },
        {
          text: 'El Comité está prohibido en el SENA desde el año 2024.',
          isCorrect: false,
          feedback: 'Incorrecto. El Comité sigue siendo el pilar de seguimiento y garantía del debido proceso.',
          legalBasis: 'Acuerdo 0009 de 2024, Capítulo V.',
        },
      ],
    },
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: 'Derechos',
    situation:
      'Un aprendiz solicita ingresar a la biblioteca y a los talleres de robótica fuera del horario de su clase para profundizar en su proyecto de grado.',
    question: 'De acuerdo con el Reglamento del Aprendiz (Acuerdo 0009 de 2024), ¿tiene derecho a utilizar estos ambientes?',
    options: [
      'No, porque los ambientes solo pueden usarse durante las horas exactas de clase programadas.',
      'Sí, tiene derecho a acceder a las fuentes de conocimiento, ambientes de aprendizaje y tecnologías, previa coordinación y disponibilidad de las instalaciones.',
      'Solo si realiza un pago adicional por cada hora de uso de laboratorio.',
      'No, a menos que sea el representante general de todos los aprendices del centro.',
    ],
    correctIndex: 1,
    explanation:
      'El Capítulo II (Derechos del Aprendiz) consagra el acceso a fuentes de conocimiento, ambientes y herramientas tecnológicas institucionales para apoyar el aprendizaje.',
    articleRef: 'Acuerdo 0009 de 2024, Capítulo II, Art. 7 (Derechos del Aprendiz).',
  },
  {
    id: 2,
    category: 'Deberes',
    situation:
      'Al ingresar a la sede del Centro de Formación, el personal de seguridad solicita al aprendiz presentar su identificación institucional.',
    question: '¿Cuál es el deber del aprendiz frente al porte del carné según el reglamento?',
    options: [
      'Puede guardarlo en la maleta y mostrar una foto borrosa en el celular.',
      'Es su deber portarlo visiblemente durante toda su permanencia en las instalaciones o cuando represente a la institución.',
      'Solo es obligatorio para los aprendices de jornada nocturna.',
      'No es necesario portarlo si el instructor del taller ya lo conoce de vista.',
    ],
    correctIndex: 1,
    explanation:
      'Portar visiblemente el carné institucional es un deber ineludible de seguridad y convivencia consagrado en el Capítulo III de Deberes.',
    articleRef: 'Acuerdo 0009 de 2024, Capítulo III, Art. 12 (Deberes del Aprendiz).',
  },
  {
    id: 3,
    category: 'Deberes',
    situation:
      'Un aprendiz de un área industrial olvida llevar sus botas con puntera de seguridad y gafas de protección personal (EPP) al taller de mecanizado.',
    question: '¿Qué debe ocurrir según las normas de seguridad y deberes del aprendiz?',
    options: [
      'El aprendiz no puede realizar actividades prácticas de riesgo en el ambiente sin sus EPP reglamentarios, pues es deber velar por la seguridad integral.',
      'El instructor debe permitirle trabajar descalzo o en tenis bajo su propio riesgo.',
      'Se le aplica una multa en dinero para comprar unos nuevos inmediatamente.',
      'Puede pedirle a un compañero que meta las manos por él mientras mira.',
    ],
    correctIndex: 0,
    explanation:
      'El uso de Elementos de Protección Personal (EPP) es obligatorio y parte esencial de la formación para la seguridad y salud en el trabajo.',
    articleRef: 'Acuerdo 0009 de 2024, Capítulo III (Seguridad y Salud en el Trabajo).',
  },
  {
    id: 4,
    category: 'Prohibiciones',
    situation:
      'Un grupo de aprendices decide organizar una rifa clandestina dentro del Centro de Formación y vender boletas a instructores y compañeros sin autorización.',
    question: '¿Esta conducta está contemplada en el régimen de prohibiciones?',
    options: [
      'Está permitida siempre y cuando los fondos sean para una fiesta de graduación.',
      'Sí, está expresamente prohibido comercializar productos o realizar rifas no autorizadas por la Subdirección de Centro dentro de las instalaciones.',
      'Está permitida si el valor de la boleta es menor a 5.000 pesos.',
      'Solo está prohibida si no pagan impuestos a la biblioteca.',
    ],
    correctIndex: 1,
    explanation:
      'El Capítulo III (Prohibiciones) prohíbe expresamente cualquier tipo de comercio, rifa o actividad lucrativa particular no autorizada en los predios de la entidad.',
    articleRef: 'Acuerdo 0009 de 2024, Capítulo III, Art. 15 (Prohibiciones al Aprendiz).',
  },
  {
    id: 5,
    category: 'Faltas y Sanciones',
    situation:
      'Un aprendiz acumula tres inasistencias injustificadas continuas en su proceso formativo presencial sin haber enviado soporte médico ni justificación.',
    question: '¿Qué procedimiento institucional se activa ante este hecho?',
    options: [
      'Se le inicia trámite de deserción del proceso formativo, notificándolo formalmente para que justifique su ausencia dentro de los términos normativos.',
      'Se le expulsa inmediatamente sin darle oportunidad de responder.',
      'El SENA le envía la policía a su domicilio.',
      'Se traslada automáticamente a otro centro sin consultarle.',
    ],
    correctIndex: 0,
    explanation:
      'El proceso de deserción requiere que el SENA envíe una comunicación al aprendiz otorgándole un término legal para justificar su inasistencia antes de formalizar la deserción.',
    articleRef: 'Acuerdo 0009 de 2024, Capítulo IV (Novedades y Deserción).',
  },
  {
    id: 6,
    category: 'Faltas y Sanciones',
    situation:
      'En el año 2026, un aprendiz es citado al Comité de Evaluación y Seguimiento. El Representante de los Aprendices asiste a la sesión.',
    question: 'Con la actualización del Acuerdo 002 de 2026 al artículo 48 del reglamento, ¿cuál es la facultad del Representante?',
    options: [
      'Participa en las deliberaciones del Comité con derecho pleno a voz y voto.',
      'Solo puede estar de observador en silencio sin emitir opinión ni votar.',
      'Tiene que salir de la sala antes de que empiece la deliberación.',
      'Debe actuar como juez único del caso.',
    ],
    correctIndex: 0,
    explanation:
      'El Acuerdo 002 de 2026 reformó el artículo 48 del Acuerdo 0009 de 2024, estableciendo la participación del Representante de Aprendices con voz y voto en el Comité.',
    articleRef: 'Acuerdo 002 de 2026 (Modificación al Art. 48 del Acuerdo 0009 de 2024).',
  },
  {
    id: 7,
    category: 'Faltas y Sanciones',
    situation:
      'Frente a una falta disciplinaria calificada como grave, se evaluó que el aprendiz no tenía antecedentes y mostró voluntad de reparar el daño.',
    question: '¿Qué sanción disciplinaria contempla el reglamento para este tipo de situaciones tras el debido proceso?',
    options: [
      'Encarcelamiento preventivo en el centro de formación.',
      'Llamado de atención por escrito con copia a su hoja de vida o condicionamiento de matrícula, según la recomendación del Comité.',
      'Prohibición de volver a estudiar en cualquier universidad de por vida.',
      'Pérdida de la cédula de ciudadanía.',
    ],
    correctIndex: 1,
    explanation:
      'Las sanciones disciplinarias formales son: Llamado de atención por escrito, Condicionamiento de matrícula y Cancelación de matrícula.',
    articleRef: 'Acuerdo 0009 de 2024, Capítulo V (Medidas Disciplinarias y Sancionatorias).',
  },
  {
    id: 8,
    category: 'Etapa Productiva',
    situation:
      'Una aprendiz está por culminar su etapa lectiva y desea conocer sus opciones de etapa productiva bajo las normativas actuales (Capítulo IV y Decreto 223 de 2026).',
    question: '¿Cuál de las siguientes es una alternativa oficial según el reglamento?',
    options: [
      'Únicamente el Contrato de Aprendizaje; no existe ninguna otra opción legal.',
      'Contrato de aprendizaje, vínculo laboral, proyecto productivo institucional, pasantía en empresa/ONG, monitoría o apoyo a unidad familiar.',
      'Pagar una mensualidad a un instructor para que le firme el paz y salvo.',
      'Hacer compras personales para la administración del centro.',
    ],
    correctIndex: 1,
    explanation:
      'El Reglamento contempla 6 modalidades alternativas para la Etapa Productiva, brindando flexibilidad y pertinencia según el perfil del programa.',
    articleRef: 'Acuerdo 0009 de 2024, Capítulo IV (Alternativas de Etapa Productiva y Decreto 223 de 2026).',
  },
  {
    id: 9,
    category: 'Deberes',
    situation:
      'Un aprendiz necesita ausentarse durante dos meses de su programa de formación debido a una cirugía programada y posterior rehabilitación.',
    question: '¿Qué trámite académico debe solicitar oportunamente para no perder su cupo?',
    options: [
      'Debe solicitar formalmente el Aplazamiento de su formación por el tiempo requerido con sus respectivos soportes médicos.',
      'Simplemente dejar de asistir y volver cuando se recupere sin avisar a nadie.',
      'Renunciar a sus derechos ciudadanos.',
      'Pedirle a su hermano que asista a clases suplantándolo.',
    ],
    correctIndex: 0,
    explanation:
      'El Aplazamiento es la novedad académica mediante la cual el aprendiz solicita la suspensión temporal de su formación por motivos justificados (salud, servicio militar, etc.).',
    articleRef: 'Acuerdo 0009 de 2024, Capítulo IV (Novedades Académicas: Aplazamiento).',
  },
  {
    id: 10,
    category: 'Derechos',
    situation:
      'Los aprendices de una nueva ficha desean elegir a su representante para que transmita sus inquietudes ante el equipo de instructores y el Comité.',
    question: '¿Qué figura de representación estudiantil corresponde elegir al interior de la ficha?',
    options: [
      'El Auditor Fiscal de la Sede.',
      'El Vocero de Ficha (y su suplente), elegido de manera democrática entre sus compañeros de grupo.',
      'El Gerente del SENA regional.',
      'No se permite tener representantes estudiantiles.',
    ],
    correctIndex: 1,
    explanation:
      'Cada ficha o grupo de aprendizaje tiene derecho a elegir democráticamente a su Vocero de Ficha para actuar como puente constructivo de diálogo institucional.',
    articleRef: 'Acuerdo 0009 de 2024, Capítulo II (De la Representatividad de los Aprendices).',
  },
];

export const GLOSSARY_ITEMS = [
  {
    term: 'Acuerdo 0009 de 2024 (con Act. 2026)',
    category: 'Normativa',
    definition:
      'Reglamento del Aprendiz SENA vigente (adoptado por el Consejo Directivo Nacional y publicado en Diario Oficial No. 52.947). Derogó el Acuerdo 07 de 2012 y 02 de 2014. Cuenta con la actualización del Acuerdo 002 de 2026 (voto del representante estudiantil en comités) y articulación con el Decreto 223 de 2026 del Ministerio de Trabajo.',
  },
  {
    term: 'Acuerdo 002 de 2026',
    category: 'Normativa',
    definition:
      'Acto normativo de marzo de 2026 que modificó el artículo 48 del Acuerdo 0009 de 2024, otorgándole al Representante de los Aprendices participación con VOZ Y VOTO en el Comité de Evaluación y Seguimiento.',
  },
  {
    term: 'Decreto 223 de 2026',
    category: 'Etapa Productiva',
    definition:
      'Norma expedida por el Gobierno Nacional / Ministerio del Trabajo que redefine las garantías, supervisión, seguridad social y condiciones de las empresas como escenarios de práctica para los aprendices en etapa productiva.',
  },
  {
    term: 'Aprendiz SENA',
    category: 'Identidad',
    definition:
      'Toda persona matriculada en los programas de formación profesional integral en cualquier modalidad o nivel (operario, técnico, tecnólogo, especialización). Es el protagonista activo y autónomo de su propio proceso formativo.',
  },
  {
    term: 'Ambiente de Aprendizaje',
    category: 'Infraestructura',
    definition:
      'Espacio físico, virtual o combinado donde concurren los aprendices, instructores, recursos didácticos, maquinaria, herramientas y fuentes de información para la construcción de competencias.',
  },
  {
    term: 'Bienestar al Aprendiz',
    category: 'Derechos',
    definition:
      'Conjunto de programas, actividades y servicios orientados a promover el desarrollo humano integral del aprendiz en dimensiones como salud, deporte, arte, cultura, liderazgo, orientación psicológica y apoyos de sostenimiento.',
  },
  {
    term: 'Comité de Evaluación y Seguimiento',
    category: 'Régimen Disciplinario',
    definition:
      'Órgano colegiado del Centro de Formación encargado de evaluar el desempeño académico y disciplinario de los aprendices en casos complejos, garantizando el debido proceso. Tras el Acuerdo 002 de 2026, el representante de los aprendices cuenta con voz y voto pleno.',
  },
  {
    term: 'Condicionamiento de Matrícula',
    category: 'Sanciones',
    definition:
      'Sanción disciplinaria que coloca en estado de observación formal la continuidad del aprendiz en la entidad por haber incurrido en faltas graves o reincidencia, con compromiso explícito de no repetición.',
  },
  {
    term: 'Cancelación de Matrícula',
    category: 'Sanciones',
    definition:
      'Máxima sanción disciplinaria impuesta por la Subdirección de Centro ante faltas gravísimas o incumplimiento de condicionamientos previos. Conlleva la desvinculación del programa e inhabilidad temporal para ingresar al SENA (de 6 meses a 2 años).',
  },
  {
    term: 'Contrato de Aprendizaje',
    category: 'Etapa Productiva',
    definition:
      'Forma especial dentro del derecho laboral mediante la cual una empresa patrocinadora vincula a un aprendiz SENA brindándole un apoyo de sostenimiento mensual y afiliación a seguridad social bajo las directrices del Decreto 223 de 2026.',
  },
  {
    term: 'Debido Proceso',
    category: 'Derechos',
    definition:
      'Garantía constitucional y reglamentaria que asegura que todo aprendiz investigado tenga conocimiento formal de los cargos, goce de presunción de inocencia, tenga oportunidad de rendir descargos, aportar pruebas y recurrir las decisiones.',
  },
  {
    term: 'Plan de Mejoramiento',
    category: 'Medidas Formativas',
    definition:
      'Medida de carácter estrictamente pedagógico y formativo acordada entre el instructor y el aprendiz para superar dificultades académicas o corregir comportamientos menores, definiendo actividades y plazos claros.',
  },
  {
    term: 'Vocero de Ficha',
    category: 'Representatividad',
    definition:
      'Aprendiz elegido democráticamente por sus compañeros de grupo para actuar como interlocutor propositivo entre el grupo de aprendices, los instructores y las directivas del centro de formación.',
  },
];
