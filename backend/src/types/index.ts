/**
 * Tipos compartidos del backend
 */

export interface TranscriptionRequest {
  audioBlob: Blob
  language?: string
}

export interface DniDetectionResult {
  dni: string | null
  confidence: number
}

export interface TranscriptionResult {
  transcription: string
  language?: string
  duration?: number
}

export interface VoiceTranscriptionResponse {
  transcription: string
  dni: string | null
  beneficiary: Beneficiary | null
  metadata?: {
    duration?: number
    language?: string
  }
}

export type BonusStatus = 'aprobado' | 'pendiente' | 'rechazado'

export interface Beneficiary {
  id: string
  dni: string
  fullName: string
  department: string
  province: string
  district: string
  bonusName: string
  bonusAmount: number
  bonusStatus: BonusStatus
  paymentPlace: string
  paymentDate: string
}

export interface ApiError {
  message: string
  code: string
  statusCode: number
}

export interface StreamingTranscription {
  transcription: string
  dni: string | null
  isInterim: boolean
  confidence?: number
  beneficiary?: Beneficiary | null
}
