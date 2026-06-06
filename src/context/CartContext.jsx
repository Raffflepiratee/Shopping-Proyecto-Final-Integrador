import { useCallback, useEffect, useMemo, useState } from "react"
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  writeBatch,
} from "firebase/firestore"
import { db, onUserChange } from "../firebase"
import CartContext from "./cartContext"

export function CartProvider({ children }) {
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribeUser = onUserChange((nextUser) => {
      setUser(nextUser)
      setLoading(Boolean(nextUser))

      if (!nextUser) {
        setItems([])
      }
    })

    return () => unsubscribeUser()
  }, [])

  useEffect(() => {
    if (!user) {
      return undefined
    }
    const cartCollection = collection(db, "users", user.uid, "cart")

    const unsubscribeCart = onSnapshot(
      cartCollection,
      (snapshot) => {
        setItems(
          snapshot.docs.map((snapshotDoc) => ({
            id: snapshotDoc.id,
            ...snapshotDoc.data(),
          })),
        )
        setLoading(false)
      },
      (error) => {
        console.error("Error escuchando carrito:", error)
        setItems([])
        setLoading(false)
      },
    )

    return () => unsubscribeCart()
  }, [user])

  const addItem = useCallback(
    async (productData, quantity = 1) => {
      if (!user) {
        return { ok: false, error: "No hay usuario autenticado" }
      }

      const safeQuantity = Number.parseInt(quantity, 10)
      const safeStock = Number.parseInt(productData?.stock ?? 0, 10)

      if (!productData?.id) {
        return { ok: false, error: "Producto inválido" }
      }

      if (!Number.isFinite(safeQuantity) || safeQuantity < 1) {
        return { ok: false, error: "La cantidad debe ser mayor a cero" }
      }

      if (Number.isFinite(safeStock) && safeStock <= 0) {
        return { ok: false, error: "No hay stock disponible" }
      }

      try {
        const cartRef = doc(db, "users", user.uid, "cart", productData.id)
        const existing = await getDoc(cartRef)
        const currentQuantity = existing.exists()
          ? Number(existing.data().quantity ?? 0)
          : 0
        const nextQuantity = currentQuantity + safeQuantity

        if (Number.isFinite(safeStock) && nextQuantity > safeStock) {
          return {
            ok: false,
            error: `Solo hay ${safeStock} unidades disponibles`,
          }
        }

        await setDoc(
          cartRef,
          {
            productId: productData.id,
            name: productData.name ?? "",
            description: productData.description ?? "",
            price: Number(productData.price ?? 0),
            stock: safeStock,
            quantity: nextQuantity,
          },
          { merge: true },
        )

        return { ok: true }
      } catch (error) {
        console.error("Error agregando al carrito:", error)
        return { ok: false, error: "No se pudo agregar el producto al carrito" }
      }
    },
    [user],
  )

  const removeItem = useCallback(
    async (productId) => {
      if (!user) {
        return { ok: false, error: "No hay usuario autenticado" }
      }

      try {
        await deleteDoc(doc(db, "users", user.uid, "cart", productId))
        return { ok: true }
      } catch (error) {
        console.error("Error eliminando item del carrito:", error)
        return { ok: false, error: "No se pudo eliminar el producto" }
      }
    },
    [user],
  )

  const clearCart = useCallback(async () => {
    if (!user) {
      return { ok: false, error: "No hay usuario autenticado" }
    }

    try {
      const batch = writeBatch(db)
      items.forEach((item) => {
        batch.delete(doc(db, "users", user.uid, "cart", item.id))
      })

      await batch.commit()
      return { ok: true }
    } catch (error) {
      console.error("Error vaciando carrito:", error)
      return { ok: false, error: "No se pudo vaciar el carrito" }
    }
  }, [items, user])

  const totalQuantity = items.reduce(
    (sum, item) => sum + Number(item.quantity ?? 0),
    0,
  )
  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.price ?? 0) * Number(item.quantity ?? 0),
    0,
  )

  const value = useMemo(
    () => ({
      items,
      loading,
      user,
      addItem,
      removeItem,
      clearCart,
      totalQuantity,
      totalPrice,
    }),
    [
      addItem,
      clearCart,
      items,
      loading,
      removeItem,
      totalPrice,
      totalQuantity,
      user,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
