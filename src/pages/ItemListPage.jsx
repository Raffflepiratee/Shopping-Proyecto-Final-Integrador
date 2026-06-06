import ItemList from "../components/ItemList"
import { useEffect, useMemo, useState } from "react"
import { getProducts } from "../firebase"

export default function ItemListPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    let ignore = false

    const load = async () => {
      const data = await getProducts()
      if (!ignore) {
        setProducts(data)
        setLoading(false)
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [])

  const categories = useMemo(() => {
    const setCat = new Set()
    products.forEach((p) => {
      if (p?.category) setCat.add(p.category)
    })
    return Array.from(setCat)
  }, [products])

  const filtered = useMemo(() => {
    if (selectedCategory === "All") return products
    return products.filter((p) => p?.category === selectedCategory)
  }, [products, selectedCategory])

  return (
    <div>
      <h1>Lista de Productos</h1>

      <div className="category-bar">
        <button
          className={`category-button ${selectedCategory === "All" ? "active" : ""}`}
          onClick={() => setSelectedCategory("All")}
        >
          Todo
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-button ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <ItemList products={filtered} />
      )}
    </div>
  )
}
