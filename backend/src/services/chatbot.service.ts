const SYSTEM_PROMPT = `Eres el asistente virtual de BonoVoz 2.0, una plataforma peruana para consulta y validación de bonos mediante DNI y voz. Responde de forma clara, breve y amable. No inventes datos personales ni confirmes bonos reales. Si el usuario pregunta por su bono, indícale que debe validar su DNI en la sección de voz. Si pregunta por administración, indica que el panel admin requiere credenciales.`

export async function sendToAI(message: string): Promise<string> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  if (!OPENAI_API_KEY) throw new Error('OPENAI_API_KEY no configurada en backend/.env')

  const url = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions'

  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: message }
    ],
    temperature: 0.2,
    max_tokens: 300,
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`AI provider error ${res.status}: ${text}`)
  }

  const data = await res.json().catch(() => null)
  const reply = data?.choices?.[0]?.message?.content || ''
  return String(reply).trim()
}

export default sendToAI
