# Plan Estructurado: Sincronización 100% Automática con Google Sheets en Google Drive

Arquitectura y mecanismo para que la plataforma de inducción registre y actualice los datos de todos los aprendices directamente en una hoja de cálculo centralizada de Google Drive en segundo plano, sin requerir clics manuales de sincronización ni inicios de sesión repetitivos por parte de cada aprendiz.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Decisiones clave para la automatización total:**
> - **Eliminación de fricción para el aprendiz**: Los nuevos aprendices no deberán iniciar sesión con Google ni interactuar con permisos técnicos. Su flujo será 100% fluido: registran sus datos, estudian los módulos, aprueban el examen y la plataforma despacha sus resultados automáticamente en segundo plano.
> - **Mecanismo de Despacho Desatendido (Webhook / Endpoint de Google Sheets)**: Implementación de un conector directo basado en Google Apps Script Web App / Webhook REST integrado con la hoja de cálculo. Esto permite que cualquier dispositivo (móvil, tableta o PC) envíe la fila con los datos formateados al instante mediante una petición HTTP POST en segundo plano.
> - **Cola de Respaldo Offline (Resiliencia)**: Si el aprendiz pierde conexión momentáneamente, los datos se guardan en una cola local (`SyncQueue`) y se envían de forma automática tan pronto se restablece la red.
> - **Enlace Visible y Permanente**: El botón y enlace permanente a la hoja de cálculo de Google Drive (`https://docs.google.com/spreadsheets/d/...`) se mantiene accesible en la cabecera y en el panel del certificado para que el instructor o coordinador pueda abrir la hoja con un solo clic en cualquier momento.

---

### 1. Overview & Core Concept

- **Qué hace**: Automatiza de punta a punta la captura y reporte de aprendices. Tan pronto un aprendiz se registra o aprueba su inducción con el puntaje requerido (mínimo 70%), el sistema genera su certificado y, sin intervención manual, inserta o actualiza su registro en la hoja de cálculo central en Google Drive con marca de tiempo, nombres, documento, ficha, programa, calificación y código único de verificación.
- **Público Beneficiado**:
  * **Aprendices**: Cero pasos engorrosos ni solicitudes de permisos de Google.
  * **Instructores y Coordinadores**: Disponen de una base de datos viva y consolidada en Google Drive que se actualiza sola en tiempo real a medida que cada aprendiz culmina la inducción.

---

### 2. User Experience & Visual Design

#### A. Flujo Automático en Segundo Plano
1. **Disparadores Automáticos de Eventos (Triggers)**:
   - **Trigger 1 (Registro / Edición de Perfil)**: Al guardar el formulario de ingreso, se despacha un registro con estado `EN PROCESO`.
   - **Trigger 2 (Aprobación de la Inducción)**: Al finalizar el examen de casos con $\ge 70\%$, se despacha automáticamente el estado `APROBADO`, la calificación final, la fecha de aprobación y el código único de certificado expedido.
2. **Indicador Visual Discreto de Sincronización**:
   - En la cabecera y en el modal de la hoja de cálculo se muestra un distintivo en vivo:
     * `🟢 Sincronización en la nube: Activa`
     * `Último registro enviado: Hace un momento`
   - No hay botones invasivos de "Conectar" o "Iniciar sesión" obligatorios para el aprendiz.
3. **Centro de Control de la Hoja de Cálculo para Instructores**:
   - Acceso al enlace directo de Google Drive (`Abrir Hoja de Cálculo`).
   - Opción para personalizar o cambiar el ID de la hoja de cálculo o el Webhook si el centro de formación desea dirigirlo a otra carpeta de Drive institucional.
   - Historial de los últimos registros enviados en cola.

---

### 3. Key Product Decisions & Trade-Offs

- **Decisión 1: Webhook REST Desatendido vs. OAuth Individual por Aprendiz**:
  * *Estrategia Elegida*: Webhook REST con Google Apps Script / Servicio Proxy.
  * *Por qué*: El flujo OAuth tradicional le exige a cada aprendiz autorizar popups de Google con su cuenta personal o institucional, lo que genera bloqueos de ventanas emergentes, errores de permisos y rechazo en celulares. Un webhook desatendido recibe los datos de forma transparente en 300 ms sin interrumpir la experiencia del aprendiz.
  * *Alternativas descartadas*: Requerir que cada aprendiz inicie sesión con Google en su celular antes de hacer la prueba (descartado por alta fricción).
- **Decisión 2: Cola de Sincronización con Reintento Automático**:
  * *Estrategia Elegida*: Almacenamiento previo en cola local (`localStorage`) que verifica el envío. Si la llamada HTTP tiene éxito, marca el registro como confirmado; si hay intermitencia de red, reintenta automáticamente en segundo plano.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App SENA Aprendiz Frontend                      │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
       [Evento: Perfil Guardado]         [Evento: Examen Aprobado]
                    │                                │
                    └────────────────┬───────────────┘
                                     │
                                     ▼
                ┌────────────────────────────────────────┐
                │   AutoSync Engine (Motor en 2do Plano) │
                │   - Valida datos del aprendiz          │
                │   - Genera payload normalizado         │
                │   - Respalda en cola local             │
                └────────────────────┬───────────────────┘
                                     │ HTTP POST (Asíncrono)
                                     ▼
                ┌────────────────────────────────────────┐
                │   Google Sheets Webhook / Endpoint     │
                │   (Google Apps Script en Google Drive) │
                └────────────────────┬───────────────────┘
                                     │
                                     ▼
    ┌────────────────────────────────────────────────────────────────┐
    │     Hoja de Cálculo en Google Drive:                           │
    │     "SENA - Registro de Inducción y Calificaciones"            │
    │     Columnas: Fecha | Aprendiz | Doc | Ficha | Nota | Cert.    │
    └────────────────────────────────────────────────────────────────┘
```

#### Estructura del Payload Automático:
```json
{
  "action": "SYNC_APPRENTICE",
  "timestamp": "2026-10-21 08:45:00",
  "fullName": "Carlos Eduardo Ramírez Peña",
  "docType": "CC",
  "docNumber": "1025894120",
  "ficha": "2874910",
  "nivelFormacion": "Tecnólogo",
  "programa": "Análisis y Desarrollo de Software (ADSO)",
  "centroFormacion": "Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)",
  "regional": "Regional Distrito Capital",
  "modalidad": "Presencial",
  "estado": "APROBADO",
  "score": "90%",
  "certificateCode": "SENA-IND-2024-X9F4B2",
  "approvalDate": "21 de octubre de 2026"
}
```

---

### 5. Pasos de Ejecución tras tu Aprobación

1. **Creación del Motor de Sincronización Automática (`src/services/autoSyncService.ts`)**:
   - Manejador de eventos en segundo plano que escucha los cambios del perfil y la aprobación de la inducción.
   - Conector con el webhook predeterminado y soporte para configurar webhook propio de Google Apps Script.
2. **Conexión Automática en `App.tsx`**:
   - Disparo silencioso al guardar datos o al superar el examen con $\ge 70\%$.
   - Sin pantallas de bloqueo ni popups obligatorios.
3. **Actualización de la Interfaz (`Header.tsx`, `CertificateView.tsx`, `GoogleSheetsModal.tsx`)**:
   - Incorporar indicador en tiempo real de sincronización automática activa.
   - Mantener el acceso al enlace permanente de Google Drive para abrir la hoja en cualquier momento.
   - Proporcionar las instrucciones de 1 minuto para quienes deseen desplegar su propio script de Google Apps Script en su cuenta institucional.
