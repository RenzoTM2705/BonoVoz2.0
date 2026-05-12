import supabase from '../config/supabase.js'

export type ValidationStatus = 'success' | 'not_found' | 'no_dni' | 'error'

export interface CreateValidationLogPayload {
  dniDetected?: string | null
  transcription?: string | null
  beneficiaryId?: string | null
  status: ValidationStatus
  confidence?: number | null
  source?: string | null
  errorMessage?: string | null
  userAgent?: string | null
}

export async function createValidationLog(payload: CreateValidationLogPayload) {
  const { data, error } = await supabase.from('voice_validations').insert([
    {
      dni_detected: payload.dniDetected || null,
      transcription: payload.transcription || null,
      beneficiary_id: payload.beneficiaryId || null,
      status: payload.status,
      confidence: payload.confidence ?? null,
      source: payload.source || 'api',
      error_message: payload.errorMessage || null,
      user_agent: payload.userAgent || null,
    },
  ])

  if (error) {
    console.error('[SUPABASE] createValidationLog error:', error.message)
    return null
  }

  return data?.[0] ?? null
}
