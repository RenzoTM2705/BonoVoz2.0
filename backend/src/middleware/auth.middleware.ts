import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../services/auth.service.js'

export interface AuthRequest extends Request {
  user?: any
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header) {
    res.status(401).json({ message: 'Authorization header missing' })
    return
  }

  const parts = header.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({ message: 'Invalid authorization format' })
    return
  }

  const token = parts[1]
  const decoded = verifyToken(token)
  if (!decoded) {
    res.status(401).json({ message: 'Invalid token' })
    return
  }

  req.user = decoded
  next()
}
