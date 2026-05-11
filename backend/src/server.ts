/**
 * Servidor Express para BonoVoz Backend
 * API para transcripción de voz y detección de DNI con Deepgram streaming
 */

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import voiceRoutes from './routes/voice.routes.js'
import chatbotRoutes from './routes/chatbot.routes.js'
import { handleVoiceStream } from './controllers/voiceStream.controller.js'

const app = express()
const PORT = process.env.PORT || 3000
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const NODE_ENV = process.env.NODE_ENV || 'development'

// Crear servidor HTTP con soporte WebSocket
const server = createServer(app)
const wss = new WebSocketServer({ server, path: '/api/voice/stream' })

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configurar CORS
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Middleware para logging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// Rutas HTTP
app.use('/api/voice', voiceRoutes)
app.use('/api/chatbot', chatbotRoutes)

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'BonoVoz Voice API',
    environment: NODE_ENV,
  })
})

// Root endpoint
app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'BonoVoz Voice API',
    version: '1.0.0',
    endpoints: {
      transcribe: 'POST /api/voice/transcribe',
      stream: 'WS /api/voice/stream',
      chatbot: 'POST /api/chatbot/message',
      health: 'GET /health',
    },
  })
})

// Manejador WebSocket para streaming
wss.on('connection', (ws) => {
  console.log('[INFO] Nueva conexión WebSocket')
  handleVoiceStream(ws)
})

// Manejo de errores 404
app.use((_req, res) => {
  res.status(404).json({
    message: 'Endpoint no encontrado',
    path: _req.path,
  })
})

// Manejo global de errores
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('[ERROR]', err)
    res.status(500).json({
      message: 'Error interno del servidor',
      error: NODE_ENV === 'development' ? err.message : 'Error desconocido',
    })
  }
)

// Iniciar servidor HTTP (que incluye WebSocket)
server.listen(PORT, () => {
  console.log(`✓ BonoVoz Backend ejecutándose en http://localhost:${PORT}`)
  console.log(`✓ Ambiente: ${NODE_ENV}`)
  console.log(`✓ Frontend URL permitida: ${FRONTEND_URL}`)
  console.log(`✓ Deepgram API Key configurada: ${process.env.DEEPGRAM_API_KEY ? 'Sí' : 'No'}`)
  console.log(`✓ WebSocket disponible en ws://localhost:${PORT}/api/voice/stream`)
})
