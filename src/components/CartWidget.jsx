import { NavLink } from "react-router-dom"
import useCart from "../context/useCart"

export default function CartWidget() {
  const { totalQuantity } = useCart()

  return (
    <NavLink
      className="cart-widget"
      to="/cart"
      aria-label={`Carrito con ${totalQuantity} unidades`}
    >
      <span className="cart-widget-label">🛒 Carrito</span>
      <span className="cart-widget-count">{totalQuantity}</span>
    </NavLink>
  )
}
