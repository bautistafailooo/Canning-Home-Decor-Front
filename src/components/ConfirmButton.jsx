import { useState } from 'react'

// Boton para acciones que no se pueden deshacer (borrar, vaciar, dar de
// baja). Al tocarlo no hace nada todavia: muestra la pregunta en el mismo
// lugar, con "Si" y "Cancelar". Reemplaza a window.confirm usando estado
// de React, y se reutiliza en el carrito y en las tres pantallas del panel.
function ConfirmButton({ label, question, confirmLabel = 'Sí', onConfirm, className, disabled }) {
  const [asking, setAsking] = useState(false)

  if (!asking) {
    return (
      <button type="button" className={className} onClick={() => setAsking(true)} disabled={disabled}>
        {label}
      </button>
    )
  }

  const handleYes = () => {
    setAsking(false)
    onConfirm()
  }

  return (
    <span className="confirm" role="group" aria-label={question}>
      <span className="confirm-question">{question}</span>
      <button type="button" className="btn btn-danger btn-small" onClick={handleYes} disabled={disabled}>
        {confirmLabel}
      </button>
      <button type="button" className="btn btn-outline btn-small" onClick={() => setAsking(false)}>
        Cancelar
      </button>
    </span>
  )
}

export default ConfirmButton
