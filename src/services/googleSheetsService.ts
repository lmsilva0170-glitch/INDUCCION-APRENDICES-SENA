import { AprendizProfile } from '../types/induction';

const SPREADSHEET_TITLE = 'SENA - Registro de Inducción y Calificaciones (Acuerdo 0009 de 2024)';
const SPREADSHEET_ID_KEY = 'sena_induction_google_sheet_id';

export interface ApprenticeRecordRow {
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
  estado: string;
  score: string;
  certificateCode: string;
  approvalDate: string;
}

export const getStoredSpreadsheetId = (): string | null => {
  try {
    return localStorage.getItem(SPREADSHEET_ID_KEY);
  } catch {
    return null;
  }
};

export const setStoredSpreadsheetId = (id: string): void => {
  try {
    localStorage.setItem(SPREADSHEET_ID_KEY, id);
  } catch {
    // ignore
  }
};

/**
 * Searches Drive for an existing spreadsheet with the title or creates a new one.
 */
export const getOrCreateSpreadsheet = async (
  accessToken: string
): Promise<{ id: string; url: string; created: boolean }> => {
  const existingId = getStoredSpreadsheetId();

  // If we already have a saved ID, verify if it still exists and is accessible
  if (existingId) {
    try {
      const verifyRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${existingId}?fields=spreadsheetId,properties.title`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (verifyRes.ok) {
        return {
          id: existingId,
          url: `https://docs.google.com/spreadsheets/d/${existingId}/edit`,
          created: false,
        };
      }
    } catch {
      // If error, continue to search or recreate
    }
  }

  // Search Drive for existing file with the title
  try {
    const query = encodeURIComponent(
      `name = '${SPREADSHEET_TITLE}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`
    );
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.files && searchData.files.length > 0) {
        const found = searchData.files[0];
        setStoredSpreadsheetId(found.id);
        return {
          id: found.id,
          url: found.webViewLink || `https://docs.google.com/spreadsheets/d/${found.id}/edit`,
          created: false,
        };
      }
    }
  } catch (err) {
    console.warn('No se pudo buscar en Drive, creando una nueva hoja...', err);
  }

  // Create new spreadsheet
  const headers = [
    'Fecha y Hora Registro',
    'Nombres y Apellidos',
    'Tipo Documento',
    'Número Documento',
    'Número de Ficha',
    'Nivel Formación',
    'Programa de Formación',
    'Centro de Formación',
    'Regional',
    'Modalidad',
    'Estado de Inducción',
    'Calificación Obtenida',
    'Código de Certificado',
    'Fecha de Aprobación',
  ];

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: SPREADSHEET_TITLE,
      },
      sheets: [
        {
          properties: {
            title: 'Aprendices Certificados',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: [
                {
                  values: headers.map((h) => ({
                    userEnteredValue: { stringValue: h },
                    userEnteredFormat: {
                      textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                      backgroundColor: { red: 0.22, green: 0.66, blue: 0 }, // SENA Green (#39a900)
                    },
                  })),
                },
              ],
            },
          ],
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Error al crear la hoja de cálculo: ${errorText}`);
  }

  const createData = await createRes.json();
  const newId = createData.spreadsheetId;
  const newUrl = `https://docs.google.com/spreadsheets/d/${newId}/edit`;

  setStoredSpreadsheetId(newId);
  return { id: newId, url: newUrl, created: true };
};

/**
 * Appends or updates an apprentice record in the Google Spreadsheet (Upsert).
 * If a row with the apprentice's document number already exists, it updates that row in-place.
 * Any duplicate rows with the same document number are cleaned up.
 * If no existing row is found, it appends a new row.
 */
