import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getProductById } from "../firebase"
import ItemCount from "../components/ItemCount"
import useCart from "../context/useCart"

export default function ItemDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const { addItem } = useCart()

  useEffect(() => {
    const loadProduct = async () => {
      const data = await getProductById(id)
      setProduct(data)
      setLoading(false)
    }

    loadProduct()
  }, [id])

  if (loading) {
    return <p>Cargando detalle...</p>
  }

  if (!product) {
    return <p>No se encontró el producto.</p>
  }

  const handleConfirm = async (quantity) => {
    const result = await addItem(
      {
        id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      },
      quantity,
    )

    setMessage(
      result.ok ? `Se agregaron ${quantity} unidades al carrito` : result.error,
    )
  }

  return (
    <div className="detail-card">
      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>Price: ${product.price.toFixed(2)}</p>
        <p>Stock: {product.stock}</p>
        <p>Categoría: {product.category}</p>
        <ItemCount stock={product.stock} onConfirm={handleConfirm} />
        {message ? <p className="detail-feedback">{message}</p> : null}
      </div>
    </div>
  )
}
