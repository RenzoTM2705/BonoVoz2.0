/**
 * Rutas para endpoints de transcripción de voz
 */

import { Router } from 'express'
import multer from 'multer'
import { transcribeVoice, healthCheck } from '../controllers/voice.controller.js'

const router: Router = Router()

// Configurar multer para manejar archivos de audio
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB máximo
  },
  fileFilter: (_req, file, cb) => {
    // Validar que sea un archivo de audio
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true)
    } else {
      cb(new Error('El archivo debe ser un audio válido'))
    }
  },
})

/**
 * POST /api/voice/transcribe
 * Transcribe archivo de audio y detecta DNI
 */
router.post('/transcribe', upload.single('audio'), transcribeVoice)

/**
 * GET /health
 * Verifica disponibilidad del servidor
 */
router.get('/health', healthCheck)

export default router
