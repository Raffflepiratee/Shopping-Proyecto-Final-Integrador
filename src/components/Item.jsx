import { useState } from "react"
import { Link } from "react-router-dom"
import useCart from "../context/useCart"

export default function Item(props) {
  const { addItem } = useCart()
  const [feedback, setFeedback] = useState("")

  const handleAddToCart = async () => {
    const result = await addItem(
      {
        id: props.id,
        name: props.name,
        description: props.description,
        price: props.price,
        stock: props.stock,
      },
      1,
    )

    setFeedback(result.ok ? "Agregado al carrito" : result.error)
  }

  return (
    <div className="item-card">
      <h2>{props.name}</h2>
      <p>Price: ${props.price.toFixed(2)}</p>
      <p>Stock: {props.stock}</p>
      {feedback ? <p className="item-feedback">{feedback}</p> : null}
      <div className="item-actions">
        <Link className="details-link" to={`/product/${props.id}`}>
          Detalles
        </Link>
        <button onClick={handleAddToCart} disabled={props.stock <= 0}>
          {props.stock <= 0 ? "Sin stock" : "Agegar al carrito"}
        </button>
      </div>
    </div>
  )
}