export const appendApprenticeRecord = async (
  accessToken: string,
  spreadsheetId: string,
  profile: AprendizProfile,
  quizScore: number,
  certificateCode: string,
  completedAt: string | null
): Promise<{ success: boolean; rowNumber?: number; action?: 'updated' | 'appended' }> => {
  const targetDocNumber = String(profile.docNumber || '').trim();
  if (!targetDocNumber) {
    throw new Error('Número de documento inválido para sincronización.');
  }

  const now = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });
  const approvalDate = completedAt
    ? new Date(completedAt).toLocaleDateString('es-CO')
    : quizScore >= 70
    ? new Date().toLocaleDateString('es-CO')
    : '';

  let sheetName = 'Aprendices Certificados';

  // 1. Try to read current rows from sheet
  let values: string[][] = [];
  try {
    const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      `${sheetName}!A:N`
    )}`;
    console.log('[DEBUG] Reading sheet:', readUrl);
    const readRes = await fetch(readUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (readRes.ok) {
      const data = await readRes.json();
      values = data.values || [];
      console.log('[DEBUG] Sheet data read. Row count:', values.length);
    } else {
      console.warn('[DEBUG] Failed to read sheet. Status:', readRes.status);
      // If reading sheetName failed (e.g. sheet renamed or only default sheet exists), inspect sheets
      const metaRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (metaRes.ok) {
        const meta = await metaRes.json();
        console.log('[DEBUG] Sheet metadata:', meta);
        if (meta.sheets && meta.sheets.length > 0) {
          sheetName = meta.sheets[0].properties.title;
          console.log('[DEBUG] Retrying with sheetName:', sheetName);
          const retryRes = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
              `${sheetName}!A:N`
            )}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          if (retryRes.ok) {
            const retryData = await retryRes.json();
            values = retryData.values || [];
            console.log('[DEBUG] Retry sheet data read. Row count:', values.length);
          }
        }
      }
    }
  } catch (readErr) {
    console.error('[DEBUG] Error checking sheet rows:', readErr);
  }

  // Find all existing matching rows (Doc Number is in Column D, index 3)
  // Row 1 is header (index 0). Data rows start at index 1 (row 2).
  const matchingRowNumbers: number[] = [];
  let originalRegistrationTimestamp = now;

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (!row || row.length === 0) continue;
    const docInSheet = String(row[3] || '').trim();
    if (docInSheet.toLowerCase() === targetDocNumber.toLowerCase()) {
      matchingRowNumbers.push(i + 1); // 1-based row index in spreadsheet
      if (row[0] && matchingRowNumbers.length === 1) {
        // Keep initial registration timestamp if available
        originalRegistrationTimestamp = row[0];
      }
    }
  }

  const rowValues = [
    originalRegistrationTimestamp,
    profile.fullName,
    profile.docType,
    profile.docNumber,
    profile.ficha,
    profile.nivelFormacion,
    profile.programa,
    profile.centroFormacion,
    profile.regional,
    profile.modalidad,
    quizScore >= 70 ? 'APROBADO' : 'EN PROCESO',
    `${quizScore}%`,
    certificateCode,
    approvalDate,
  ];

  if (matchingRowNumbers.length > 0) {
    // UPDATE existing row in place (Row matchingRowNumbers[0])
    const targetRow = matchingRowNumbers[0];
    const updateRange = `${sheetName}!A${targetRow}:N${targetRow}`;
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      updateRange
    )}?valueInputOption=USER_ENTERED`;

    const updateRes = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowValues],
      }),
    });

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      throw new Error(`Error al actualizar aprendiz en Google Sheets: ${errText}`);
    }

    // Clean up any extra duplicate rows that might have been created previously
    if (matchingRowNumbers.length > 1) {
      const extraDuplicates = matchingRowNumbers.slice(1);
      for (const dupRow of extraDuplicates) {
        try {
          await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
              `${sheetName}!A${dupRow}:N${dupRow}`
            )}:clear`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            }
          );
        } catch (clearErr) {
          console.warn(`No se pudo limpiar fila duplicada ${dupRow}:`, clearErr);
        }
      }
    }

    return { success: true, rowNumber: targetRow, action: 'updated' };
  } else {
    // APPEND as a new row
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      `${sheetName}!A:N`
    )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

    const appendRes = await fetch(appendUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowValues],
      }),
    });

    if (!appendRes.ok) {
      const errText = await appendRes.text();
      throw new Error(`Error al registrar en Google Sheets: ${errText}`);
    }

    return { success: true, action: 'appended' };
  }
};

export const upsertApprenticeRecord = appendApprenticeRecord;

/**
 * Scans the Google Spreadsheet for duplicate rows by document number,
 * keeping only the latest/most complete record and clearing duplicate rows.
 */
export const cleanDuplicateRowsInSpreadsheet = async (
  accessToken: string,
  spreadsheetId: string
): Promise<{ cleanedCount: number }> => {
  let sheetName = 'Aprendices Certificados';
  const readUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
    `${sheetName}!A:N`
  )}`;
  const readRes = await fetch(readUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!readRes.ok) return { cleanedCount: 0 };
  const data = await readRes.json();
  const values: string[][] = data.values || [];
  if (values.length <= 2) return { cleanedCount: 0 };

  const seenDocs = new Map<string, number>();
  const rowsToClear: number[] = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (!row || row.length === 0) continue;
    const doc = String(row[3] || '').trim().toLowerCase();
    if (!doc) continue;

    if (seenDocs.has(doc)) {
      rowsToClear.push(i + 1); // 1-based row
    } else {
      seenDocs.set(doc, i + 1);
    }
  }

  for (const rowNum of rowsToClear) {
    try {
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
          `${sheetName}!A${rowNum}:N${rowNum}`
        )}:clear`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch {
      // ignore
    }
  }

  return { cleanedCount: rowsToClear.length };
};

/**
 * Reads existing records from the Google Sheet and filters out empty/cleared rows,
 * ensuring no duplicate rows are returned.
 */
export const fetchApprenticeRecords = async (
  accessToken: string,
  spreadsheetId: string
): Promise<string[][]> => {
  const range = 'Aprendices Certificados!A2:N';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
    range
  )}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error('No se pudieron leer los registros de la hoja de cálculo');
  }

  const data = await res.json();
  const rawValues: string[][] = data.values || [];
  // Filter out any blank or empty rows (where document number is missing)
  const validRows = rawValues.filter((row) => row && row.length > 3 && String(row[3] || '').trim() !== '');

  // Deduplicate by docNumber (Column D, index 3) in case duplicates exist in the sheet
  const docMap = new Map<string, string[]>();
  for (const row of validRows) {
    const doc = String(row[3]).trim().toLowerCase();
    const existing = docMap.get(doc);
    if (!existing) {
      docMap.set(doc, row);
    } else {
      // Keep row with APROBADO or latest record
      const existingStatus = existing[10] || '';
      const rowStatus = row[10] || '';
      if (rowStatus === 'APROBADO' && existingStatus !== 'APROBADO') {
        docMap.set(doc, row);
      }
    }
  }

  return Array.from(docMap.values());
};
