import supabase from '../config/supabase.js'
import type { Beneficiary } from '../types/index.js'

export async function findBeneficiaryByDni(dni: string): Promise<Beneficiary | null> {
  const { data, error } = await supabase
    .from('beneficiaries')
    .select('*')
    .eq('dni', dni)
    .limit(1)
    .single()

  if (error) {
    console.error('[SUPABASE] findBeneficiaryByDni error:', error.message)
    return null
  }

  if (!data) return null

  return {
    id: data.id,
    dni: data.dni,
    fullName: data.full_name,
    department: data.department,
    province: data.province,
    district: data.district,
    bonusName: data.bonus_name,
    bonusAmount: Number(data.bonus_amount) || 0,
    bonusStatus: data.bonus_status,
    paymentPlace: data.payment_place,
    paymentDate: data.payment_date,
  }
}

export async function findBeneficiaryById(id: string): Promise<Beneficiary | null> {
  const { data, error } = await supabase
    .from('beneficiaries')
    .select('*')
    .eq('id', id)
    .limit(1)
    .single()

  if (error) {
    console.error('[SUPABASE] findBeneficiaryById error:', error.message)
    return null
  }

  if (!data) return null

  return {
    id: data.id,
    dni: data.dni,
    fullName: data.full_name,
    department: data.department,
    province: data.province,
    district: data.district,
    bonusName: data.bonus_name,
    bonusAmount: Number(data.bonus_amount) || 0,
    bonusStatus: data.bonus_status,
    paymentPlace: data.payment_place,
    paymentDate: data.payment_date,
  }
}

export async function countBeneficiaries(): Promise<number> {
  const { count, error } = await supabase
    .from('beneficiaries')
    .select('id', { count: 'exact', head: true })

  if (error) {
    console.error('[SUPABASE] countBeneficiaries error:', error.message)
    return 0
  }

  return count || 0
}
