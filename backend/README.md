# BonoVoz Backend

Backend profesional para transcripción de voz y detección de DNI usando Express, TypeScript y OpenAI Whisper.

## Características

- ✅ API Express con TypeScript estricto
- ✅ Transcripción de audio con OpenAI Whisper
- ✅ Detección automática de DNI
- ✅ Búsqueda de beneficiarios en base de datos
- ✅ CORS configurado para desarrollo
- ✅ Manejo robusto de errores
- ✅ Validación de archivos

## Estructura

```
backend/
├── src/
│   ├── controllers/
│   │   └── voice.controller.ts      # Lógica de endpoints
│   ├── routes/
│   │   └── voice.routes.ts          # Definición de rutas
│   ├── services/
│   │   └── transcription.service.ts # Servicio de Whisper
│   ├── utils/
│   │   └── dni.utils.ts             # Utilidades de DNI
│   ├── types/
│   │   └── index.ts                 # Tipos TypeScript
│   ├── mocks/
│   │   └── beneficiaries.mock.ts    # Datos de prueba
│   └── server.ts                    # Entrada principal
├── .env                             # Variables de entorno
├── tsconfig.json                    # Config TypeScript
└── package.json                     # Dependencias
```

## Instalación

```bash
cd backend
npm install
```

## Configuración

1. Copia el archivo `.env` y configura tus variables:

```bash
cp .env .env.local
```

2. Agrega tu clave de OpenAI API:

```env
OPENAI_API_KEY="sk-your-api-key-here"
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

## Desarrollo

Inicia el servidor en modo desarrollo:

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`

## Compilación

Compila TypeScript a JavaScript:

```bash
npm run build
```

## Ejecución

Ejecuta el servidor compilado:

```bash
npm start
```

## Endpoints

### POST /api/voice/transcribe

Transcribe un archivo de audio y detecta DNI.

**Request:**
- Método: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `audio` (archivo): Archivo de audio en formato webm, mp3, wav, etc.

**Response (200):**
```json
{
  "transcription": "cuarenta y cinco millones...",
  "dni": "45678238",
  "beneficiary": {
    "id": "1",
    "dni": "45678238",
    "fullName": "María Quispe Huamán",
    "bonusName": "Bono Familiar Universal",
    "bonusAmount": 380,
    "bonusStatus": "aprobado",
    ...
  },
  "metadata": {
    "duration": 5,
    "language": "es"
  }
}
```

**Response (400/413/500):**
```json
{
  "message": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

### GET /health

Verifica disponibilidad del servidor.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-05-09T...",
  "service": "BonoVoz Voice API"
}
```

## Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Clave de API de OpenAI | Sí (para Whisper real) |
| `PORT` | Puerto del servidor | No (default: 3000) |
| `NODE_ENV` | Ambiente (development/production) | No (default: development) |
| `FRONTEND_URL` | URL del frontend para CORS | No (default: http://localhost:5173) |

## Notas de Desarrollo

- Por ahora, el servicio de transcripción devuelve datos mock
- La integración real con OpenAI Whisper se hará en la FASE 5
- El servidor valida archivos de audio y tiene límites de tamaño (25MB máximo)
- Los errores incluyen códigos específicos para mejor manejo en frontend

## Próximos Pasos

1. Integrar OpenAI Whisper API real
2. Implementar caché de respuestas
3. Agregar logging más robusto
4. Implementar rate limiting
5. Agregar tests unitarios e integración
