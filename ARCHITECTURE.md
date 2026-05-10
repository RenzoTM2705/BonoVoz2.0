# 🏗️ Arquitectura Completa - BonoVoz 2.0

Documento de referencia para la arquitectura de transcripción de voz profesional.

## 📐 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                      BONOVOZ 2.0                             │
│              Audio Recognition Architecture                  │
└─────────────────────────────────────────────────────────────┘

FRONTEND (React + Vite + TypeScript)
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Pages / Voz.tsx                                      │   │
│  │ - State management (DNI, beneficiary, error)         │   │
│  │ - UI responsive (mobile-first)                       │   │
│  │ - Orchestración de hooks y servicios                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                 ↓                      ↓                      │
│  ┌────────────────────┐    ┌──────────────────────────┐     │
│  │ useAudioRecorder   │    │ voice.service           │     │
│  │ ─────────────────  │    │ ────────────────────────│     │
│  │ - recordAudio()    │    │ - transcribeAudio()     │     │
│  │ - stopRecording()  │    │ - checkHealth()         │     │
│  │ - state mgmt       │    │ - FormData creation     │     │
│  │ - MediaRecorder    │    │ - Error handling        │     │
│  └────────────────────┘    └──────────────────────────┘     │
│           ↓                           ↓                       │
│     audio/webm Blob ────────────── Fetch ────────────→      │
│                                                               │
└──────────────────────────────────────────────────────────────┘
                              ↓↑
                    HTTP POST (FormData)
                       Multipart/form-data
                         Port: 5173 ← → 3000
                              ↓↑

BACKEND (Express + Node.js + TypeScript)
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Express Server (server.ts)                           │   │
│  │ - CORS configurado                                   │   │
│  │ - Middleware de logging                             │   │
│  │ - Error handling global                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                 ↓                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Routes / voice.routes.ts                             │   │
│  │ - POST /api/voice/transcribe                         │   │
│  │ - Multer: upload.single('audio')                     │   │
│  │ - Validación de tipo MIME                            │   │
│  │ - GET /health                                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                 ↓                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Controller / voice.controller.ts                     │   │
│  │ - Validar archivo                                    │   │
│  │ - Orquestar servicios                                │   │
│  │ - Construir respuesta                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                 ↓                                             │
│  ┌────────────────────────────┐    ┌──────────────────┐    │
│  │ transcription.service.ts   │    │ dni.utils.ts     │    │
│  │ ────────────────────────── │    │ ────────────────│    │
│  │ - OpenAI Whisper API       │    │ - normalizeDni()│    │
│  │ - Audio processing         │    │ - extractDni()  │    │
│  │ - Error handling           │    │ - findBenefi()  │    │
│  │ - Logging                  │    │ - isValidDni()  │    │
│  └────────────────────────────┘    └──────────────────┘    │
│                 ↓                                             │
│             OpenAI API                                       │
│        (whisper-1 model)                                     │
│                 ↓                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Response Construction                                │   │
│  │ {                                                    │   │
│  │   transcription: string,                             │   │
│  │   dni: string | null,                                │   │
│  │   beneficiary: Beneficiary | null,                   │   │
│  │   metadata: { duration, language }                   │   │
│  │ }                                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
                              ↓
                    HTTP 200 (JSON)
                              ↓

FRONTEND (Respuesta)
┌──────────────────────────────────────────────────────────────┐
│  - Actualizar estado (DNI, beneficiary)                       │
│  - Mostrar transcripción                                      │
│  - Mostrar beneficiario si existe                             │
│  - Mostrar errores si hay                                     │
└──────────────────────────────────────────────────────────────┘
```

## 📦 Componentes Principales

### Frontend

#### 1. Hook: `useAudioRecorder.ts`
```typescript
// Responsabilidades:
- Solicitar permisos de micrófono
- Iniciar grabación con MediaRecorder
- Detener grabación
- Generar Blob de audio
- Manejar estados (idle, recording, processing, error)
- Limpieza de recursos

// Tipos:
export type RecorderState = 'idle' | 'recording' | 'processing' | 'error'

// Retorna:
{
  startRecording: () => Promise<void>
  stopRecording: () => Promise<void>
  audioBlob: Blob | null
  isRecording: boolean
  isProcessing: boolean
  error: string | null
  resetRecorder: () => void
}
```

#### 2. Servicio: `voice.service.ts`
```typescript
// Responsabilidades:
- Enviar audio al backend
- Parsear respuesta JSON
- Manejar errores de red
- Validar respuesta del servidor
- Chequear salud del backend

