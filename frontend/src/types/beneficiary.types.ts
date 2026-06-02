export type BonusStatus = 'aprobado' | 'pendiente' | 'rechazado'

export type Beneficiary = {
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