import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Principal from './pages/Principal/Principal'
import Voz from './pages/Voz/Voz'
import ChatBot from './components/ChatBot'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/voz" element={<Voz />} />
      </Routes>
      <ChatBot />
    </>
  )
}

export default App