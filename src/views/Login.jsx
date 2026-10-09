import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { user, login } = useAuth()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  // Con sesion iniciada no se muestra el formulario: se redirige.
  // Es el UNICO lugar que decide a donde ir despues del login:
  // a la pagina que queria ver antes, o al panel si es administrador.
  if (user) {
    const fallback = user.role === 'ADMIN' ? '/admin' : '/'
    return <Navigate to={location.state?.from ?? fallback} replace />
  }

  // Un solo handleChange para todos los inputs, usando el "name" de cada uno.
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSending(true)

    // Si sale bien, AuthContext guarda el usuario, este componente se
    // vuelve a dibujar y el <Navigate> de arriba hace la redireccion.
    login(form.email, form.password).catch((err) => {
      setError(
        err.status === 401 || err.status === 403
          ? 'El email o la contraseña no son correctos.'
          : 'No se pudo conectar con el servidor. Fijate que el back esté levantado.',
      )
      setSending(false)
    })
  }

  return (
    <section className="auth">
      <h1>Ingresar</h1>

      {error && <div className="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-block" disabled={sending}>
          {sending ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      <p className="muted">
        ¿No tenés cuenta? <Link to="/registro">Creá una</Link>
      </p>
    </section>
  )
}

export default Login
