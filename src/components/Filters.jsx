import { useState } from 'react'

// Panel de filtros del catalogo.
// Los inputs de texto y precio tienen su propio estado ("borrador") y solo
// se aplican al tocar "Buscar". Asi no se hace un GET por cada tecla.
// La categoria, en cambio, se aplica apenas se elige.
const Filters = ({ categories, filters, onApply }) => {
  const [search, setSearch] = useState(filters.search)
  const [minPrice, setMinPrice] = useState(filters.minPrice)
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice)

  const handleSubmit = (e) => {
    e.preventDefault()
    onApply({ search: search.trim(), minPrice, maxPrice })
  }

  const handleClear = () => {
    setSearch('')
    setMinPrice('')
    setMaxPrice('')
    onApply({ search: '', minPrice: '', maxPrice: '', categoryId: null })
  }

  return (
    <aside className="filters">
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="search">Buscar</label>
          <input
            id="search"
            type="search"
            placeholder="Ej: roble, lámpara"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="minPrice">Precio</label>
          <div className="price-range">
            <input
              id="minPrice"
              type="number"
              min="0"
              placeholder="Mínimo"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              min="0"
              placeholder="Máximo"
              aria-label="Precio máximo"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-small">
            Buscar
          </button>
          <button type="button" className="btn btn-outline btn-small" onClick={handleClear}>
            Limpiar filtros
          </button>
        </div>
      </form>

      <div>
        <h3>Categorías</h3>
        <ul className="category-list">
          <li>
            <button
              type="button"
              aria-pressed={filters.categoryId === null}
              onClick={() => onApply({ categoryId: null })}
            >
              Todas
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                type="button"
                aria-pressed={filters.categoryId === category.id}
                onClick={() => onApply({ categoryId: category.id })}
              >
                {category.description}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

export default Filters
