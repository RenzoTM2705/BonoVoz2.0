import { Router } from 'express'
import { getMetrics } from '../controllers/admin.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import { requireAdmin } from '../middleware/admin.middleware.js'

const router = Router() as import('express').Router

router.get('/metrics', requireAuth, requireAdmin, getMetrics)

export default router
