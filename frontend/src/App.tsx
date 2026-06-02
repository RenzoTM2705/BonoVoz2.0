import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Principal from './pages/Principal/Principal'
import Voz from './pages/Voz/Voz'
import Bono from './pages/Bono/Bono'
import Verificacion from './pages/Verificacion/Verificacion'
import ChatBot from './components/ChatBot'
import Admin from './pages/Admin/admin'
import AdminLogin from './pages/Admin/AdminLogin'
import ProtectedRoute from './routes/ProtectedRoute'
import { logout as authLogout, hasAdminToken } from './services/auth.service'

function App() {
  const location = useLocation()
  const isAdminView = location.pathname.startsWith('/admin')

  useEffect(() => {
    if (!hasAdminToken()) {
      localStorage.removeItem('adminAuthenticated')
    }
  }, [location.pathname])

  const handleAdminLogin = (authenticated: boolean) => {
    if (!authenticated) {
      localStorage.removeItem('adminAuthenticated')
    }
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    authLogout()
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
          path="/admin/login"
          element={hasAdminToken() ? <Navigate to="/admin" replace /> : <AdminLogin onLogin={handleAdminLogin} />}
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin onLogout={handleAdminLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!isAdminView && <ChatBot />}
    </>
  )
}

export default App