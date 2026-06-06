import { Route, Routes } from "react-router-dom"
import { useEffect } from "react"
import { initializeAuth, onUserChange } from "./firebase"
import Layout from "./pages/Layout"
import ItemListPage from "./pages/ItemListPage"
import ItemDetailPage from "./pages/ItemDetailPage"
import CartPage from "./pages/CartPage"
import CheckoutPage from "./pages/CheckoutPage"
import OrderConfirmation from "./pages/OrderConfirmation"

function App() {
  useEffect(() => {
    initializeAuth()
    const unsubscribe = onUserChange((user) => {
      if (user) {
        console.log("Usuario autenticado:", user.uid)
      } else {
        console.log("Usuario no autenticado")
      }
    })
    return () => unsubscribe()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ItemListPage />} />
        <Route path="products" element={<ItemListPage />} />
        <Route path="product/:id" element={<ItemDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order/:orderId" element={<OrderConfirmation />} />
      </Route>
    </Routes>
  )
}

export default App
