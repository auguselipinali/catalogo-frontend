import { Navigate } from 'react-router-dom'
import { getToken, clearToken, isTokenExpired } from '../../lib/session'

// Envuelve las rutas del panel: sin token o con sesión expirada,
// limpia y manda a login. Centraliza el guard para no duplicarlo.
export default function RequireAuth({ children }) {
  if (!getToken() || isTokenExpired()) {
    clearToken()
    return <Navigate to="/admin/login" replace />
  }

  return children
}
