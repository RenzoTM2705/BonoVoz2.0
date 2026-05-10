# 🚀 Guía de Inicio Rápido - BonoVoz 2.0

Arquitectura profesional de transcripción de voz con MediaRecorder, OpenAI Whisper y Node.js.

## 📋 Requisitos

- Node.js >= 18.0.0
- npm o pnpm
- Clave de API de OpenAI (https://platform.openai.com/api-keys)

## 🏃 Inicio Rápido (5 minutos)

### 1. Frontend

```bash
# En la raíz del proyecto
npm install
npm run dev
```

El frontend estará en `http://localhost:5173`

### 2. Backend

```bash
# En la carpeta backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env y agregar tu OpenAI API Key

# Ejecutar en desarrollo
npm run dev
```

El backend estará en `http://localhost:3000`

## 🎯 Flujo de Uso

1. **Click en botón circular** → Inicia grabación 🎤
2. **Habla tu DNI** → Ejemplo: "Cuarenta y cinco millones seiscientos setenta y ocho mil doscientos treinta y ocho"
3. **Click nuevamente** → Detiene grabación y envía al backend
4. **Espera transcripción** → OpenAI Whisper procesa el audio
5. **Resultado** → Muestra DNI y beneficiario si existe

## 📁 Estructura del Proyecto

```
BonoVoz2.0/
├── src/
│   ├── hooks/
│   │   └── useAudioRecorder.ts       ✨ Hook profesional de grabación
│   ├── services/
│   │   └── voice.service.ts          🌐 Comunicación con backend
│   ├── pages/Voz/
│   │   └── Voz.tsx                   🎨 Página mejorada
│   └── ...
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── voice.controller.ts
│   │   ├── services/
│   │   │   └── transcription.service.ts 🤖 OpenAI Whisper
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.ts                 🚀 Servidor Express
│   ├── package.json
│   ├── .env
│   └── README.md
└── ...
```

## 🔑 Variables de Entorno

### Frontend (`.env.local`)
```env
VITE_API_URL="http://localhost:3000"
```

### Backend (`backend/.env`)
```env
OPENAI_API_KEY="sk-your-key-here"
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

## 🧪 Testing Manual

### 1. Verificar backend disponible
```bash
curl http://localhost:3000/health
```

Respuesta esperada:
```json
{
  "status": "healthy",
  "timestamp": "2026-05-09T...",
  "service": "BonoVoz Voice API"
}
```

### 2. Grabar audio de prueba

Usa el navegador en http://localhost:5173 o testing con `ffmpeg`:

```bash
# Crear un archivo de audio de prueba (5 segundos de silencio)
ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 5 test-audio.webm
```

### 3. Enviar archivo de prueba
```bash
curl -X POST http://localhost:3000/api/voice/transcribe \
  -F "audio=@test-audio.webm"
```

## 🐛 Debugging

### Frontend
1. Abre DevTools (F12)
2. Consola ve logs de `useAudioRecorder` y `voice.service`
3. Check: Permisos de micrófono ✅
4. Check: NetworkTab vea POST a `/api/voice/transcribe` ✅

### Backend
1. Logs en terminal con `[INFO]`, `[ERROR]`, `[WARN]`
2. Verifica OPENAI_API_KEY configurada
3. Verifica CORS: Origin debe ser `http://localhost:5173`

## 📚 Documentación Detallada

- **Frontend**: [README principal](README.md)
- **Backend**: [Backend README](backend/README.md)
- **Buenas Prácticas**: [BEST_PRACTICES.md](BEST_PRACTICES.md)
- **Fases de Implementación**: Ver aquí abajo

## 🎓 Fases Completadas

| # | Fase | Estado | Descripción |
|---|------|--------|-------------|
| 1 | Frontend Audio Recording | ✅ | Hook `useAudioRecorder.ts` |
| 2 | Servicio Frontend | ✅ | `voice.service.ts` |
| 3 | Integración en Voz.tsx | ✅ | Sin romper diseño |
| 4 | Backend Node.js | ✅ | Express + TypeScript |
| 5 | OpenAI Whisper | ✅ | Integración real |
| 6 | Buenas Prácticas | ✅ | SOLID, TypeScript, Docs |
| 7 | Testing y Validación | 🔄 | En progreso |

## 💡 Consejos

- **MediaRecorder es mejor que Web Speech API**: Funciona en más navegadores
- **Whisper es muy preciso**: Especialmente con audio claro
- **DNI normalizador**: Convierte "cuarenta y cinco" a "45"
- **Sin exposición de API keys**: Todo en backend con `.env`

## 🆘 Problemas Comunes

### "No se puede conectar al backend"
- Verifica que backend está ejecutando: `npm run dev` en carpeta backend
- Verifica CORS en `.env`: `FRONTEND_URL=http://localhost:5173`

### "OpenAI API error"
- Verifica API Key es válida
- Verifica saldo en OpenAI
- Revisa logs del backend

### "Micrófono no funciona"
- Permite permisos en navegador
- Verifica que tienes micrófono conectado
- Intenta otro navegador (Firefox, Chrome)

### "Audio no se transcribe"
- Verifica tamaño < 25MB
- Verifica que sea audio webm/mp3
- Check OPENAI_API_KEY en backend

## 🚀 Próximos Pasos

1. Configurar OpenAI API Key
2. Ejecutar frontend y backend
3. Hacer click en botón circular
4. Hablar un DNI de prueba: "45678238"
5. Ver resultado con beneficiario

## 📞 Soporte

Revisa los logs en:
- **Frontend**: Browser Console (F12)
- **Backend**: Terminal donde ejecutas `npm run dev`

## ✨ Arquitectura en 30 segundos

```
Usuario habla DNI
       ↓
Frontend: useAudioRecorder() graba audio 🎤
       ↓
Frontend: voice.service.ts() envía Blob
       ↓
Backend: Express recibe archivo
       ↓
Backend: OpenAI Whisper transcribe
       ↓
Backend: dni.utils extrae DNI
       ↓
Backend: busca beneficiario en mock
       ↓
Backend: devuelve JSON
       ↓
Frontend: muestra resultado 🎉
```

---

¡Listo para empezar! 🚀

**Estado del proyecto**: 6/7 fases completadas ✅
**Última actualización**: 9 de mayo de 2026
