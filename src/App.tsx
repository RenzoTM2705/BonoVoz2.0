import { Routes, Route } from 'react-router-dom'
import Principal from './pages/Principal/Principal'
import ChatBot from './components/ChatBot'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Principal />} />
      </Routes>
      <ChatBot />
    </>
  )
}

export default App