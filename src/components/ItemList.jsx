import Item from "./Item"
import { getProducts } from "../firebase"
import { useEffect, useState } from "react"

// Accept optional `products` prop. If provided, render those; otherwise fetch.
export default function ItemList({ products: externalProducts = null }) {
  const [fetchedProducts, setFetchedProducts] = useState([])
  const [loading, setLoading] = useState(!externalProducts)

  useEffect(() => {
    if (externalProducts) {
      return
    }

    let ignore = false

    const loadProducts = async () => {
      const data = await getProducts()

      if (!ignore) {
        setFetchedProducts(data)
        setLoading(false)
      }
    }

    loadProducts()

    return () => {
      ignore = true
    }
  }, [externalProducts])

  const products = externalProducts ?? fetchedProducts
  const isLoading = externalProducts ? false : loading

  if (isLoading) {
    return <div>Cargando productos...</div>
  }

  return (
    <div className="product-grid">
      {products.length === 0 ? (
        <p>No hay productos disponibles</p>
      ) : (
        products.map((product) => (
          <Item
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            stock={product.stock}
          />
        ))
      )}
    </div>
  )
}
