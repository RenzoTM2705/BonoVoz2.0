import { Request, Response } from 'express'
import {
  getTotalBeneficiaries,
  getTotalVoiceValidations,
  getRecognitionErrorRate,
  getDeliveredBonusAmount,
  getDailyValidations,
  getRecentValidations,
} from '../services/admin-metrics.service.js'

export async function getMetrics(_req: Request, res: Response) {
  try {
    const [totalBeneficiaries, totalVoiceValidations, recognitionErrorRate, deliveredBonusAmount, dailyValidations, recentValidations] = await Promise.all([
      getTotalBeneficiaries(),
      getTotalVoiceValidations(),
      getRecognitionErrorRate(),
      getDeliveredBonusAmount(),
      getDailyValidations(),
      getRecentValidations(),
    ])

    res.status(200).json({
      totalBeneficiaries,
      totalVoiceValidations,
      recognitionErrorRate,
      deliveredBonusAmount,
      dailyValidations,
      recentValidations,
    })
  } catch (err) {
    console.error('[ERROR] getMetrics', err)
    res.status(500).json({ message: 'Internal error' })
  }
}
