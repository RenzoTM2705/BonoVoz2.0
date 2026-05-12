import supabase from '../config/supabase.js'
import { countBeneficiaries, findBeneficiaryById } from './beneficiary.service.js'

function weekdayShortFromDate(dateStr: string): string {
  const d = new Date(dateStr)
  const names = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  return names[d.getDay()]
}

export async function getTotalBeneficiaries(): Promise<number> {
  return await countBeneficiaries()
}

export async function getTotalVoiceValidations(): Promise<number> {
  const { count, error } = await supabase
    .from('voice_validations')
    .select('id', { count: 'exact', head: true })

  if (error) {
    console.error('[SUPABASE] totalVoiceValidations error:', error.message)
    return 0
  }

  return count || 0
}

export async function getRecognitionErrorRate(): Promise<number> {
  const total = await getTotalVoiceValidations()
  if (total === 0) return 0

  const { count, error } = await supabase
    .from('voice_validations')
    .select('id', { count: 'exact', head: true })
    .in('status', ['no_dni', 'error', 'not_found'])

  if (error) {
    console.error('[SUPABASE] recognitionErrorRate error:', error.message)
    return 0
  }

  const bad = count || 0
  return (bad / total) * 100
}

export async function getDeliveredBonusAmount(): Promise<number> {
  const { data, error } = await supabase
    .from('beneficiaries')
    .select('bonus_amount')
    .eq('bonus_status', 'aprobado')
    .eq('is_paid', true)

  if (error) {
    console.error('[SUPABASE] deliveredBonusAmount error:', error.message)
    return 0
  }

  const sum = (data || []).reduce((acc: number, row: any) => acc + Number(row.bonus_amount || 0), 0)
  return sum
}

export async function getDailyValidations(): Promise<Array<{ day: string; count: number }>> {
  // Traer validaciones de los últimos 30 días y agrupar por día de la semana en JS
  const { data, error } = await supabase
    .from('voice_validations')
    .select('created_at')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

  if (error) {
    console.error('[SUPABASE] dailyValidations error:', error.message)
    return []
  }

  const groups: Record<string, number> = {}
  ;(data || []).forEach((row: any) => {
    const day = weekdayShortFromDate(row.created_at)
    groups[day] = (groups[day] || 0) + 1
  })

  const result = Object.keys(groups).map((day) => ({ day, count: groups[day] }))
  // Order by weekday order
  const order = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  result.sort((a, b) => order.indexOf(a.day) - order.indexOf(b.day))
  return result
}

export async function getRecentValidations(): Promise<any[]> {
  const { data, error } = await supabase
    .from('voice_validations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('[SUPABASE] recentValidations error:', error.message)
    return []
  }

  const rows = data || []

  const results = await Promise.all(
    rows.map(async (r: any) => {
      const beneficiary = r.beneficiary_id ? await findBeneficiaryById(r.beneficiary_id) : null

      return {
        id: r.id,
        dniDetected: r.dni_detected || null,
        transcription: r.transcription || null,
        status: r.status,
        confidence: r.confidence ?? null,
        createdAt: r.created_at,
        beneficiary: beneficiary
          ? {
              dni: beneficiary.dni,
              fullName: beneficiary.fullName,
              bonusName: beneficiary.bonusName,
              bonusStatus: beneficiary.bonusStatus,
            }
          : null,
      }
    })
  )

  return results
}
