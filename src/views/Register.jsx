import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Los nombres coinciden con RegisterRequest del back.
const EMPTY_FORM = {
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  password: '',
}

function Register() {
  const { user, register } = useAuth()

  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  if (user) return <Navigate to="/" replace />

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (form.password.length < 6) {
      setError('La contraseña tiene que tener al menos 6 caracteres.')
      return
    }

    setError('')
    setSending(true)
    // Si sale bien, el <Navigate> de arriba lleva a la tienda.
    register(form).catch(() => {
      setError('No pudimos crear la cuenta. Puede que el email o el usuario ya estén registrados.')
      setSending(false)
    })
  }

  return (
    <section className="auth">
      <h1>Crear cuenta</h1>

      {error && <div className="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field-row">
          <div className="field">
            <label htmlFor="firstname">Nombre</label>
            <input
              id="firstname"
              name="firstname"
              autoComplete="given-name"
              required
              value={form.firstname}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="lastname">Apellido</label>
            <input
              id="lastname"
              name="lastname"
              autoComplete="family-name"
              required
              value={form.lastname}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="username">Nombre de usuario</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            required
            value={form.username}
            onChange={handleChange}
          />
        </div>

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
            autoComplete="new-password"
            required
            value={form.password}
            onChange={handleChange}
          />
          <small>Mínimo 6 caracteres.</small>
        </div>

        <button type="submit" className="btn btn-block" disabled={sending}>
          {sending ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>

      <p className="muted">
        ¿Ya tenés cuenta? <Link to="/login">Ingresá</Link>
      </p>
    </section>
  )
}

export default Register
