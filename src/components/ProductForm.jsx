import { useState } from 'react'
import PhotoUploader from './PhotoUploader'

// Pasa un producto del back al formato del formulario (todo como texto).
const toForm = (product) => ({
  description: product?.description ?? '',
  price: product?.price ?? '',
  stock: product?.stock ?? '',
  discount: product?.discount ?? 0,
  categoryId: product?.category?.id ?? '',
  // Array de direcciones: la primera es la portada.
  imageUrls: product?.imageUrls ?? [],
})

// Formulario de alta y edicion de productos.
// El estado inicial sale del producto que se edita. Cuando el padre quiere
// editar OTRO producto, le cambia la "key" y React crea un formulario nuevo.
// Por eso no hace falta un useEffect que copie la prop al estado.
const ProductForm = ({ product, categories, saving, onSubmit, onCancel }) => {
  const [form, setForm] = useState(() => toForm(product))
  const isEditing = Boolean(product)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      discount: Number(form.discount) || 0,
      categoryId: form.categoryId === '' ? null : Number(form.categoryId),
      imageUrls: form.imageUrls,
    })
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>{isEditing ? `Editar: ${product.description}` : 'Nuevo producto'}</h2>

      <div className="field">
        <label htmlFor="description">Nombre del producto</label>
        <input
          id="description"
          name="description"
          required
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="price">Precio</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.price}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="discount">Descuento (%)</label>
          <input
            id="discount"
            name="discount"
            type="number"
            min="0"
            max="100"
            value={form.discount}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            required
            value={form.stock}
            onChange={handleChange}
          />
        </div>
        <div className="field">
          <label htmlFor="categoryId">Categoría</label>
          <select id="categoryId" name="categoryId" value={form.categoryId} onChange={handleChange}>
            <option value="">Sin categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="photos">Fotos</label>
        <PhotoUploader
          urls={form.imageUrls}
          onChange={(imageUrls) => setForm({ ...form, imageUrls })}
          disabled={saving}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn" disabled={saving}>
          {saving ? 'Guardando…' : isEditing ? 'Guardar cambios' : 'Publicar producto'}
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default ProductForm
