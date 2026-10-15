import { startTransition } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

// Mismo papel que Navigation del proyecto base, con un menu distinto
// segun quien este logueado.
function Navigation() {
  const { user, isAdmin, isBuyer, logout } = useAuth()
  const { units } = useCart()
  const navigate = useNavigate()

  // React Router 7 cambia de ruta dentro de una "transicion" (baja
  // prioridad). Si logout() fuera una actualizacion comun, React la
  // aplicaria primero: la pagina protegida en la que estaba (Mis compras,
  // el panel) se volveria a dibujar sin usuario y lo mandaria al login.
  // Con startTransition las dos cosas se aplican juntas: va a la tienda
  // y recien ahi queda deslogueado.
  const handleLogout = () => {
    navigate('/')
    startTransition(() => logout())
  }

  return (
    <header className="navbar">


      <nav className="navbar-links">
        <NavLink to="/" end>
          Inicio
        </NavLink>
        <NavLink to="/catalogo">Catálogo</NavLink>

        {isBuyer && (
          <>
            <NavLink to="/mis-compras">Mis compras</NavLink>
            <NavLink to="/carrito" className="cart-link">
              Carrito
              {units > 0 && <span className="badge">{units}</span>}
            </NavLink>
          </>
        )}

        {isAdmin && <NavLink to="/admin">Panel</NavLink>}

        {user ? (
          <>
            <span className="navbar-user">Hola, {user.name}</span>
            <button type="button" className="btn btn-quiet" onClick={handleLogout}>
              Salir
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Ingresar</NavLink>
            <Link to="/registro" className="btn btn-small">
              Crear cuenta
            </Link>
          </>
        )}
      </nav>
                  <Link to="/" className="brand">
        <img src="/logo.svg" alt="Canning Home Decor" className="brand-logo" />
      </Link>
    </header>
  )
}

export default Navigation
