import { Navigate, useLocation } from 'react-router-dom'
import { hasAdminToken } from '../services/auth.service'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()

  if (!hasAdminToken()) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}
