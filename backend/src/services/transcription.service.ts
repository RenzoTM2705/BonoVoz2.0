/**
 * Servicio de transcripción usando Deepgram API v3
 * Usa llamadas HTTP directas para mayor compatibilidad
 */

import type { TranscriptionResult } from '../types/index.js'

const deepgramApiKey = process.env.DEEPGRAM_API_KEY

if (!deepgramApiKey) {
  console.warn('[WARN] DEEPGRAM_API_KEY no configurada. Modo MOCK habilitado.')
}

/**
 * Transcribe audio desde un Buffer usando Deepgram API v3
 * Función principal que será llamada desde el controlador
 */
export async function transcribeAudioRealOpenAI(
  audioBuffer: Buffer,
  audioFileName: string,
  language: string = 'es'
): Promise<TranscriptionResult> {
  try {
    // Si no hay API key, usar modo mock
    if (!deepgramApiKey) {
      console.warn('[WARN] Usando modo MOCK (sin Deepgram real). Transcripción simulada.')
      return simulateMockTranscription()
    }

    console.log(`[INFO] Enviando audio a Deepgram: ${audioFileName} (${audioBuffer.length} bytes)`)

    const startTime = Date.now()

    // Llamar a Deepgram API v3 via HTTP
    const init: any = {
      method: 'POST',
      headers: {
        'Authorization': `Token ${deepgramApiKey}`,
        'Content-Type': 'audio/webm',
      },
      body: audioBuffer,
    }

    const response = await fetch('https://api.deepgram.com/v1/listen?model=nova-2&language=' + language + '&smart_format=true', init)

    const duration = (Date.now() - startTime) / 1000

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[ERROR] Deepgram API error ${response.status}: ${errorText}`)

      if (response.status === 401) {
        throw new Error('API Key de Deepgram inválida o expirada. Verifica en: https://console.deepgram.com')
      }
      if (response.status === 429) {
        throw new Error('Demasiadas solicitudes a Deepgram. Intenta más tarde.')
      }

      throw new Error(`Error Deepgram ${response.status}: ${errorText}`)
    }

    const data = await response.json() as any

    // Extraer transcripción de la respuesta
    const transcript =
      data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || ''

    if (!transcript) {
      console.warn('[WARN] Deepgram no devolvió transcripción')
      return {
        transcription: '',
        language: language,
        duration: duration,
      }
    }

    console.log(
      `[INFO] Transcripción completada: "${transcript}" (${duration.toFixed(2)}s)`
    )

    return {
      transcription: transcript,
      language: language,
      duration: duration,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

    console.error(`[ERROR] Detalles del error Deepgram: ${errorMessage}`)
    console.error(`[ERROR] Stack: ${error instanceof Error ? error.stack : 'N/A'}`)

    throw new Error(`Error en transcripción Deepgram: ${errorMessage}`)
  }
}

/**
 * Simula transcripción de audio (usado para desarrollo sin API Key)
 */
async function simulateMockTranscription(): Promise<TranscriptionResult> {
  console.log('[DEV] Simulando transcripción mock (Deepgram)')

  // Simular latencia de red
  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    transcription:
      'cuarenta y cinco millones seiscientos setenta y ocho mil doscientos treinta y ocho',
    language: 'es',
    duration: 0.8,
  }
}
