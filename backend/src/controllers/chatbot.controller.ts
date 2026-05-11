import express from 'express'
import { sendToAI } from '../services/chatbot.service.js'

export async function handleMessage(req: express.Request, res: express.Response) {
  try {
    const { message } = req.body || {}
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío' })
    }

    try {
      const reply = await sendToAI(message)
      // Devuelve respuesta del modelo (puede ser texto vacío)
      return res.json({ reply: reply || '' })
    } catch (aiErr) {
      console.error('[CHATBOT AI ERROR]', aiErr)
      // Fallback local si falla la IA
      return res.json({ reply: 'En este momento no puedo responder con IA. Puedes validar tu DNI desde la sección de voz o intentar nuevamente.' })
    }
  } catch (err) {
    console.error('[CHATBOT ERROR]', err)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export default handleMessage
