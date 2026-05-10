/**
 * Voice Service - Conectado al Backend
 * Transcripción real con Deepgram
 */

import type { Beneficiary } from '../types/beneficiary.types'

export interface TranscriptionResponse {
  transcription: string
  dni: string | null
  beneficiary: Beneficiary | null
  metadata?: {
    duration?: number
    language?: string
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * Transcribe audio enviando al backend
 * Backend procesa con Deepgram y devuelve transcripción + DNI
 */
export async function transcribeAudio(audioBlob: Blob): Promise<TranscriptionResponse> {
  try {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.webm')

    console.log(`[INFO] Enviando audio al backend: ${API_BASE_URL}/api/voice/transcribe`)

    const response = await fetch(`${API_BASE_URL}/api/voice/transcribe`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }))
      throw new Error(errorData.message || `Error ${response.status}`)
    }

    const data = (await response.json()) as TranscriptionResponse

    console.log(`[INFO] Transcripción recibida: ${data.transcription}`)

    return data
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error en transcripción'
    console.error(`[ERROR] Transcription error: ${errorMessage}`)
    throw new Error(`Error en transcripción: ${errorMessage}`)
  }
}
