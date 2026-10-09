import { useEffect, useState } from 'react'
import { URL, handleResponse } from '../api/config'
import ProductCard from './ProductCard'

const PAGE_SIZE = 12

// Arma "?page=0&size=12&categoryId=1&search=roble" solo con lo que tiene valor.
const buildQuery = (filters) => {
  const params = new URLSearchParams({ page: filters.page, size: PAGE_SIZE })
  if (filters.categoryId !== null) params.set('categoryId', filters.categoryId)
  if (filters.search) params.set('search', filters.search)
  if (filters.minPrice !== '') params.set('minPrice', filters.minPrice)
  if (filters.maxPrice !== '') params.set('maxPrice', filters.maxPrice)
  return params.toString()
}

// Como PostList del proyecto base: este componente hace el fetch y le pasa
// cada producto a ProductCard.
//
// La diferencia es el array de dependencias: [filters] en lugar de [].
// Se vuelve a pedir SOLO cuando cambian los filtros o la pagina.
function ProductList({ filters, onPageChange, onAdd, addingId, onReset }) {
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    fetch(`${URL}/products?${buildQuery(filters)}`)
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

    // DESMONTAJE: si los filtros cambian antes de que llegue la respuesta
    // anterior, esa respuesta vieja se ignora y no pisa a la nueva.
    return () => {
      active = false
    }
  }, [filters])

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
            disabled={filters.page === 0}
            onClick={() => onPageChange(filters.page - 1)}
          >
            Anterior
          </button>
          <span className="muted">
            Página {filters.page + 1} de {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-outline btn-small"
            disabled={filters.page >= totalPages - 1}
            onClick={() => onPageChange(filters.page + 1)}
          >
            Siguiente
          </button>
        </nav>
      )}
    </>
  )
}

export default ProductList
