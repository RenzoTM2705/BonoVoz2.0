/**
 * Controlador para endpoints de transcripción de voz
 */

import { Request, Response } from 'express'
import { transcribeAudioRealOpenAI } from '../services/transcription.service.js'
import { extractDniFromText, isValidDniFormat } from '../utils/dni.utils.js'
import { findBeneficiaryByDni } from '../services/beneficiary.service.js'
import { createValidationLog } from '../services/validation-log.service.js'
import type { ApiError, VoiceTranscriptionResponse } from '../types/index.js'

/**
 * POST /api/voice/transcribe
 * Transcribe audio y detecta DNI
 */
export async function transcribeVoice(req: Request, res: Response): Promise<void> {
  try {
    // Validar que se envió un archivo
    if (!req.file) {
      const error: ApiError = {
        message: 'No se envió archivo de audio',
        code: 'NO_FILE',
        statusCode: 400,
      }
      res.status(error.statusCode).json(error)
      return
    }

    const audioBuffer = req.file.buffer
    const audioFileName = req.file.originalname
    const language = req.body.language || 'es' // Permitir especificar idioma

    // Validar tamaño del archivo (máximo 25MB para Whisper)
    const maxSize = 25 * 1024 * 1024
    if (audioBuffer.length > maxSize) {
      const error: ApiError = {
        message: 'Archivo de audio muy grande (máximo 25MB)',
        code: 'FILE_TOO_LARGE',
        statusCode: 413,
      }
      res.status(error.statusCode).json(error)
      return
    }

    console.log(
      `[INFO] Procesando transcripción: ${audioFileName} (${audioBuffer.length} bytes)`
    )

    // Transcribir audio
    const transcriptionResult = await transcribeAudioRealOpenAI(
      audioBuffer,
      audioFileName,
      language
    )

    const transcription = transcriptionResult.transcription.trim()

    // Extraer DNI del texto transcrito
    const dni = extractDniFromText(transcription)

    // Buscar beneficiario si se encontró DNI
    let beneficiary = null
    let beneficiaryId: string | null = null
    let status: 'success' | 'not_found' | 'no_dni' | 'error' = 'no_dni'

    if (dni && isValidDniFormat(dni)) {
      const found = await findBeneficiaryByDni(dni)
      if (found) {
        beneficiary = found
        beneficiaryId = found.id
        status = 'success'
      } else {
        status = 'not_found'
      }
    } else {
      status = 'no_dni'
    }

    // Guardar registro de validación en Supabase
    await createValidationLog({
      dniDetected: dni || null,
      transcription: transcription || null,
      beneficiaryId: beneficiaryId,
      status: status,
      confidence: null,
      source: 'api',
      errorMessage: null,
      userAgent: req.headers['user-agent'] || null,
    })

    // Construir respuesta
    const response: VoiceTranscriptionResponse = {
      transcription,
      dni,
      beneficiary,
      metadata: {
        duration: transcriptionResult.duration,
        language: transcriptionResult.language,
      },
    }

    res.status(200).json({ ...response, status })
  } catch (error) {
    console.error('[ERROR] transcribeVoice:', error)

    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    const apiError: ApiError = {
      message: errorMessage,
      code: 'TRANSCRIPTION_ERROR',
      statusCode: 500,
    }

    res.status(apiError.statusCode).json(apiError)
  }
}

/**
 * GET /health
 * Endpoint de salud para verificar disponibilidad del servidor
 */
export async function healthCheck(_req: Request, res: Response): Promise<void> {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'BonoVoz Voice API',
  })
}
