import { AprendizProfile } from '../types/induction';
import { getAccessToken } from './googleAuth';
import {
  appendApprenticeRecord,
  getStoredSpreadsheetId,
  setStoredSpreadsheetId,
} from './googleSheetsService';

const QUEUE_STORAGE_KEY = 'sena_induction_sync_queue_v1';
const RECORDS_STORAGE_KEY = 'sena_induction_synced_records_v1';
const WEBHOOK_STORAGE_KEY = 'sena_induction_apps_script_webhook_v1';
const LAST_SYNC_KEY = 'sena_induction_last_sync_timestamp';

// Default pre-provisioned or referenced Sheet ID for induction
const DEFAULT_FALLBACK_SHEET_ID = '1-sena-induccion-acuerdo-0009-registro';

export interface SyncedApprenticeRecord {
  id: string;
  timestamp: string;
  fullName: string;
  docType: string;
  docNumber: string;
  ficha: string;
  nivelFormacion: string;
  programa: string;
  centroFormacion: string;
  regional: string;
  modalidad: string;
  estado: 'APROBADO' | 'EN PROCESO';
  score: string;
  certificateCode: string;
  approvalDate: string;
  syncedToGoogle: boolean;
  syncMethod?: 'GOOGLE_API' | 'WEBHOOK' | 'LOCAL_BUFFER';
}

type SyncListener = (status: {
  isSyncing: boolean;
  lastSynced: string | null;
  pendingCount: number;
  totalRecords: number;
  lastError: string | null;
}) => void;

const listeners: Set<SyncListener> = new Set();
let isCurrentlySyncing = false;
let lastSyncError: string | null = null;

export const subscribeToSyncStatus = (listener: SyncListener): (() => void) => {
  listeners.add(listener);
  // Send initial state immediately
  notifyListeners();
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  const pending = getPendingQueue();
  const records = getStoredSyncedRecords();
  const lastSync = getLastSyncTimestamp();

  listeners.forEach((fn) => {
    try {
      fn({
        isSyncing: isCurrentlySyncing,
        lastSynced: lastSync,
        pendingCount: pending.length,
        totalRecords: records.length,
        lastError: lastSyncError,
      });
    } catch (e) {
      console.warn('Error in sync listener:', e);
    }
  });
};

export const getStoredWebhookUrl = (): string => {
  try {
    return localStorage.getItem(WEBHOOK_STORAGE_KEY) || '';
  } catch {
    return '';
  }
};

export const setStoredWebhookUrl = (url: string): void => {
  try {
    localStorage.setItem(WEBHOOK_STORAGE_KEY, url.trim());
    notifyListeners();
  } catch {
    // ignore
  }
};

export const getLastSyncTimestamp = (): string | null => {
  try {
    return localStorage.getItem(LAST_SYNC_KEY);
  } catch {
    return null;
  }
};

export const setLastSyncTimestamp = (ts: string): void => {
  try {
    localStorage.setItem(LAST_SYNC_KEY, ts);
  } catch {
    // ignore
  }
};

export const getPendingQueue = (): SyncedApprenticeRecord[] => {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const savePendingQueue = (queue: SyncedApprenticeRecord[]): void => {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // ignore
  }
};

export const getStoredSyncedRecords = (): SyncedApprenticeRecord[] => {
  try {
    const raw = localStorage.getItem(RECORDS_STORAGE_KEY);
    if (!raw) return [];
    const list: SyncedApprenticeRecord[] = JSON.parse(raw);
    if (!Array.isArray(list)) return [];

    // Deduplicate by docNumber (keep the most updated / approved record)
    const recordMap = new Map<string, SyncedApprenticeRecord>();
    for (const item of list) {
      if (!item || !item.docNumber) continue;
      const key = String(item.docNumber).trim().toLowerCase();
      const existing = recordMap.get(key);
      if (!existing) {
        recordMap.set(key, item);
      } else {
        const existingScore = parseInt(existing.score || '0', 10);
        const itemScore = parseInt(item.score || '0', 10);
        if (item.estado === 'APROBADO' && existing.estado !== 'APROBADO') {
          recordMap.set(key, item);
        } else if (itemScore >= existingScore) {
          recordMap.set(key, item);
        }
      }
    }
    const deduplicated = Array.from(recordMap.values());
    if (deduplicated.length !== list.length) {
      try {
        localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(deduplicated));
      } catch {
        // ignore
      }
    }
    return deduplicated;
  } catch {
    return [];
  }
};

