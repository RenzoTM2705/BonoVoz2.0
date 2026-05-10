/**
 * Servicio de transcripción en STREAMING con Deepgram live API
 */

import type { StreamingTranscription } from '../types/index.js'

const deepgramApiKey = process.env.DEEPGRAM_API_KEY

if (!deepgramApiKey) {
  console.warn('[WARN] DEEPGRAM_API_KEY no configurada. Streaming no disponible.')
}

interface DeepgramStreamingResponse {
  type: string
  is_final?: boolean
  channel?: {
    alternatives?: Array<{
      transcript: string
      confidence?: number
    }>
  }
}

/**
 * Procesa streaming de audio con Deepgram live API
 * Usado para WebSocket
 */
export async function* streamTranscribeAudio(
  audioChunks: AsyncIterable<Buffer>
): AsyncGenerator<StreamingTranscription> {
  if (!deepgramApiKey) {
    console.warn('[WARN] Streaming sin API key, usando mock')
    yield {
      transcription: 'Deepgram no configurado',
      dni: null,
      isInterim: false,
    }
    return
  }

  try {
    console.log('[INFO] Iniciando streaming con Deepgram live API')

    const url = 'https://api.deepgram.com/v1/listen?model=nova-2&language=es&smart_format=true'

    // Crear fetch con streaming
    const init: any = {
      method: 'POST',
      headers: {
        'Authorization': `Token ${deepgramApiKey}`,
        'Content-Type': 'application/octet-stream',
        'Transfer-Encoding': 'chunked',
      },
      duplex: 'half',
      body: createReadableStream(audioChunks),
    }

    const response = await fetch(url, init)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Deepgram error ${response.status}: ${errorText}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('No response body')

    let buffer = ''
    const decoder = new TextDecoder()
    let lastDniFound: string | null = null

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })

      // Procesar líneas completas
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.trim()) continue

        try {
          const data = JSON.parse(line) as DeepgramStreamingResponse

          if (data.type === 'Results') {
            const transcript = data.channel?.alternatives?.[0]?.transcript || ''
            const isDni = extractDniFromTranscription(transcript)
            
            if (isDni) {
              lastDniFound = isDni
            }

            yield {
              transcription: transcript,
              dni: isDni || lastDniFound,
              isInterim: !data.is_final,
              confidence: data.channel?.alternatives?.[0]?.confidence,
            }
          }
        } catch (err) {
          console.error('[ERROR] Parsing error:', err)
        }
      }
    }

    console.log('[INFO] Streaming completado')
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido'
    console.error(`[ERROR] Streaming error: ${errorMsg}`)
    throw error
  }
}

/**
 * Convertir AsyncIterable a ReadableStream
 */
function createReadableStream(asyncIterable: AsyncIterable<Buffer>): ReadableStream {
  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of asyncIterable) {
          controller.enqueue(chunk)
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })
}

/**
 * Extraer DNI de transcripción
 */
function extractDniFromTranscription(text: string): string | null {
  const dniMatch = text.match(/\b\d{8}\b/)
  return dniMatch ? dniMatch[0] : null
}
