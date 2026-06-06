import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getOrderById } from "../firebase"

export default function OrderConfirmation() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    const loadOrder = async () => {
      const data = await getOrderById(orderId)
      if (!ignore) {
        setOrder(data)
        setLoading(false)
      }
    }

    loadOrder()

    return () => {
      ignore = true
    }
  }, [orderId])

  if (loading) {
    return <p>Cargando orden...</p>
  }

  if (!order) {
    return (
      <div className="order-confirmation">
        <h1>Orden no encontrada</h1>
        <p>No pudimos encontrar la orden solicitada.</p>
        <Link to="/">Volver al catálogo</Link>
      </div>
    )
  }

  return (
    <div className="order-confirmation">
      <h1>Orden Confirmada</h1>
      <p>Tu orden se procesó correctamente.</p>
      <p>
        <strong>ID:</strong> {order.id}
      </p>

      <section className="order-confirmation-section">
        <h2>Comprador</h2>
        <p>
          Nombre: {order.buyer?.firstName} {order.buyer?.lastName}
        </p>
        <p>Email: {order.buyer?.email}</p>
        <p>Telefono: {order.buyer?.phone}</p>
        <p>Dirección: {order.buyer?.address}</p>
      </section>

      <section className="order-confirmation-section">
        <h2>Productos</h2>
        <ul className="order-confirmation-list">
          {order.items?.map((item) => (
            <li key={item.productId}>
              {item.name} x {item.quantity} - ${item.subtotal.toFixed(2)}
            </li>
          ))}
        </ul>
      </section>

      <section className="order-confirmation-section">
        <p>
          <strong>Total:</strong> ${Number(order.total ?? 0).toFixed(2)}
        </p>
        <p>
          <strong>Fecha:</strong>{" "}
          {order.date ? new Date(order.date).toLocaleString() : "Sin fecha"}
        </p>
      </section>

      <Link className="order-confirmation-link" to="/">
        Volver al catálogo
      </Link>
    </div>
  )
}
