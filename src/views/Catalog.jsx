import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { URL, errorText, handleResponse } from '../api/config'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Filters from '../components/Filters'
import ProductList from '../components/ProductList'

const PAGE_SIZE = 12

// Catalogo con filtros.
//
// Los filtros NO viven en un useState: viven en la URL. Asi el filtro se
// puede compartir o guardar en favoritos, y el boton Atras del navegador
// deshace el ultimo filtro, que es lo que la gente espera. Tener el mismo
// dato en dos lugares (la URL y un estado) es justamente lo que hay que
// evitar.
function Catalog() {
  const { user, isBuyer } = useAuth()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [categories, setCategories] = useState([])
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

    // DESMONTAJE
    return () => {
      active = false
    }
  }, [])

  // Lo que hay en la URL, leido en cada render. No es estado.
  const categoryParam = searchParams.get('categoria')
  const filters = {
    categoryId: categoryParam === null ? null : Number(categoryParam),
    search: searchParams.get('buscar') ?? '',
    minPrice: searchParams.get('min') ?? '',
    maxPrice: searchParams.get('max') ?? '',
    page: Number(searchParams.get('pagina') ?? 0),
  }

  // La consulta que viaja al back, ya armada como texto.
  //
  // Se le pasa a ProductList como string y no como objeto a proposito: su
  // useEffect depende de este valor, y un objeto nuevo en cada render haria
  // que el efecto corra siempre, en un bucle sin fin. Dos textos iguales,
  // en cambio, son iguales.
  const params = new URLSearchParams({ page: filters.page, size: PAGE_SIZE })
  if (filters.categoryId !== null) params.set('categoryId', filters.categoryId)
  if (filters.search) params.set('search', filters.search)
  if (filters.minPrice !== '') params.set('minPrice', filters.minPrice)
  if (filters.maxPrice !== '') params.set('maxPrice', filters.maxPrice)
  const query = params.toString()

  // Escribe los filtros en la URL. Cambiar cualquiera vuelve a la pagina 1.
  const applyFilters = (changes) => {
    const next = { ...filters, ...changes, page: 0 }
    const url = new URLSearchParams()
    if (next.categoryId !== null) url.set('categoria', next.categoryId)
    if (next.search) url.set('buscar', next.search)
    if (next.minPrice !== '') url.set('min', next.minPrice)
    if (next.maxPrice !== '') url.set('max', next.maxPrice)
    setSearchParams(url)
  }

  const resetFilters = () =>
    applyFilters({ categoryId: null, search: '', minPrice: '', maxPrice: '' })

  const goToPage = (page) => {
    const url = new URLSearchParams(searchParams)
    if (page === 0) url.delete('pagina')
    else url.set('pagina', page)
    setSearchParams(url)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // POST /cart/items. El carrito se actualiza con la respuesta (ver
  // CartContext); aca no se vuelve a pedir nada.
  const handleAdd = (product) => {
    if (!user) {
      navigate('/login', { state: { from: '/catalogo' } })
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
              : errorText(error, 'No se pudo agregar al carrito. Probá de nuevo.'),
        }),
      )
      .finally(() => setAddingId(null))
  }

  // El admin no compra: a el no se le muestra el boton de agregar.
  const canBuy = !user || isBuyer

  return (
    <>
      <header className="shop-header">
        <h1>Catálogo</h1>
        <p>
          Elegí por categoría o buscá lo que necesitás. Los precios que ves ya tienen el descuento
          aplicado.
        </p>
      </header>

      <div className="shop">
        {/* Si los filtros de texto cambian desde afuera (Limpiar filtros),
            la key cambia y el panel se arma de cero con los valores nuevos.
            Escribir no cambia la key, asi que no se pierde el foco. */}
        <Filters
          key={`${filters.search}|${filters.minPrice}|${filters.maxPrice}`}
          categories={categories}
          filters={filters}
          onApply={applyFilters}
        />

        <section aria-live="polite">
          {notice && <div className={notice.ok ? 'alert alert-ok' : 'alert'}>{notice.text}</div>}

          <ProductList
            query={query}
            page={filters.page}
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

export default Catalog
