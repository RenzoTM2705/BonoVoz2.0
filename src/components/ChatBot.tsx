import iconChatbot from '../assets/icon-chatbot.svg'

export default function ChatBot() {
  return (
    <button
      className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition flex items-center justify-center cursor-pointer"
      aria-label="Chatbot de asistencia"
    >
      <img src={iconChatbot} alt="Chat" className="w-7 h-7" />
    </button>
  )
}