export const saveStoredSyncedRecords = (records: SyncedApprenticeRecord[]): void => {
  try {
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records));
  } catch {
    // ignore
  }
};

/**
 * Builds the official apprentice record object formatted for Google Sheets.
 */
export const buildRecordFromProfile = (
  profile: AprendizProfile,
  quizScore: number,
  certificateCode: string,
  completedAt: string | null
): SyncedApprenticeRecord => {
  const now = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });
  const approvalDate = completedAt
    ? new Date(completedAt).toLocaleDateString('es-CO')
    : quizScore >= 70
    ? new Date().toLocaleDateString('es-CO')
    : '';

  return {
    id: `${profile.docNumber}-${Date.now()}`,
    timestamp: now,
    fullName: profile.fullName || 'Aprendiz SENA',
    docType: profile.docType,
    docNumber: profile.docNumber,
    ficha: profile.ficha,
    nivelFormacion: profile.nivelFormacion,
    programa: profile.programa,
    centroFormacion: profile.centroFormacion,
    regional: profile.regional,
    modalidad: profile.modalidad,
    estado: quizScore >= 70 ? 'APROBADO' : 'EN PROCESO',
    score: `${quizScore}%`,
    certificateCode,
    approvalDate,
    syncedToGoogle: false,
    syncMethod: 'LOCAL_BUFFER',
  };
};

/**
 * Sends a record payload to a Google Apps Script Web App Webhook in the background.
 */
const sendToAppsScriptWebhook = async (
  webhookUrl: string,
  record: SyncedApprenticeRecord
): Promise<boolean> => {
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors', // Apps Script standard web app mode
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(record),
    });
    // With no-cors, response.type is 'opaque' and ok is false, but HTTP request dispatched successfully
    return true;
  } catch (error) {
    console.warn('Webhook dispatch error:', error);
    return false;
  }
};

/**
 * Core Automatic Synchronization Function.
 * Runs silently in the background on profile save and quiz finish.
 * Zero manual clicks required from the apprentice.
 * Updates apprentice record in Google Sheets without duplicating rows.
 */
