import { useState } from "react"

export default function ItemCount({
  stock = 0,
  initialQuantity = 1,
  onConfirm,
}) {
  const safeStock = Number.parseInt(stock, 10) || 0
  const [quantity, setQuantity] = useState(
    safeStock > 0 ? Math.min(Math.max(initialQuantity, 1), safeStock) : 0,
  )
  const [error, setError] = useState("")

  const validateQuantity = (value) => {
    if (!Number.isFinite(value)) {
      return "Ingresá una cantidad válida"
    }

    if (value < 1) {
      return "La cantidad mínima es 1"
    }

    if (safeStock > 0 && value > safeStock) {
      return `El máximo disponible es ${safeStock}`
    }

    return ""
  }

  const handleDecrease = () => {
    const nextQuantity = Math.max(1, quantity - 1)
    setQuantity(nextQuantity)
    setError(validateQuantity(nextQuantity))
  }

  const handleIncrease = () => {
    const nextQuantity = quantity + 1
    setQuantity(nextQuantity)
    setError(validateQuantity(nextQuantity))
  }

  const handleChange = (event) => {
    const nextQuantity = Number.parseInt(event.target.value, 10)
    setQuantity(Number.isFinite(nextQuantity) ? nextQuantity : 0)
    setError(validateQuantity(nextQuantity))
  }

  const handleConfirm = () => {
    const validationMessage = validateQuantity(quantity)

    if (validationMessage) {
      setError(validationMessage)
      return
    }

    if (typeof onConfirm === "function") {
      onConfirm(quantity)
    }
  }

  const displayedQuantity =
    safeStock > 0 ? Math.min(Math.max(quantity || 1, 1), safeStock) : 0
  const isInvalid = safeStock <= 0 || Boolean(error)
  const stockError = safeStock <= 0 ? "Sin stock disponible" : error

  return (
    <div className="item-count">
      <div className="item-count-controls">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={quantity <= 1 || safeStock <= 0}
        >
          -
        </button>
        <input
          type="number"
          min="1"
          max={safeStock}
          value={displayedQuantity}
          onChange={handleChange}
          disabled={safeStock <= 0}
        />
        <button
          type="button"
          onClick={handleIncrease}
          disabled={safeStock <= 0 || quantity >= safeStock}
        >
          +
        </button>
      </div>

      <p className="item-count-stock">Stock disponible: {safeStock}</p>
      {stockError ? <p className="item-count-error">{stockError}</p> : null}

      <button
        type="button"
        className="item-count-confirm"
        onClick={handleConfirm}
        disabled={isInvalid}
      >
        Agregar al carrito
      </button>
    </div>
  )
}
