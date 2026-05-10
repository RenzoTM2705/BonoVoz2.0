/**
 * Controlador para streaming de voz vía WebSocket
 */

import { WebSocket } from 'ws'
import { transcribeAudioRealOpenAI } from '../services/transcription.service.js'
import { extractDniFromText, findBeneficiaryByDni } from '../utils/dni.utils.js'
import type { StreamingTranscription } from '../types/index.js'

/**
 * Maneja conexiones WebSocket para streaming de voz
 */
export function handleVoiceStream(ws: WebSocket): void {
  const chunks: Buffer[] = []
  let isProcessing = false

  console.log('[INFO] WebSocket conectado. Esperando chunks de audio...')

  ws.on('message', async (data) => {
    try {
      if (data instanceof Buffer) {
        // Verificar si es JSON (mensaje de control)
        try {
          const text = data.toString('utf-8')
          const message = JSON.parse(text)
          if (message.type === 'finish') {
            // Procesar audio acumulado
            if (!isProcessing && chunks.length > 0) {
              isProcessing = true
              await processAudio(ws, chunks)
            }
            return
          }
        } catch {
          // No es JSON, es audio
        }

        // Si es audio, acumular
        chunks.push(data)
        console.log(`[INFO] Chunk recibido: ${data.length} bytes (total: ${chunks.reduce((a, b) => a + b.length, 0)} bytes)`)
      }
    } catch (err) {
      console.error('[ERROR] Error procesando mensaje:', err)
    }
  })

  ws.on('close', async () => {
    console.log('[INFO] WebSocket cerrado')
    
    if (chunks.length > 0 && !isProcessing) {
      isProcessing = true
      await processAudio(ws, chunks)
    }
  })

  ws.on('error', (err) => {
    console.error('[ERROR] WebSocket error:', err)
  })
}

/**
 * Procesa el audio acumulado
 */
async function processAudio(ws: WebSocket, chunks: Buffer[]): Promise<void> {
  try {
    const audioBuffer = Buffer.concat(chunks)
    console.log(`[INFO] Procesando audio completo: ${audioBuffer.length} bytes`)

    const result = await transcribeAudioRealOpenAI(audioBuffer, 'recording.webm', 'es')

    // Extraer DNI
    const dni = extractDniFromText(result.transcription)
    const beneficiary = dni ? findBeneficiaryByDni(dni) : null
    
    console.log(`[INFO] Transcripción final: "${result.transcription}"`)
    console.log(`[INFO] DNI detectado: ${dni || 'ninguno'}`)
    if (beneficiary) {
      console.log(`[INFO] Beneficiario encontrado: ${beneficiary.fullName}`)
    }

    sendResponse(ws, {
      transcription: result.transcription,
      dni: dni,
      isInterim: false,
      beneficiary: beneficiary,
    })
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
    console.error(`[ERROR] Transcripción final: ${errorMsg}`)
    
    sendResponse(ws, {
      transcription: '',
      dni: null,
      isInterim: false,
      beneficiary: null,
    })
  }
}

/**
 * Enviar respuesta al cliente
 */
function sendResponse(ws: WebSocket, data: StreamingTranscription): void {
  try {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data))
    }
  } catch (err) {
    console.error('[ERROR] Error enviando respuesta:', err)
  }
}
