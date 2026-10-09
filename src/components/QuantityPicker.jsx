// Selector de cantidad - / + . No guarda estado propio: el padre decide.
const QuantityPicker = ({ value, min = 1, max, onChange, disabled }) => {
  return (
    <div className="qty">
      <button
        type="button"
        aria-label="Restar uno"
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
      >
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        aria-label="Sumar uno"
        onClick={() => onChange(value + 1)}
        disabled={disabled || (max !== undefined && value >= max)}
      >
        +
      </button>
    </div>
  )
}

export default QuantityPicker
