import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import sendChatMessage from '../services/chatbot.service'
import iconChatbot from '../assets/icon-chatbot.svg'

type Message = { id: string; from: 'user' | 'bot'; text: string }

export default function ChatBot() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  // Do not render in admin routes
  if (location.pathname.startsWith('/admin')) return null

  useEffect(() => {
    // optional: load history from sessionStorage
    const raw = sessionStorage.getItem('chat_history')
    if (raw) setMessages(JSON.parse(raw))
  }, [])

  useEffect(() => {
    sessionStorage.setItem('chat_history', JSON.stringify(messages))
    // scroll to bottom
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text) return
    setError(null)
    const userMsg: Message = { id: String(Date.now()), from: 'user', text }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const reply = await sendChatMessage(text)
      const botMsg: Message = { id: String(Date.now() + 1), from: 'bot', text: reply }
      setMessages((m) => [...m, botMsg])
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      const botMsg: Message = {
        id: String(Date.now() + 1),
        from: 'bot',
        text: 'Error de comunicación. Intenta nuevamente más tarde.',
      }
      setMessages((m) => [...m, botMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-blue-600 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-flex items-center justify-center z-50 flex items-center justify-center"
        aria-label="Chatbot de asistencia"
      >
        <img src={iconChatbot} alt="Chat" className="w-7 h-7" />
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-4 md:bottom-24 md:right-8 w-[92vw] max-w-sm md:max-w-md h-[70vh] bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex flex-col">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="font-medium">Asistente BonoVoz</div>
            <button onClick={() => setOpen(false)} className="text-sm text-gray-500">Cerrar</button>
          </div>

          <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && <div className="text-sm text-gray-500">Escribe para empezar una conversación.</div>}
            {messages.map((m) => (
              <div key={m.id} className={m.from === 'user' ? 'text-right' : 'text-left'}>
                <div className={`inline-block px-3 py-2 rounded ${m.from === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-sm text-gray-500">Escribiendo...</div>}
          </div>

          <div className="p-3 border-t">
            {error && <div className="text-xs text-red-500 mb-2">{error}</div>}
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    if (!loading) send()
                  }
                }}
                className="flex-1 px-3 py-2 border rounded focus:outline-none"
                placeholder="Escribe tu consulta..."
                aria-label="Mensaje"
              />
              <button
                onClick={() => send()}
                disabled={loading}
                className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
