import { createContext, useContext, useEffect, useState } from 'react'
import { URL, handleResponse, headers } from '../api/config'

const AuthContext = createContext(null)
const TOKEN_KEY = 'canning-token'

export const AuthProvider = ({ children }) => {
  // El token se lee de localStorage UNA vez, al crear el estado.
  // No hace falta un useEffect: localStorage es sincronico.
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  // Arranca en true solo si hay un token guardado que verificar.
  const [checking, setChecking] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))

  // MONTAJE: si al abrir la pagina ya habia un token guardado, se le
  // pregunta al back de quien es (GET /api/v1/auth/me). Corre una sola vez.
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    if (!savedToken) return

    let active = true

    fetch(`${URL}/api/v1/auth/me`, { headers: headers(savedToken) })
      .then(handleResponse)
      .then((data) => {
        if (active) setUser(data)
      })
      .catch(() => {
        // Token vencido o invalido: se descarta y queda deslogueado.
        localStorage.removeItem(TOKEN_KEY)
        if (active) setToken(null)
      })
      .finally(() => {
        if (active) setChecking(false)
      })

    // DESMONTAJE: si la respuesta llega tarde, no se toca el estado.
    return () => {
      active = false
    }
  }, [])

  // El login del back devuelve solo { access_token }. Para saber el nombre
  // y el rol hay que pedir /me con ese token. Es un GET de LECTURA del
  // usuario, no una recarga despues de modificar algo.
  const startSession = (accessToken) =>
    fetch(`${URL}/api/v1/auth/me`, { headers: headers(accessToken) })
      .then(handleResponse)
      .then((data) => {
        localStorage.setItem(TOKEN_KEY, accessToken)
        setToken(accessToken)
        setUser(data)
        return data
      })

  const login = (email, password) =>
    fetch(`${URL}/api/v1/auth/authenticate`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password }),
    })
      .then(handleResponse)
      .then((data) => startSession(data.access_token))

  // Sin "role": el back asigna USER (comprador) por defecto.
  const register = (form) =>
    fetch(`${URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(form),
    })
      .then(handleResponse)
      .then((data) => startSession(data.access_token))

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  // Valores derivados: se calculan en cada render, no son estados aparte.
  const value = {
    token,
    user,
    checking,
    isAdmin: user?.role === 'ADMIN',
    isBuyer: user?.role === 'USER',
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
