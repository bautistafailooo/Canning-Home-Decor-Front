import { Link } from 'react-router-dom'
import { formatPrice } from '../api/config'
import ProductPhoto from './ProductPhoto'
import QuantityPicker from './QuantityPicker'

// Una fila del carrito. Avisa al padre que cambio; no llama a la API.
const CartLine = ({ item, busy, onQuantity, onRemove }) => {
  const { product } = item

  return (
    <li className="cart-line">
      <div className="cart-line-photo">
        <ProductPhoto product={product} />
      </div>

      <div>
        <Link to={`/productos/${product.id}`} className="cart-line-name">
          <h3>{product.description}</h3>
        </Link>
        <p className="product-meta">{formatPrice(product.finalPrice)} c/u</p>
      </div>

      <div className="cart-line-actions">
        <QuantityPicker
          value={item.quantity}
          max={product.stock}
          onChange={(quantity) => onQuantity(item, quantity)}
          disabled={busy}
        />
        <span className="cart-line-subtotal">{formatPrice(item.subtotal)}</span>
        <button type="button" className="link-button" onClick={() => onRemove(item)} disabled={busy}>
          Quitar
        </button>
      </div>
    </li>
  )
}

export default CartLine
