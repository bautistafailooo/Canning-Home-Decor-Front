import { formatPrice } from '../api/config'

// Muestra el precio final (ya con descuento) y, si hay descuento,
// el precio original tachado. finalPrice lo calcula el back.
const Price = ({ product, big = false }) => {
  const hasDiscount = product.discount > 0

  return (
    <div className={big ? 'price price-big' : 'price'}>
      <span className="price-final">{formatPrice(product.finalPrice)}</span>
      {hasDiscount && <span className="price-old">{formatPrice(product.price)}</span>}
    </div>
  )
}

export default Price
