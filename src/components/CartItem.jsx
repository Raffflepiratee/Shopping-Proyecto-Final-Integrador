import useCart from "../context/useCart"

export default function CartItem({ item }) {
  const { removeItem } = useCart()
  const subtotal = Number(item.price ?? 0) * Number(item.quantity ?? 0)

  const handleRemove = async () => {
    await removeItem(item.id)
  }

  return (
    <li className="cart-item">
      <div className="cart-item-main">
        <h2>{item.name}</h2>
        <p>Cantidad: {item.quantity}</p>
        <p>Precio unitario: ${Number(item.price ?? 0).toFixed(2)}</p>
      </div>

      <div className="cart-item-side">
        <strong>Subtotal: ${subtotal.toFixed(2)}</strong>
        <button type="button" onClick={handleRemove}>
          Eliminar
        </button>
      </div>
    </li>
  )
}
