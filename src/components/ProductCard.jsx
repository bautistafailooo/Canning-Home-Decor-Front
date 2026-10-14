import { Link } from 'react-router-dom'
import Price from './Price'
import ProductPhoto from './ProductPhoto'

// Como PostCard del proyecto base: solo recibe datos por props y los
// muestra. No llama a la API.
function ProductCard({ product, onAdd, adding }) {
  return (
    <article className="product-card">
      <Link to={`/productos/${product.id}`}>
        <div className="product-photo">
          <ProductPhoto product={product} />
                    {/* Si hay una segunda foto, aparece al pasar el mouse (solo CSS). */}
          {product.imageUrls?.[1] && (
            <ProductPhoto product={product} src={product.imageUrls[1]} className="photo-hover" />
          )}
          {!product.available && <span className="tag tag-out">Sin stock</span>}
          {product.available && product.discount > 0 && (
            <span className="tag">-{product.discount}%</span>
          )}
        </div>
      </Link>

      <div>
        <Link to={`/productos/${product.id}`}>
          <h3>{product.description}</h3>
        </Link>
        {product.category && <p className="product-meta">{product.category.description}</p>}
      </div>

      <Price product={product} />

      {onAdd && (
        <button
          type="button"
          className="btn btn-outline btn-small"
          onClick={() => onAdd(product)}
          disabled={!product.available || adding}
        >
          {adding ? 'Agregando…' : product.available ? 'Agregar al carrito' : 'Sin stock'}
        </button>
      )}
    </article>
  )
}

export default ProductCard
