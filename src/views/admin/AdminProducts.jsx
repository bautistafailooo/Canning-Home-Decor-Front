import { useEffect, useState } from 'react'
import { URL, errorText, formatPrice, handleResponse, headers } from '../../api/config'
import { useAuth } from '../../context/AuthContext'
import ProductForm from '../../components/ProductForm'
import ProductPhoto from '../../components/ProductPhoto'
import StockCell from '../../components/StockCell'

function AdminProducts() {
  const { token, user } = useAuth()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  // null = formulario cerrado, 'new' = alta, o el producto que se edita.
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  // MONTAJE: productos y categorias se piden UNA vez, en paralelo.
  // Despues, toda alta, edicion o baja actualiza estos arrays a mano.
  useEffect(() => {
    let active = true

    Promise.all([
      fetch(`${URL}/products`).then(handleResponse),
      fetch(`${URL}/categories`).then(handleResponse),
    ])
      .then(([productPage, categoryPage]) => {
        if (!active) return
        setProducts(productPage.content)
        setCategories(categoryPage.content)
      })
      .catch(() => {
        if (active) setError('No se pudieron cargar los productos.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    // DESMONTAJE
    return () => {
      active = false
    }
  }, [])

  const showNotice = (text) => {
    setError('')
    setNotice(text)
  }

  // POST (alta) o PUT (edicion). El back devuelve el producto guardado:
  // se agrega o se reemplaza en el array, sin volver a pedir la lista.
  const handleSave = (data) => {
    setSaving(true)
    setError('')

    const isNew = editing === 'new'
    const body = JSON.stringify({ ...data, sellerId: user.id })

    fetch(isNew ? `${URL}/products` : `${URL}/products/${editing.id}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: headers(token),
      body,
    })
      .then(handleResponse)
      .then((saved) => {
        if (isNew) {
          setProducts((prev) => [saved, ...prev])
          showNotice(`Publicaste ${saved.description}.`)
        } else {
          setProducts((prev) => prev.map((p) => (p.id === saved.id ? saved : p)))
          showNotice(`Guardaste los cambios de ${saved.description}.`)
        }
        setEditing(null)
      })
      .catch((err) => setError(errorText(err, 'No se pudo guardar el producto. Revisá los datos.')))
      .finally(() => setSaving(false))
  }

  // PATCH del stock: se reemplaza solo ese producto con la respuesta.
  // Devuelve la promesa para que StockCell sepa cuando termino.
  const handleStock = (product, stock) =>
    fetch(`${URL}/products/${product.id}/stock?stock=${stock}`, {
      method: 'PATCH',
      headers: headers(token),
    })
      .then(handleResponse)
      .then((updated) => {
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
        showNotice(`El stock de ${updated.description} quedó en ${updated.stock}.`)
      })
      .catch((err) => setError(errorText(err, 'No se pudo actualizar el stock.')))

  // DELETE devuelve 204 (sin cuerpo): se filtra el producto del array.
  const handleDelete = (product) => {
    if (!window.confirm(`¿Borrar ${product.description}? No se puede deshacer.`)) return

    fetch(`${URL}/products/${product.id}`, {
      method: 'DELETE',
      headers: headers(token),
    })
      .then(handleResponse)
      .then(() => {
        setProducts((prev) => prev.filter((p) => p.id !== product.id))
        showNotice(`Borraste ${product.description}.`)
      })
      .catch((err) =>
        setError(
          errorText(
            err,
            `No se puede borrar ${product.description}: ya está en compras o carritos. Podés dejarlo sin stock.`,
          ),
        ),
      )
  }

  const startEdit = (product) => {
    setEditing(product)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) return <p className="loading">Cargando productos…</p>

  return (
    <>
      {error && <div className="alert">{error}</div>}
      {notice && <div className="alert alert-ok">{notice}</div>}

      {editing ? (
        // La key hace que el formulario se arme de cero al cambiar de
        // producto, sin un useEffect que copie la prop al estado.
        <ProductForm
          key={editing === 'new' ? 'new' : editing.id}
          product={editing === 'new' ? null : editing}
          categories={categories}
          saving={saving}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <div className="admin-header">
          <p className="muted">
            {products.length} {products.length === 1 ? 'producto publicado' : 'productos publicados'}
          </p>
          <button type="button" className="btn" onClick={() => setEditing('new')}>
            Nuevo producto
          </button>
        </div>
      )}

      {products.length === 0 ? (
        <div className="empty-state">
          <h2>Todavía no hay productos</h2>
          <p>Publicá el primero con el botón Nuevo producto.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>
                  <span className="sr-only">Foto</span>
                </th>
                <th>Producto</th>
                <th>Categoría</th>
                <th className="num">Precio final</th>
                <th>Stock</th>
                <th>
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <ProductPhoto product={product} className="thumb" />
                  </td>
                  <td>
                    {product.description}
                    {product.discount > 0 && (
                      <div className="product-meta">{product.discount}% de descuento</div>
                    )}
                  </td>
                  <td>{product.category?.description ?? <span className="muted">Sin categoría</span>}</td>
                  <td className="num">{formatPrice(product.finalPrice)}</td>
                  <td>
                    {/* La key incluye el stock: si cambia, la celda se reinicia sola. */}
                    <StockCell
                      key={`${product.id}-${product.stock}`}
                      product={product}
                      onSave={handleStock}
                    />
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="btn btn-outline btn-small"
                        onClick={() => startEdit(product)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-small"
                        onClick={() => handleDelete(product)}
                      >
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default AdminProducts
