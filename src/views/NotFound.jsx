import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <section className="empty-state">
      <h1>Esta página no existe</h1>
      <p>Puede que el link esté mal escrito o que el producto ya no esté publicado.</p>
      <Link to="/" className="btn">
        Volver a la tienda
      </Link>
    </section>
  )
}

export default NotFound
