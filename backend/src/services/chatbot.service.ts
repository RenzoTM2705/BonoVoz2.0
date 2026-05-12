const SYSTEM_PROMPT = `Eres el asistente virtual de BonoVoz 2.0, una plataforma peruana para consulta y validación de bonos mediante DNI y voz. Responde de forma clara, breve y amable. No inventes datos personales ni confirmes bonos reales. Si el usuario pregunta por su bono, indícale que debe validar su DNI en la sección de voz. Si pregunta por administración, indica que el panel admin requiere credenciales.`

export async function sendToAI(message: string): Promise<string> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY
  if (!GEMINI_API_KEY) {
    throw new Error(
      'GEMINI_API_KEY no configurada en backend/.env (fallback compatible: OPENAI_API_KEY)'
    )
  }

  // URL de Google Gemini API (v1beta)
  const model = 'gemini-3.1-flash-lite'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`

  const payload = {
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: [
      {
        parts: [{ text: message }],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 300,
    },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Gemini API error ${res.status}: ${text}`)
  }

  const data = await res.json().catch(() => null)
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
  return String(reply).trim()
}

export default sendToAI
