import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Pie de pagina. Como Navigation, solo lee la sesion del contexto para
// mostrar los links de cada rol: no tiene estado, efectos ni pedidos.
function Footer() {
  const { isAdmin, isBuyer } = useAuth()

  // Valor derivado en el render, no hace falta guardarlo en un estado.
  const year = new Date().getFullYear()

  // Boton "Volver arriba": sube despacio, salvo que la persona tenga
  // pedido en su sistema que no haya animaciones.
  const scrollToTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  // Al tocar un link del pie se esta abajo de todo. Sin esto, la pagina
  // nueva se abriria a esa misma altura y no desde arriba.
  const handleLinkClick = (event) => {
    if (event.target.closest('a')) window.scrollTo(0, 0)
  }

  return (
    <footer className="footer">
      <div className="footer-inner" onClick={handleLinkClick}>
        <div className="footer-brand">
          <Link to="/" className="brand">
            <span className="brand-name">Canning</span>
            <span className="brand-sub">Home Decor</span>
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
        <button type="button" className="footer-top" onClick={scrollToTop}>
          Volver arriba <span aria-hidden="true">↑</span>
        </button>
      </div>
    </footer>
  )
}

export default Footer