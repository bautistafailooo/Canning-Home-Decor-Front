import { useEffect, useState } from 'react'
import { URL, handleResponse } from '../api/config'
import ProductCard from './ProductCard'

// Como PostList del proyecto base: este componente hace el fetch y le pasa
// cada producto a ProductCard.
//
// La diferencia es el array de dependencias: [query] en lugar de [].
// Se vuelve a pedir SOLO cuando cambia la consulta.
//
// query llega armado como texto y no como objeto por un motivo concreto:
// React compara las dependencias por identidad, y un objeto creado en cada
// render del padre nunca es igual al anterior, asi que el efecto correria
// siempre, en un bucle infinito. Dos textos iguales si son iguales.
function ProductList({ query, page, onPageChange, onAdd, addingId, onReset }) {
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    fetch(`${URL}/products?${query}`)
      .then(handleResponse)
      .then((data) => {
        if (!active) return
        // El back devuelve una pagina de Spring: los productos estan en .content
        setProducts(data.content)
        setTotalPages(data.totalPages)
        setTotalElements(data.totalElements)
      })
      .catch((err) => {
        console.error('Error al cargar los productos', err)
        if (active) setError('No se pudo cargar el catálogo. Fijate que el back esté levantado.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    // DESMONTAJE: si la consulta cambia antes de que llegue la respuesta
    // anterior, esa respuesta vieja se ignora y no pisa a la nueva.
    return () => {
      active = false
    }
  }, [query])

  if (loading) return <p className="loading">Cargando productos…</p>
  if (error) return <div className="alert">{error}</div>

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <h2>No hay productos con estos filtros</h2>
        <p>Probá con otra categoría o ampliá el rango de precio.</p>
        <button type="button" className="btn btn-outline" onClick={onReset}>
          Ver todo el catálogo
        </button>
      </div>
    )
  }

  return (
    <>
      <p className="results-bar">
        {totalElements} {totalElements === 1 ? 'producto' : 'productos'}
      </p>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={onAdd}
            adding={addingId === product.id}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="pagination" aria-label="Páginas">
          <button
            type="button"
            className="btn btn-outline btn-small"
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
          >
            Anterior
          </button>
          <span className="muted">
            Página {page + 1} de {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-outline btn-small"
            disabled={page >= totalPages - 1}
            onClick={() => onPageChange(page + 1)}
          >
            Siguiente
          </button>
        </nav>
      )}
    </>
  )
}

export default ProductList
