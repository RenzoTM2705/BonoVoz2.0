import { Request, Response } from 'express'
import { authenticateAdmin } from '../services/auth.service.js'

export async function adminLogin(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ message: 'email and password required' })
      return
    }

    const auth = await authenticateAdmin(email, password)
    if (!auth) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    res.status(200).json(auth)
  } catch (err) {
    console.error('[ERROR] adminLogin', err)
    res.status(500).json({ message: 'Internal error' })
  }
}