// Función principal:
export async function transcribeAudio(audioBlob: Blob): Promise<TranscriptionResponse>

// Response:
{
  transcription: string
  dni: string | null
  beneficiary: Beneficiary | null
  metadata?: { duration?: number, language?: string }
}
```

#### 3. Página: `Voz.tsx`
```typescript
// Responsabilidades:
- Mostrar UI responsive
- Orquestar hook + servicio
- Manejar estados de usuario
- Mostrar feedback visual
- Mantener diseño actual

// Estados principales:
- text: string
- detectedDni: string | null
- beneficiary: Beneficiary | null
- error: string
- successMessage: string
- isRecording: boolean
- isProcessing: boolean
- isTranscribing: boolean

// Flujo:
Click → startRecording → isRecording=true → stopRecording → isTranscribing=true 
→ transcribeAudio → isTranscribing=false → mostrar resultado
```

### Backend

#### 1. Servidor: `server.ts`
```typescript
// Responsabilidades:
- Iniciar Express
- Configurar middleware
- Configurar CORS
- Registrar rutas
- Logging
- Manejo global de errores

// Puertos:
- Desarrollo: 3000
- Producción: variable (env)

// Health check:
GET /health → { status: 'healthy' }
```

#### 2. Rutas: `voice.routes.ts`
```typescript
// Rutas:
- POST /api/voice/transcribe
  * Body: multipart/form-data con archivo 'audio'
  * Response: 200 con JSON
  
- GET /health
  * Response: 200 con estado

