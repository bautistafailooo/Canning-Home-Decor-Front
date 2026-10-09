import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { URL, handleResponse } from '../api/config'
import ProductCard from '../components/ProductCard'

const CUANTOS_DESTACADOS = 4

// Portada. No es el catalogo: muestra una presentacion, las categorias y
// unas pocas piezas, y de ahi se entra a /catalogo, que es donde estan los
// filtros y la paginacion.
function Home() {
  const [categories, setCategories] = useState([])
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  // MONTAJE: los dos pedidos salen juntos y se esperan de una (array vacio).
  useEffect(() => {
    let active = true

    Promise.all([
      fetch(`${URL}/categories`).then(handleResponse),
      fetch(`${URL}/products?page=0&size=${CUANTOS_DESTACADOS}`).then(handleResponse),
    ])
      .then(([categoryPage, productPage]) => {
        if (!active) return
        setCategories(categoryPage.content)
        setFeatured(productPage.content)
      })
      .catch((error) => console.error('Error al cargar la portada', error))
      .finally(() => {
        if (active) setLoading(false)
      })

    // DESMONTAJE
    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <header className="hero">
        <h1>Muebles y objetos para la casa</h1>
        <p>
          Trabajamos con series cortas: publicamos lo que tenemos y dejamos el stock a la vista.
        </p>
        <Link to="/catalogo" className="btn">
          Ver el catálogo
        </Link>
      </header>

      {categories.length > 0 && (
        <section className="home-section">
          <h2>Elegí por ambiente</h2>
          <ul className="category-grid">
            {categories.map((category) => (
              <li key={category.id}>
                {/* El filtro viaja en la URL, asi que este link abre el
                    catalogo ya filtrado por esa categoria. */}
                <Link to={`/catalogo?categoria=${category.id}`}>{category.description}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!loading && featured.length > 0 && (
        <section className="home-section">
          <div className="home-section-header">
            <h2>Algunas piezas</h2>
            <Link to="/catalogo" className="link-button">
              Ver todo el catálogo
            </Link>
          </div>
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

export default Home
