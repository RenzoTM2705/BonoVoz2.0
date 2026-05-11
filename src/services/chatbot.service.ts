export async function sendChatMessage(message: string): Promise<string> {
  if (!message || !message.trim()) throw new Error('Mensaje vacío')

  const base = import.meta.env.VITE_API_URL || ''
  const url = `${base.replace(/\/$/, '')}/api/chatbot/message`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`HTTP ${res.status} - ${text || 'Error del servidor'}`)
    }

    const data = await res.json().catch(() => null)
    const reply = data && typeof data.reply === 'string' ? data.reply : ''

    if (!reply) throw new Error('Respuesta vacía del backend')

    return reply
  } catch (err) {
    if (err instanceof Error) throw err
    throw new Error('Error en la comunicación con el backend')
  }
}

export default sendChatMessage
