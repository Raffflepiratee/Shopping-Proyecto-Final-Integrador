**Resumen del proyecto y estado actual**

- **Proyecto:** SPA e-commerce (React + Vite)
- **Fecha:** 2026-06-03
- **Propósito del documento:** Registrar todo el contexto, decisiones, soluciones aplicadas y pendientes. Diseñado para que un agente AI pueda leerlo y continuar el trabajo.

**Estado general:**
- Aplicación con estructura mínima de `src/` y rutas configuradas.
- Integración básica con Firebase (Firestore) para productos, carrito y órdenes.
- Autenticación anónima activada desde la app (se inicializa en `App.jsx`).
- Carrito persistente por usuario en Firestore bajo `users/{uid}/cart/{productId}`.
- Páginas principales implementadas: listado (`ItemListPage`), detalle (`ItemDetailPage`), carrito (`CartPage`), checkout (esqueleto).

**Archivos clave (ubicación en repo):**
- Config y helpers Firebase: [src/firebase.js](src/firebase.js)
- Entrada y rutas: [src/App.jsx](src/App.jsx)
- Estilos globales y de layout: [src/App.css](src/App.css) y [src/index.css](src/index.css)
- Componentes:
  - [src/components/ItemList.jsx](src/components/ItemList.jsx) — carga productos desde Firestore y renderiza la grilla
  - [src/components/Item.jsx](src/components/Item.jsx) — tarjeta de producto; `Add to Cart` usa `addToCart`; `Details` enlaza a `/product/:id`
  - [src/components/NavBar.jsx](src/components/NavBar.jsx)
- Pages:
  - [src/pages/ItemListPage.jsx](src/pages/ItemListPage.jsx)
  - [src/pages/ItemDetailPage.jsx](src/pages/ItemDetailPage.jsx)
  - [src/pages/CartPage.jsx](src/pages/CartPage.jsx)
  - [src/pages/CheckoutPage.jsx](src/pages/CheckoutPage.jsx)

**Qué se implementó (resumen técnico):**
1. Estructura limpia de `src` con `components/` y `pages/` (archivos .jsx).
2. `src/firebase.js` contiene:
   - Inicialización de Firebase app y `auth`, `db` (Firestore).
   - Funciones: `getProducts`, `getProductById`, `addProduct`, `addOrder`, `getOrders`.
   - Autenticación: `initializeAuth()` y `onUserChange(callback)` para escuchar cambios de usuario.
   - Carrito: `addToCart(productData)` que escribe en `users/{uid}/cart/{productId}` (incrementa `quantity` si existe) y `getCartItems()` para leer items del carrito.
3. `App.jsx` llama `initializeAuth()` en `useEffect` y suscribe `onUserChange`.
4. `ItemList` usa `getProducts()` y renderiza una grilla de tarjetas; anteriormente tenía un botón para crear productos demo (se usó para poblar Firestore), que puede eliminarse cuando ya no sea necesario.
5. `Item.jsx` implementa `handleAddToCart()` que llama `addToCart()` y redirige a detalle con `Link`.
6. `CartPage.jsx` carga `getCartItems()` y lista los ítems del carrito.
7. `ItemDetailPage.jsx` consume `useParams()` y carga el producto con `getProductById(id)`.
8. Estilos básicos añadidos en `src/App.css` para grilla y tarjetas.

**Decisiones técnicas y por qué:**
- Usar Firestore para persistencia: permite ver estado real entre recargas y entregar datos reales para la evaluación.
- Autenticación anónima: evita que el usuario tenga que registrarse y permite asociar un carrito a un `uid` (requerido por reglas de seguridad semi‑seguras).
- Guardar carrito en `users/{uid}/cart` en lugar de una colección global: evita colisiones entre usuarios y facilita consultas por usuario.
- Funciones helper en `src/firebase.js`: mantiene lógica de BD centralizada evitando duplicación en componentes.

**Reglas de seguridad recomendadas (Firestore Rules):**
- Modo semi‑seguro usado durante el desarrollo:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
- Para producción: restringir `read` por colección/campo y evitar `allow write: if request.auth != null` global.

**Cómo probar localmente (rápido):**
1. Asegurate de tener `node` y dependencias instaladas (el repo ya tiene `package.json`).
2. Iniciar dev server (Vite):

```bash
npm install
npm run dev
```

3. Abrir la app en el navegador. Al cargar, en consola debe verse `Usuario anónimo autenticado` y/o `Usuario autenticado: <uid>`.
4. Ir a la página principal; si no hay productos, usar el botón temporal "Crear Productos Demo" (si aún existe) o crear manualmente en Firebase Console → Firestore → Colección `productos`.
5. Click en `Add to Cart` en una tarjeta; comprobar en Firestore: `users/{uid}/cart/{productId}`.
6. Navegar a `/cart` para ver los items.

**Problemas resueltos durante el desarrollo:**
- Error `Database (default) not found`: se resolvió creando la base en Firebase Console y verificando `projectId`.
- Error `Missing or insufficient permissions`: se solucionó publicando reglas semi‑seguras y habilitando auth anónima.
- Bug: `ItemListPage` no importaba `ItemList` — corregido.
- Páginas devolvían `null` — se añadieron contenidos básicos.
- Añadida lógica de carrito persistente y visualización en `/cart`.

**Problemas y tareas pendientes (relevantes para entrega):**
- Checkout: `CheckoutForm.jsx` está esqueleto; falta integrar `addOrder()` y validación del comprador.
- Subtotales y total del carrito: `CartPage` lista items pero no muestra subtotal por item ni total acumulado.
- UI/UX: feedback visual en `Add to Cart` (toast, contador), manejo de errores en la UI.
- Reglas de seguridad: ajustar reglas para producción (segmentar por colecciones y validar ownership).
- Tests: no hay pruebas automatizadas.
- Manejo de stock: actualmente `addToCart` no decrementa stock en `productos` ni valida concurrente disponibilidad.

**Instrucciones para un agente AI que continúe el trabajo:**
1. Revisar `docs/PROJECT_SUMMARY.md` y los archivos listados.
2. Prioridad inmediata:
   - Implementar subtotales y total en `CartPage` (usar `items.reduce`).
   - Completar `CheckoutForm.jsx` para capturar datos del comprador, validar y llamar `addOrder()`; al crear la orden, vaciar la subcolección `users/{uid}/cart` y mostrar `orderId` en `OrderConfirmation`.
3. Seguridad:
   - Revisar reglas: implementar `allow write` condiciones por path (ej: `allow write: if request.auth.uid == resource.data.userId` para operaciones restringidas).
4. UX:
   - Agregar un contador en `NavBar` mostrando la suma total de `quantity` en el carrito. Suscribirse a cambios con un listener en Firestore o recargar al montar.
5. Entrega:
   - Añadir README con pasos y capturas.
   - Remover cualquier código demo (botones de creación masiva) antes de la entrega final.

**Comandos útiles para mantenimiento / debugging:**
- Ver logs de la app en la consola del navegador (F12).
- Forzar autenticación anónima desde la app: `initializeAuth()` en `App.jsx` ya lo hace.
- Ejecutar queries manuales en la consola de Firebase si necesitas comprobar documentos.

---

Si querés, puedo:
- Generar un `README.md` basado en esto listo para entregar.
- Implementar subtotal/total + vaciado de carrito tras `addOrder()`.
- Añadir feedback visual al `Add to Cart` y contador en `NavBar`.

Dime cuál de estas tareas querés que haga a continuación y lo agrego a la lista de TODOs y lo implemento.