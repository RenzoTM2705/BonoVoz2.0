/**
 * Voice Streaming Service - WebSocket para transcripción en TIEMPO REAL
 * Conecta con backend que usa Deepgram live API
 */

import type { Beneficiary } from '../types/beneficiary.types'

export interface StreamingTranscription {
  transcription: string
  dni: string | null
  isInterim: boolean // true = transcripción provisional, false = final
  confidence?: number
  beneficiary?: Beneficiary | null
}

export class VoiceStreamingService {
  private ws: WebSocket | null = null
  private apiUrl: string
  private onTranscription: ((data: StreamingTranscription) => void) | null = null
  private onError: ((error: string) => void) | null = null

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl
  }

  /**
   * Conectar al backend vía WebSocket
   */
  public connect(
    onTranscription: (data: StreamingTranscription) => void,
    onError: (error: string) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Convertir HTTP a WS protocol
        const wsUrl = this.apiUrl
          .replace('https://', 'wss://')
          .replace('http://', 'ws://')
          .replace(/\/$/, '') + '/api/voice/stream'

        console.log(`[INFO] Conectando a WebSocket: ${wsUrl}`)

        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = () => {
          console.log('[INFO] WebSocket conectado')
          this.onTranscription = onTranscription
          this.onError = onError
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as StreamingTranscription
            console.log('[INFO] Respuesta recibida:', data)
            onTranscription(data)
          } catch (err) {
            console.error('[ERROR] Error parsificando mensaje:', err)
          }
        }

        this.ws.onerror = (event) => {
          const errorMsg = `Error WebSocket: ${event}`
          console.error('[ERROR]', errorMsg)
          onError(errorMsg)
          reject(new Error(errorMsg))
        }

        this.ws.onclose = () => {
          console.log('[INFO] WebSocket desconectado')
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
        reject(new Error(errorMsg))
      }
    })
  }

  /**
   * Enviar chunk de audio al backend
   */
  public sendAudioChunk(chunk: Blob): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(chunk)
    }
  }

  /**
   * Finalizar streaming y procesar audio
   */
  public finalize(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      // Enviar mensaje especial de fin
      this.ws.send(JSON.stringify({ type: 'finish' }))
    }
  }

  /**
   * Cerrar conexión
   */
  public close(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  /**
   * Verificar si está conectado
   */
  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}