export const autoSyncApprentice = async (
  profile: AprendizProfile,
  quizScore: number,
  certificateCode: string,
  completedAt: string | null
): Promise<{ success: boolean; method: string }> => {
  if (!profile.docNumber || !profile.fullName) {
    return { success: false, method: 'SKIPPED_INCOMPLETE_PROFILE' };
  }

  isCurrentlySyncing = true;
  lastSyncError = null;
  notifyListeners();

  const newRecord = buildRecordFromProfile(
    profile,
    quizScore,
    certificateCode,
    completedAt
  );

  // 1. Update local records ledger (upsert by docNumber)
  const existingRecords = getStoredSyncedRecords();
  const existingIndex = existingRecords.findIndex(
    (r) => String(r.docNumber).trim().toLowerCase() === String(newRecord.docNumber).trim().toLowerCase()
  );
  if (existingIndex >= 0) {
    const prev = existingRecords[existingIndex];
    existingRecords[existingIndex] = {
      ...newRecord,
      id: prev.id || newRecord.id,
      timestamp: prev.timestamp || newRecord.timestamp,
    };
  } else {
    existingRecords.unshift(newRecord);
  }
  saveStoredSyncedRecords(existingRecords);

  let syncSuccess = false;
  let method: 'GOOGLE_API' | 'WEBHOOK' | 'LOCAL_BUFFER' = 'LOCAL_BUFFER';

  // 2. Check if active Google OAuth Access Token exists
  try {
    const accessToken = await getAccessToken();
    const sheetId = getStoredSpreadsheetId();

    console.log('[DEBUG] Sync attempt. Token exists:', !!accessToken, 'Sheet ID:', sheetId);

    if (accessToken && sheetId) {
      const result = await appendApprenticeRecord(
        accessToken,
        sheetId,
        profile,
        quizScore,
        certificateCode,
        completedAt
      );
      console.log('[DEBUG] appendApprenticeRecord result:', result);
      syncSuccess = true;
      method = 'GOOGLE_API';
    } else {
      console.warn('[DEBUG] Sync skipped. Missing token or sheet ID.');
    }
  } catch (err: any) {
    console.error('[DEBUG] Direct Google API push failed:', err);
    lastSyncError = err.message || 'Error en API directa';
  }

  // 3. If direct API was not used or failed, try configured Webhook
  if (!syncSuccess) {
    const webhookUrl = getStoredWebhookUrl();
    if (webhookUrl) {
      const webhookOk = await sendToAppsScriptWebhook(webhookUrl, newRecord);
      if (webhookOk) {
        syncSuccess = true;
        method = 'WEBHOOK';
      }
    }
  }

  // 4. Update the record status
  newRecord.syncedToGoogle = syncSuccess;
  newRecord.syncMethod = method;

  // Persist updated record in storage
  const updatedRecords = getStoredSyncedRecords();
  const idx = updatedRecords.findIndex(
    (r) => String(r.docNumber).trim().toLowerCase() === String(newRecord.docNumber).trim().toLowerCase()
  );
  if (idx >= 0) {
    updatedRecords[idx] = {
      ...updatedRecords[idx],
      syncedToGoogle: syncSuccess,
      syncMethod: method,
    };
    saveStoredSyncedRecords(updatedRecords);
  }

  // 5. Manage the Queue: if failed, queue for retry
  const queue = getPendingQueue();
  const existingQueueIdx = queue.findIndex(
    (q) => String(q.docNumber).trim().toLowerCase() === String(newRecord.docNumber).trim().toLowerCase()
  );

  if (!syncSuccess) {
    if (existingQueueIdx >= 0) {
      queue[existingQueueIdx] = newRecord;
    } else {
      queue.push(newRecord);
    }
  } else {
    if (existingQueueIdx >= 0) {
      queue.splice(existingQueueIdx, 1);
    }
    setLastSyncTimestamp(new Date().toLocaleTimeString('es-CO'));
  }
  savePendingQueue(queue);

  isCurrentlySyncing = false;
  notifyListeners();

  return { success: syncSuccess, method };
};

/**
 * Flushes all pending records in the offline queue when online or token available.
 * Deduplicates pending items by docNumber to ensure only the latest state is synced.
 */
export const flushSyncQueue = async (): Promise<number> => {
  const queue = getPendingQueue();
  if (queue.length === 0) return 0;

  isCurrentlySyncing = true;
  notifyListeners();

  let flushedCount = 0;
  const remaining: SyncedApprenticeRecord[] = [];
  const accessToken = await getAccessToken();
  const sheetId = getStoredSpreadsheetId();
  const webhookUrl = getStoredWebhookUrl();

  // Deduplicate queue so each apprentice docNumber is only processed once with their latest state
  const uniqueQueueMap = new Map<string, SyncedApprenticeRecord>();
  for (const item of queue) {
    if (item && item.docNumber) {
      uniqueQueueMap.set(String(item.docNumber).trim().toLowerCase(), item);
    }
  }
  const uniqueQueue = Array.from(uniqueQueueMap.values());

  for (const item of uniqueQueue) {
    let sent = false;

    if (accessToken && sheetId) {
      try {
        const dummyProfile: AprendizProfile = {
          fullName: item.fullName,
          docType: item.docType as any,
          docNumber: item.docNumber,
          ficha: item.ficha,
          nivelFormacion: item.nivelFormacion as any,
          programa: item.programa,
          centroFormacion: item.centroFormacion,
          regional: item.regional,
          modalidad: item.modalidad as any,
        };
        const scoreNum = parseInt(item.score, 10) || 0;
        await appendApprenticeRecord(
          accessToken,
          sheetId,
          dummyProfile,
          scoreNum,
          item.certificateCode,
          item.approvalDate
        );
        sent = true;
      } catch (e) {
        console.warn('Queue flush error via API:', e);
      }
    }

    if (!sent && webhookUrl) {
      const ok = await sendToAppsScriptWebhook(webhookUrl, item);
      if (ok) sent = true;
    }

    if (sent) {
      flushedCount++;
      // Mark as synced in records
      const allRecords = getStoredSyncedRecords();
      const rec = allRecords.find(
        (r) => String(r.docNumber).trim().toLowerCase() === String(item.docNumber).trim().toLowerCase()
      );
      if (rec) {
        rec.syncedToGoogle = true;
        rec.syncMethod = accessToken ? 'GOOGLE_API' : 'WEBHOOK';
        saveStoredSyncedRecords(allRecords);
      }
    } else {
      remaining.push(item);
    }
  }

  savePendingQueue(remaining);
  if (flushedCount > 0) {
    setLastSyncTimestamp(new Date().toLocaleTimeString('es-CO'));
  }

  isCurrentlySyncing = false;
  notifyListeners();
  return flushedCount;
};

