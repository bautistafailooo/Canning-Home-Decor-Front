import { formatDate, formatPrice } from '../api/config'

// Una compra del historial. Solo muestra lo que recibe por props.
function OrderCard({ order }) {
  return (
    <article className="order">
      <header className="order-header">
        <div>
          <h2>Pedido {order.id}</h2>
          <p className="muted">{formatDate(order.createdAt)}</p>
        </div>
        <strong className="order-total">{formatPrice(order.total)}</strong>
      </header>

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
    </article>
  )
}

export default OrderCard
