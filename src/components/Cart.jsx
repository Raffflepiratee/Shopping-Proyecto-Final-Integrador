import { Link } from "react-router-dom"
import useCart from "../context/useCart"
import CartItem from "./CartItem"

export default function Cart() {
  const { items, loading, totalQuantity, totalPrice, clearCart } = useCart()

  if (loading) {
    return <p>Cargando carrito...</p>
  }

  if (items.length === 0) {
    return <p>Tu carrito está vacío.</p>
  }

  const handleClearCart = async () => {
    await clearCart()
  }

  return (
    <section className="cart-view">
      <ul className="cart-list">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </ul>

      <aside className="cart-summary">
        <p>Total de unidades: {totalQuantity}</p>
        <p>Total acumulado: ${totalPrice.toFixed(2)}</p>

        <div className="cart-summary-actions">
          <button type="button" onClick={handleClearCart}>
            Vaciar carrito
          </button>
          <Link to="/checkout">Ir a checkout</Link>
        </div>
      </aside>
    </section>
  )
}