// Auto-register network reconnection listener for automatic retry
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Conexión reestablecida. Reintentando sincronización con Google Drive...');
    flushSyncQueue();
  });
}

/**
 * Returns ready-to-paste Google Apps Script code for zero-friction deployment.
 * Includes automatic upsert logic: searches by document number and updates in place without duplicates.
 */
export const getAppsScriptTemplate = (spreadsheetId?: string): string => {
  const targetId = spreadsheetId || getStoredSpreadsheetId() || 'TU_ID_DE_HOJA_AQUI';
  return `/**
 * SERVICIO NACIONAL DE APRENDIZAJE - SENA
 * Conector Automático de Inducción con Google Sheets
 * Permite recibir datos de aprendices y actualizarlos en tiempo real sin duplicar registros.
 */
function doPost(e) {
  try {
    var sheetId = "${targetId}";
    var ss = SpreadsheetApp.openById(sheetId);
    var sheet = ss.getSheetByName("Aprendices Certificados") || ss.getSheets()[0];
    
    // Si la hoja está vacía, crear encabezados oficiales SENA
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Fecha y Hora Registro", "Nombres y Apellidos", "Tipo Documento", 
        "Número Documento", "Número de Ficha", "Nivel Formación", 
        "Programa de Formación", "Centro de Formación", "Regional", 
        "Modalidad", "Estado de Inducción", "Calificación Obtenida", 
        "Código de Certificado", "Fecha de Aprobación"
      ];
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setBackground("#39a900").setFontColor("#ffffff").setFontWeight("bold");
    }
    
    var data = JSON.parse(e.postData.contents);
    var docNumber = String(data.docNumber || "").trim().toLowerCase();
    var lastRow = sheet.getLastRow();
    var foundRow = 0;
    var originalTimestamp = data.timestamp || new Date().toLocaleString("es-CO");
    
    // Buscar si ya existe el aprendiz por documento en la columna D (columna 4)
    if (lastRow > 1 && docNumber) {
      var docValues = sheet.getRange(2, 4, lastRow - 1, 1).getValues();
      for (var i = 0; i < docValues.length; i++) {
        if (String(docValues[i][0]).trim().toLowerCase() === docNumber) {
          foundRow = i + 2;
          // Mantener fecha original de registro
          var existingTimestamp = sheet.getRange(foundRow, 1).getValue();
          if (existingTimestamp) {
            originalTimestamp = existingTimestamp;
          }
          break;
        }
      }
    }
    
    var row = [
      originalTimestamp,
      data.fullName || "",
      data.docType || "",
      data.docNumber || "",
      data.ficha || "",
      data.nivelFormacion || "",
      data.programa || "",
      data.centroFormacion || "",
      data.regional || "",
      data.modalidad || "",
      data.estado || "EN PROCESO",
      data.score || "0%",
      data.certificateCode || "",
      data.approvalDate || ""
    ];
    
    if (foundRow > 0) {
      // Actualizar la fila existente del aprendiz (sin duplicar)
      sheet.getRange(foundRow, 1, 1, row.length).setValues([row]);
    } else {
      // Agregar nueva fila si es la primera vez que se registra
      sheet.appendRow(row);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      result: "ok", 
      action: foundRow > 0 ? "updated" : "appended",
      row: foundRow > 0 ? foundRow : sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
};
