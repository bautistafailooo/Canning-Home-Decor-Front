import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Envuelve una vista que solo puede ver un rol.
//   Sin sesion    -> al login (y despues vuelve a donde queria ir).
//   Con otro rol  -> a la tienda.
function ProtectedRoute({ role, children }) {
  const { user, checking } = useAuth()
  const location = useLocation()

  // Al recargar la pagina, mientras se verifica el token guardado todavia
  // no se sabe quien es. Sin esta espera, mandaria al login a alguien que
  // en realidad tenia la sesion abierta.
  if (checking) return <p className="loading">Verificando tu sesión…</p>

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (role && user.role !== role) return <Navigate to="/" replace />

  return children
}

export default ProtectedRoute
