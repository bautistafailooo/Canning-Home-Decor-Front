import { useState } from 'react'
import { Link } from 'react-router-dom'
import { errorText, formatPrice } from '../api/config'
import { useCart } from '../context/CartContext'
import CartLine from '../components/CartLine'
import ConfirmButton from '../components/ConfirmButton'

// Esta vista NO tiene useEffect: el carrito ya lo trajo CartContext una
// sola vez. Cada accion actualiza el estado con lo que devuelve el back.
function Cart() {
  const { cart, loading, units, updateItem, removeItem, clearCart, checkout } = useCart()
  const [busyItemId, setBusyItemId] = useState(null)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)

  // Mensajes segun lo que responde el back.
  const explain = (err) =>
    err.status === 400
      ? 'No hay stock suficiente para esa cantidad.'
      : errorText(err, 'No se pudo actualizar el carrito. Probá de nuevo.')

  // Marca la fila ocupada mientras viaja el pedido.
  const runOnItem = (itemId, action) => {
    setBusyItemId(itemId)
    setError('')
    action()
      .catch((err) => setError(explain(err)))
      .finally(() => setBusyItemId(null))
  }

  const handleQuantity = (item, quantity) =>
    runOnItem(item.id, () => updateItem(item.id, quantity))

  const handleRemove = (item) => runOnItem(item.id, () => removeItem(item.id))

  const handleClear = () => {
    setWorking(true)
    setError('')
    clearCart()
      .catch((err) => setError(errorText(err, 'No se pudo vaciar el carrito. Probá de nuevo.')))
      .finally(() => setWorking(false))
  }

  const handleCheckout = () => {
    setWorking(true)
    setError('')
    checkout()
      .then(setOrder)
      .catch((err) =>
        setError(
          err.status === 400
            ? 'Alguno de los productos ya no tiene stock suficiente. Revisá las cantidades.'
            : errorText(err, 'No se pudo confirmar la compra. Probá de nuevo.'),
        ),
      )
      .finally(() => setWorking(false))
  }

  // Compra confirmada: se muestra la orden que devolvio el back.
  if (order) {
    return (
      <section className="receipt">
        <h1>¡Gracias por tu compra!</h1>
        <p className="muted">Pedido número {order.id}. Ya descontamos el stock de cada producto.</p>
        <ul>
          {order.items.map((item) => (
            <li key={item.id}>
              <span>
                {item.quantity} × {item.product.description}
              </span>
              <strong>{formatPrice(item.subtotal)}</strong>
            </li>
          ))}
        </ul>
        <div className="summary-row summary-total">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
        <div className="form-actions">
          <Link to="/mis-compras" className="btn">
            Ver mis compras
          </Link>
          <Link to="/catalogo" className="btn btn-outline">
            Seguir comprando
          </Link>
        </div>
      </section>
    )
  }

  if (loading) return <p className="loading">Cargando tu carrito…</p>

  if (cart.items.length === 0) {
    return (
      <section className="empty-state">
        <h1>Tu carrito está vacío</h1>
        <p>Cuando agregues productos desde la tienda, van a aparecer acá.</p>
        <Link to="/catalogo" className="btn">
          Ir al catálogo
        </Link>
      </section>
    )
  }

  const busy = working || busyItemId !== null

  return (
    <>
      <h1>Tu carrito</h1>

      {error && <div className="alert">{error}</div>}

      <div className="cart">
        <div>
          <ul className="cart-lines">
            {cart.items.map((item) => (
              <CartLine
                key={item.id}
                item={item}
                busy={busyItemId === item.id || working}
                onQuantity={handleQuantity}
                onRemove={handleRemove}
              />
            ))}
          </ul>
          <ConfirmButton
            label="Vaciar el carrito"
            question="¿Vaciar el carrito?"
            confirmLabel="Sí, vaciar"
            className="link-button clear-cart"
            onConfirm={handleClear}
            disabled={busy}
          />
        </div>

        <aside className="summary">
          <h2>Resumen</h2>
          <div className="summary-row">
            <span className="muted">
              {units} {units === 1 ? 'unidad' : 'unidades'}
            </span>
            <span>{formatPrice(cart.total)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{formatPrice(cart.total)}</span>
          </div>
          <button type="button" className="btn btn-block" onClick={handleCheckout} disabled={busy}>
            {working ? 'Procesando…' : 'Confirmar compra'}
          </button>
        </aside>
      </div>
    </>
  )
}

export default Cart