// Multer config:
- Storage: memory
- Límite: 25MB
- Tipo: audio/*
```

#### 3. Controlador: `voice.controller.ts`
```typescript
// Funciones:
- transcribeVoice(req, res)
  * Validar archivo
  * Validar tamaño
  * Llamar servicio transcription
  * Extraer DNI
  * Buscar beneficiario
  * Construir y enviar respuesta

- healthCheck(req, res)
  * Devolver estado del servidor
```

#### 4. Servicio: `transcription.service.ts`
```typescript
// Responsabilidades:
- Integración con OpenAI Whisper API
- Procesamiento de audio
- Manejo de errores de OpenAI
- Logging estructurado

// Función principal:
export async function transcribeAudioRealOpenAI(
  audioBuffer: Buffer,
  audioFileName: string,
  language?: string
): Promise<TranscriptionResult>

// Fallback:
- Mock mode si no hay API Key
- Desarrollo sin gastos
```

#### 5. Utilidades: `dni.utils.ts`
```typescript
// Funciones:
- normalizeDniText(text: string): string
  * Convierte palabras a dígitos
  * "cuarenta y cinco" → "40 5"

- extractDniFromText(text: string): string | null
  * Extrae DNI válido (8 dígitos)
  * Busca patrón 8 dígitos consecutivos

- findBeneficiaryByDni(dni: string): Beneficiary | null
  * Busca en base de datos mock
  * Retorna beneficiario o null

- isValidDniFormat(dni: string): boolean
  * Valida formato (8 dígitos)
```

## 🔄 Flujos de Datos

### Flujo Exitoso (Happy Path)

```
Usuario habla: "cuarenta y cinco millones seiscientos setenta y ocho..."
                          ↓
      Frontend: useAudioRecorder graba
                          ↓
      Frontend: voice.service.transcribeAudio()
                          ↓
      POST http://localhost:3000/api/voice/transcribe
      FormData: { audio: Blob }
                          ↓
      Backend: voice.controller.transcribeVoice()
                          ↓
      Validar archivo
                          ↓
      transcription.service.transcribeAudioRealOpenAI()
                          ↓
      OpenAI API: "cuarenta y cinco millones..."
                          ↓
      dni.utils.extractDniFromText()
                          ↓
      Detecta: "45678238"
                          ↓
      dni.utils.findBeneficiaryByDni("45678238")
                          ↓
      Encontrado: María Quispe Huamán
                          ↓
      Response: {
        transcription: "cuarenta y cinco millones...",
        dni: "45678238",
        beneficiary: { María Quispe Huamán... }
      }
                          ↓
      Frontend: Muestra beneficiario ✅
```

### Flujo con Error

```
Usuario: No habla clearly
            ↓
Backend: OpenAI Whisper no puede transcribir
            ↓
Error: "Could not parse audio"
            ↓
Response: {
  transcription: "",
  dni: null,
  beneficiary: null
}
            ↓
Frontend: Mostrar error "No se detectó un DNI válido"
```

## 🔐 Seguridad

### Frontend
- ❌ No exponer API keys
- ✅ VITE_API_URL en variables
- ✅ Validar respuestas del servidor
- ✅ Manejo de errores sin exponer detalles

### Backend
- ✅ API Key en .env (no en git)
- ✅ CORS restringido
- ✅ Validación de tamaño (25MB max)
- ✅ Validación de tipo MIME
- ✅ Error messages seguros
- ✅ Logging sin sensibilidad

## 📈 Rendimiento

### Frontend
- MediaRecorder en memoria (< 5MB típico)
- Fetch async (no bloquea UI)
- Memoización de callbacks
- No re-renders innecesarios

### Backend
- Multer en memoria (rápido)
- OpenAI API call (≈ 5-10 segundos típico)
- No database (mock en memoria)
- Logging eficiente

## 🚀 Escalabilidad

### Hoy
- Mock beneficiarios en memoria
- OpenAI Whisper API
- Single backend instance

### Mañana
- Database real (PostgreSQL)
- Rate limiting
- Caché de respuestas
- Multiple instances
- Load balancing
- Monitoring/Alerting

## 📊 Métricas Clave

```
Frontend:
├─ Time to record: 3-10 segundos (usuario)
├─ Size of audioBlob: 0.5-5 MB
├─ Fetch latency: 5-10 segundos (OpenAI)
└─ UI responsiveness: < 16ms (60 FPS)

Backend:
├─ Request validation: < 10ms
├─ Whisper latency: 5-10 segundos
├─ DNI extraction: < 1ms
├─ Beneficiary lookup: < 1ms
└─ Response time: 5-11 segundos total

Sistema:
├─ Uptime: 99.9% (meta)
├─ Error rate: < 0.1%
├─ User satisfaction: >4.5/5
└─ Transcription accuracy: >95%
```

## 🎯 Estados de la Aplicación

```
┌─────────────────────────────────────────────────┐
│             APP STATE MACHINE                    │
└─────────────────────────────────────────────────┘

                    IDLE
                     │
                     │ click button
                     ↓
                 RECORDING ──→ error ─→ ERROR
                     │
                     │ click button
                     ↓
               PROCESSING
                     │
                     │ upload
                     ↓
              TRANSCRIBING ──→ error ─→ ERROR
                     │
                     │ success
                     ↓
                  SUCCESS
                     │
                     │ reset
                     ↓
                    IDLE
```

## 🔌 API Contracts

### Request
```
POST /api/voice/transcribe
Content-Type: multipart/form-data

Form Data:
├─ audio (file): audio/webm
└─ language (string, optional): 'es'
```

### Response Success (200)
```json
{
  "transcription": "cuarenta y cinco millones...",
  "dni": "45678238",
  "beneficiary": {
    "id": "1",
    "dni": "45678238",
    "fullName": "María Quispe Huamán",
    "department": "Lima",
    "province": "Lima",
    "district": "San Juan de Lurigancho",
    "bonusName": "Bono Familiar Universal",
    "bonusAmount": 380,
    "bonusStatus": "aprobado",
    "paymentPlace": "Banco de la Nación",
    "paymentDate": "2026-05-20"
  },
  "metadata": {
    "duration": 5.2,
    "language": "es"
  }
}
```

### Response Error (400/413/500)
```json
{
  "message": "Descripción del error",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

## 📚 Archivos Generados

```
Frontend:
├── src/
│   ├── hooks/
│   │   └── useAudioRecorder.ts ← NUEVO
│   ├── services/
│   │   └── voice.service.ts ← NUEVO
│   └── pages/Voz/
│       └── Voz.tsx ← MODIFICADO
└── .env.local ← ACTUALIZADO

Backend: (Nueva carpeta)
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── voice.controller.ts
│   │   ├── routes/
│   │   │   └── voice.routes.ts
│   │   ├── services/
│   │   │   └── transcription.service.ts
│   │   ├── utils/
│   │   │   └── dni.utils.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── mocks/
│   │   │   └── beneficiaries.mock.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   ├── .env.example
│   └── README.md

Documentación:
├── QUICK_START.md ← Guía de inicio
├── BEST_PRACTICES.md ← Buenas prácticas
├── TESTING_GUIDE.md ← Testing
└── ARCHITECTURE.md ← Este archivo
```

---

**Estado**: Arquitectura completa documentada ✅
**Fases completadas**: 7/7 ✅
**Fecha**: 9 de mayo de 2026
