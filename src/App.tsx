import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Principal from './pages/Principal/Principal'
import Voz from './pages/Voz/Voz'
import Bono from './pages/Bono/Bono'
import Verificacion from './pages/Verificacion/Verificacion'
import ChatBot from './components/ChatBot'
import Admin from './pages/Admin/admin'
import AdminLogin from './pages/Admin/AdminLogin'

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const location = useLocation()
  const isAdminView = location.pathname === '/admin'

  useEffect(() => {
    const authenticated = localStorage.getItem('adminAuthenticated') === 'true'
    setIsAdminAuthenticated(authenticated)
  }, [])

  const handleAdminLogin = (authenticated: boolean) => {
    setIsAdminAuthenticated(authenticated)
    if (!authenticated) {
      localStorage.removeItem('adminAuthenticated')
    }
  }

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false)
    localStorage.removeItem('adminAuthenticated')
  }

  return (
    <>
      {!isAdminView && <Header />}
      <Routes>
        <Route path="/" element={<Principal />} />
        <Route path="/voz" element={<Voz />} />
        <Route path="/bono" element={<Bono />} />
        <Route path="/verificacion" element={<Verificacion />} />
        <Route
          path="/admin"
          element={
            isAdminAuthenticated ? (
              <Admin onLogout={handleAdminLogout} />
            ) : (
              <AdminLogin onLogin={handleAdminLogin} />
            )
          }
        />
      </Routes>
      <ChatBot />
    </>
  )
}

export default App