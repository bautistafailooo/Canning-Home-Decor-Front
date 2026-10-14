import { useState } from 'react'
import { formatDate, formatPrice } from '../api/config'

// Una compra del historial.
//
// El encabezado es un boton: al tocarlo se despliegan los articulos. La
// transicion existe para mostrar QUE cambio cuando la persona hace algo,
// no para que la pantalla se mueva sola al cargar.
//
// El detalle se dibuja siempre, aunque este cerrado: asi el buscador del
// navegador (Ctrl+F) lo encuentra, y aria-expanded le dice a un lector de
// pantalla si esta abierto o no.
function OrderCard({ order, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <article className={open ? 'order order-open' : 'order'}>
      <button
        type="button"
        className="order-header"
        onClick={() => setOpen((estaba) => !estaba)}
        aria-expanded={open}
      >
        <span className="order-id">
          <span className="order-number">Pedido {order.id}</span>
          <span className="order-date">{formatDate(order.createdAt)}</span>
        </span>

        <span className="order-right">
          <span className="order-total">{formatPrice(order.total)}</span>
          <span className="order-chevron" aria-hidden="true" />
        </span>
      </button>

      <div className="order-body">
        <div className="order-body-inner">
          <ul className="order-items">
            {order.items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.quantity} × {item.product.description}
                </span>
                <span>{formatPrice(item.subtotal)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}

export default OrderCard
