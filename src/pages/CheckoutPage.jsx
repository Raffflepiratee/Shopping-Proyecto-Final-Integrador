import { useCallback, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import CheckoutForm from "../components/CheckoutForm"
import useCart from "../context/useCart"
import { addOrder } from "../firebase"

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, loading, totalPrice, clearCart } = useCart()
  const [buyer, setBuyer] = useState(null)
  const [isFormValid, setIsFormValid] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const orderItems = useMemo(
    () =>
      items.map((item) => ({
        productId: item.productId ?? item.id,
        name: item.name,
        price: Number(item.price ?? 0),
        quantity: Number(item.quantity ?? 0),
        subtotal: Number(item.price ?? 0) * Number(item.quantity ?? 0),
      })),
    [items],
  )

  const handleFormChange = useCallback(({ data, isValid }) => {
    setBuyer(data)
    setIsFormValid(isValid)
    setError("")
  }, [])

  const handleConfirmPurchase = async () => {
    if (!items.length) {
      setError("No podés confirmar la compra sin productos en el carrito.")
      return
    }

    if (!buyer || !isFormValid) {
      setError("Completá todos los datos del comprador para continuar.")
      return
    }

    setSubmitting(true)
    setError("")

    const orderData = {
      buyer: {
        firstName: buyer.firstName.trim(),
        lastName: buyer.lastName.trim(),
        email: buyer.email.trim(),
        phone: buyer.phone.trim(),
        address: buyer.address.trim(),
      },
      items: orderItems,
      total: totalPrice,
    }

    const orderId = await addOrder(orderData)

    if (!orderId) {
      setError("No se pudo crear la orden. Intentá nuevamente.")
      setSubmitting(false)
      return
    }

    await clearCart()
    navigate(`/order/${orderId}`)
  }

  if (loading) {
    return <p>Cargando carrito...</p>
  }

  if (!items.length) {
    return (
      <div className="checkout-empty-state">
        <h1>Finalizar Compra</h1>
        <p>No podés confirmar una compra sin productos en el carrito.</p>
        <Link to="/">Volver al catálogo</Link>
      </div>
    )
  }

  return (
    <section className="checkout-page">
      <div className="checkout-layout">
        <div className="checkout-panel checkout-panel-left">
          <h1>Finalizar Compra</h1>
          <p>Completá tus datos para confirmar la orden.</p>
          <CheckoutForm onChange={handleFormChange} />
        </div>

        <aside className="checkout-panel checkout-panel-right">
          <h2>Resumen del carrito</h2>

          <ul className="checkout-summary-list">
            {orderItems.map((item) => (
              <li key={item.productId} className="checkout-summary-item">
                <div>
                  <strong>{item.name}</strong>
                  <p>Cantidad: {item.quantity}</p>
                </div>
                <span>${item.subtotal.toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="checkout-summary-total">
            <span>Total</span>
            <strong>${totalPrice.toFixed(2)}</strong>
          </div>

          {error ? <p className="checkout-error">{error}</p> : null}

          <button
            type="button"
            className="checkout-confirm-button"
            onClick={handleConfirmPurchase}
            disabled={!isFormValid || submitting || !items.length}
          >
            {submitting ? "Procesando..." : "Confirmar compra"}
          </button>
        </aside>
      </div>
    </section>
  )
}