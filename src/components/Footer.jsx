import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Pie de pagina. Como Navigation, solo lee la sesion del contexto para
// mostrar los links de cada rol: no tiene estado, efectos ni pedidos.
function Footer() {
  const { isAdmin, isBuyer } = useAuth()

  // Valor derivado en el render, no hace falta guardarlo en un estado.
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="brand">
            <img src="/logo-claro.svg" alt="Canning Home Decor" className="brand-logo" />
          </Link>
          <p>Muebles y objetos para la casa.</p>
        </div>

        <nav className="footer-nav" aria-label="Pie de página">
          <div>
            <h2 className="footer-title">Tienda</h2>
            <ul>
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/catalogo">Catálogo</Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="footer-title">{isAdmin ? 'Panel' : 'Cuenta'}</h2>
            <ul>
              {isAdmin && (
                <>
                  <li>
                    <Link to="/admin">Productos</Link>
                  </li>
                  <li>
                    <Link to="/admin/categorias">Categorías</Link>
                  </li>
                  <li>
                    <Link to="/admin/usuarios">Usuarios</Link>
                  </li>
                </>
              )}

              {isBuyer && (
                <>
                  <li>
                    <Link to="/mis-compras">Mis compras</Link>
                  </li>
                  <li>
                    <Link to="/carrito">Carrito</Link>
                  </li>
                </>
              )}

              {!isAdmin && !isBuyer && (
                <>
                  <li>
                    <Link to="/login">Ingresar</Link>
                  </li>
                  <li>
                    <Link to="/registro">Crear cuenta</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>

      <div className="footer-legal">
        <p>© {year} Canning Home Decor</p>
        <p>Trabajo práctico, UADE</p>
      </div>
    </footer>
  )
}

export default Footer