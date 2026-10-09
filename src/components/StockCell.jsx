import { useState } from 'react'

// Celda para corregir el stock sin abrir el formulario completo.
// Se guarda con Enter o con el boton (PATCH /products/{id}/stock).
const StockCell = ({ product, onSave }) => {
  const [value, setValue] = useState(String(product.stock))
  const [saving, setSaving] = useState(false)

  const changed = value !== '' && Number(value) !== product.stock

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!changed) return
    setSaving(true)
    await onSave(product, Number(value))
    setSaving(false)
  }

  return (
    <form className="stock-form" onSubmit={handleSubmit}>
      <input
        className="stock-input"
        type="number"
        min="0"
        aria-label={`Stock de ${product.description}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {changed && (
        <button type="submit" className="btn btn-small" disabled={saving}>
          {saving ? '…' : 'Guardar'}
        </button>
      )}
    </form>
  )
}

export default StockCell
