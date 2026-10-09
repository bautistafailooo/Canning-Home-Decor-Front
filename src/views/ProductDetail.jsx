import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { URL, handleResponse } from '../api/config'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import Price from '../components/Price'
import ProductPhoto from '../components/ProductPhoto'
import QuantityPicker from '../components/QuantityPicker'

function ProductDetail() {
  const { id } = useParams()
  const { user, isBuyer } = useAuth()
  const { addItem } = useCart()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [notice, setNotice] = useState(null)

  // MONTAJE / ACTUALIZACION: un GET por producto.
  // La dependencia es el id de la URL: solo se vuelve a pedir si cambia.
  useEffect(() => {
    let active = true
    setLoading(true)
    setNotFound(false)

    fetch(`${URL}/products/${id}`)
      .then(handleResponse)
      .then((data) => {
        if (!active) return
        setProduct(data)
        setPhotoIndex(0)
        setQuantity(1)
      })
      .catch(() => {
        if (active) setNotFound(true)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    // DESMONTAJE
    return () => {
      active = false
    }
  }, [id])

  const handleAdd = () => {
    if (!user) {
      navigate('/login', { state: { from: `/productos/${id}` } })
      return
    }

    setAdding(true)
    setNotice(null)
    addItem(product.id, quantity)
      .then(() => setNotice({ ok: true, text: 'Listo, lo agregaste al carrito.' }))
      .catch((error) =>
        setNotice({
          ok: false,
          text:
            error.status === 400
              ? 'No hay stock suficiente. Revisá cuántos tenés ya en el carrito.'
              : 'No se pudo agregar al carrito. Probá de nuevo.',
        }),
      )
      .finally(() => setAdding(false))
  }

  if (loading) return <p className="loading">Cargando producto…</p>

  if (notFound) {
    return (
      <section className="empty-state">
        <h1>No encontramos este producto</h1>
        <p>Puede que lo hayan dado de baja.</p>
        <Link to="/" className="btn">
          Volver a la tienda
        </Link>
      </section>
    )
  }

  const photos = product.imageUrls ?? []
  const canBuy = !user || isBuyer

  return (
    <>
      <Link to="/" className="back-link">
        ← Volver a la tienda
      </Link>

      <div className="detail">
        <div>
          <div className="gallery-main">
            <ProductPhoto product={product} src={photos[photoIndex]} />
          </div>

          {photos.length > 1 && (
            <div className="gallery-thumbs">
              {photos.map((url, index) => (
                <button
                  key={url}
                  type="button"
                  aria-label={`Ver foto ${index + 1}`}
                  aria-pressed={index === photoIndex}
                  onClick={() => setPhotoIndex(index)}
                >
                  <img src={url} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-info">
          {product.category && <p className="product-meta">{product.category.description}</p>}
          <h1>{product.description}</h1>

          <Price product={product} big />
          {product.discount > 0 && <p className="muted">Tiene {product.discount}% de descuento.</p>}

          {product.available ? (
            <p className="stock-note">
              {product.stock === 1 ? 'Queda 1 unidad.' : `Hay ${product.stock} unidades.`}
            </p>
          ) : (
            <p className="stock-note out">Sin stock por ahora.</p>
          )}

          {notice && (
            <div className={notice.ok ? 'alert alert-ok' : 'alert'}>
              {notice.text} {notice.ok && <Link to="/carrito">Ir al carrito</Link>}
            </div>
          )}

          {canBuy && product.available && (
            <div className="buy-row">
              <QuantityPicker
                value={quantity}
                max={product.stock}
                onChange={setQuantity}
                disabled={adding}
              />
              <button type="button" className="btn" onClick={handleAdd} disabled={adding}>
                {adding ? 'Agregando…' : 'Agregar al carrito'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ProductDetail
