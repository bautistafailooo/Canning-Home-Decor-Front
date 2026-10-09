// Primera foto del producto o, si no tiene, la inicial sobre un fondo liso.
const ProductPhoto = ({ product, src }) => {
  const url = src ?? product.imageUrls?.[0]

  if (!url) {
    return (
      <div className="photo-placeholder" aria-hidden="true">
        {product.description?.charAt(0) ?? '?'}
      </div>
    )
  }

  return <img src={url} alt={product.description} loading="lazy" />
}

export default ProductPhoto
