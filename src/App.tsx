import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Principal from './pages/Principal/Principal'
import Voz from './pages/Voz/Voz'
import Bono from './pages/Bono/Bono'
import Verificacion from './pages/Verificacion/Verificacion'
import ChatBot from './components/ChatBot'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/voz" element={<Voz />} />
        <Route path="/bono" element={<Bono />} />
        <Route path="/verificacion" element={<Verificacion />} />
      </Routes>
      <ChatBot />
    </>
  )
}

export default App