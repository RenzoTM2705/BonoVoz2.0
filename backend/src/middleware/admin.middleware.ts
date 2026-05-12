import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth.middleware.js'

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }
  if (req.user.role !== 'admin') {
    res.status(403).json({ message: 'Forbidden' })
    return
  }
  next()
}
