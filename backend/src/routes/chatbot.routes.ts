import { Router } from 'express'
import { handleMessage } from '../controllers/chatbot.controller.js'

const router: Router = Router()

router.post('/message', handleMessage)

export default router
