import { useState } from 'react'

// Primera foto del producto o, si no tiene, la inicial sobre un fondo liso.
//
// Las direcciones de las fotos viven en la base y pueden quedar rotas (la
// foto se borro del servidor, se cargo mal una URL a mano). Sin avisarle
// nada al navegador, en ese caso dibuja su icono de imagen rota con el
// texto alternativo desparramado encima de la tarjeta. Con onError se
// muestra el mismo recuadro que cuando no hay foto.
const ProductPhoto = ({ product, src, className }) => {
  // Se guarda CUAL direccion fallo, no un simple true/false. Asi, cuando el
  // padre cambia de foto (la galeria del detalle), la direccion nueva deja
  // de coincidir con la que fallo y se intenta mostrar sola, sin useEffect.
  const [failedUrl, setFailedUrl] = useState(null)

  const url = src ?? product.imageUrls?.[0]
  const broken = Boolean(url) && url === failedUrl

  if (!url || broken) {
    return (
      <div className={className ? `photo-placeholder ${className}` : 'photo-placeholder'} aria-hidden="true">
        {product.description?.charAt(0) ?? '?'}
      </div>
    )
  }

  return (
    <img
      className={className}
      src={url}
      alt={product.description}
      loading="lazy"
      onError={() => setFailedUrl(url)}
    />
  )
}

export default ProductPhoto
