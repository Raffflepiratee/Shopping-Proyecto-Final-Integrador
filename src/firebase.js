import { initializeApp } from 'firebase/app'
import { getFirestore, getDocs, collection, addDoc, query, where, doc, getDoc, setDoc } from 'firebase/firestore'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAzA6lgWc3tptuzFmeExywJKm3VMViGcf4",
  authDomain: "fnlprjct-coder.firebaseapp.com",
  projectId: "fnlprjct-coder",
  storageBucket: "fnlprjct-coder.firebasestorage.app",
  messagingSenderId: "961458825187",
  appId: "1:961458825187:web:4f73a4acf538855e1a62d6"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// AUTENTICACION ANONIMA
export const initializeAuth = async () => {
  try {
    await signInAnonymously(auth)
    console.log('Usuario anónimo autenticado')
  } catch (error) {
    console.error('Error en autenticación:', error)
  }
}

export const onUserChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('Usuario autenticado:', user.uid)
      callback(user)
    } else {
      console.log('Usuario no autenticado')
      callback(null)
    }
  })
}

// FUNCIONES PARA PRODUCTOS
export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'productos'))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error obteniendo productos:', error)
    return []
  }
}

export const getProductById = async (id) => {
  try {
    const q = query(collection(db, 'productos'), where('__name__', '==', id))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs[0]?.data()
  } catch (error) {
    console.error('Error obteniendo producto:', error)
    return null
  }
}

export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, 'productos'), productData)
    console.log('Producto creado:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('Error creando producto:', error)
    return null
  }
}

// FUNCIONES PARA CARRITO
export const addToCart = async (productData) => {
  const user = auth.currentUser
  if (!user) {
    console.error('No hay usuario autenticado')
    return null
  }

  try {
    const cartRef = doc(db, 'users', user.uid, 'cart', productData.id)
    const existing = await getDoc(cartRef)
    const currentQty = existing.exists() ? existing.data().quantity || 0 : 0

    await setDoc(
      cartRef,
      {
        productId: productData.id,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        quantity: currentQty + 1
      },
      { merge: true }
    )

    return cartRef.id
  } catch (error) {
    console.error('Error agregando al carrito:', error)
    return null
  }
}

export const getCartItems = async () => {
  const user = auth.currentUser
  if (!user) {
    console.error('No hay usuario autenticado')
    return []
  }

  try {
    const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'cart'))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error obteniendo carrito:', error)
    return []
  }
}

// FUNCIONES PARA ORDENES
export const addOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, 'ordenes'), {
      ...orderData,
      date: new Date().toISOString(),
      status: 'pending'
    })
    return docRef.id
  } catch (error) {
    console.error('Error creando orden:', error)
    return null
  }
}

export const getOrders = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'ordenes'))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error obteniendo órdenes:', error)
    return []
  }
}

export const getOrderById = async (id) => {
  try {
    const orderRef = doc(db, 'ordenes', id)
    const orderSnapshot = await getDoc(orderRef)

    if (!orderSnapshot.exists()) {
      return null
    }

    return { id: orderSnapshot.id, ...orderSnapshot.data() }
  } catch (error) {
    console.error('Error obteniendo orden:', error)
    return null
  }
}
