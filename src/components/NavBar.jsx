import { NavLink } from "react-router-dom"
import CartWidget from "./CartWidget"

export default function NavBar() {
  return (
    <nav className="navbar">
      <NavLink className="navbar-brand" to="/">
        Fire Store 🔥
      </NavLink>

      <div className="nav-links">
        <NavLink to="/">Catalogo</NavLink>
        <CartWidget />
        <NavLink to="/checkout">Checkout</NavLink>
      </div>
    </nav>
  )
}
