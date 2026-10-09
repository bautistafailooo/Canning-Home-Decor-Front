import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { URL, handleResponse } from '../api/config'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Filters from '../components/Filters'
import ProductList from '../components/ProductList'

const INITIAL_FILTERS = {
  categoryId: null,
  search: '',
  minPrice: '',
  maxPrice: '',
  page: 0,
}

// Vista principal: arma los filtros y le pasa a ProductList que mostrar.
function Home() {
  const { user, isBuyer } = useAuth()
  const { addItem } = useCart()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  // Cambia cuando se limpian los filtros desde afuera del panel.
  // Como es la "key" de <Filters>, sus inputs vuelven a cero solos.
  const [filtersKey, setFiltersKey] = useState(0)
  const [addingId, setAddingId] = useState(null)
  const [notice, setNotice] = useState(null)

  // MONTAJE: las categorias se piden una sola vez (array vacio).
  useEffect(() => {
    let active = true

    fetch(`${URL}/categories`)
      .then(handleResponse)
      .then((data) => {
        if (active) setCategories(data.content)
      })
      .catch((error) => console.error('Error al cargar las categorías', error))

    return () => {
      active = false
    }
  }, [])

  // Cambiar un filtro vuelve a la pagina 1. Si en realidad no cambio
  // nada (por ejemplo, tocar dos veces la misma categoria), no se actualiza
  // el estado y por lo tanto ProductList no hace otro GET.
  const applyFilters = (changes) => {
    const next = { ...filters, ...changes, page: 0 }
    const changed = Object.keys(next).some((key) => next[key] !== filters[key])
    if (changed) setFilters(next)
  }

  const resetFilters = () => {
    applyFilters(INITIAL_FILTERS)
    setFiltersKey((key) => key + 1)
  }

  const goToPage = (page) => {
    setFilters({ ...filters, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // POST /cart/items. El carrito se actualiza con la respuesta (ver
  // CartContext); aca no se vuelve a pedir nada.
  const handleAdd = (product) => {
    if (!user) {
      navigate('/login', { state: { from: '/' } })
      return
    }

    setAddingId(product.id)
    setNotice(null)
    addItem(product.id, 1)
      .then(() => setNotice({ ok: true, text: `Agregaste ${product.description} al carrito.` }))
      .catch((error) =>
        setNotice({
          ok: false,
          text:
            error.status === 400
              ? `No hay más stock de ${product.description}.`
              : 'No se pudo agregar al carrito. Probá de nuevo.',
        }),
      )
      .finally(() => setAddingId(null))
  }

  // El admin no compra: a el no se le muestra el boton de agregar.
  const canBuy = !user || isBuyer

  return (
    <>
      <header className="shop-header">
        <h1>Muebles y objetos para la casa</h1>
        <p>
          Elegí por categoría o buscá lo que necesitás. Los precios que ves ya tienen el descuento
          aplicado.
        </p>
      </header>

      <div className="shop">
        <Filters
          key={filtersKey}
          categories={categories}
          filters={filters}
          onApply={applyFilters}
        />

        <section aria-live="polite">
          {notice && <div className={notice.ok ? 'alert alert-ok' : 'alert'}>{notice.text}</div>}

          <ProductList
            filters={filters}
            onPageChange={goToPage}
            onAdd={canBuy ? handleAdd : undefined}
            addingId={addingId}
            onReset={resetFilters}
          />
        </section>
      </div>
    </>
  )
}

export default Home
