# Proyecto Final - Shopping App

Aplicacion web de e-commerce construida con React, Vite, React Router y Firebase. El objetivo es mostrar un catalogo de productos, ver el detalle de cada producto, agregar unidades al carrito y completar una compra que se guarda como orden en Firestore.

La aplicacion desplegada se puede ver en: https://raffflepiratee.github.io/Shopping-Proyecto-Final-Integrador/

## Funcionamiento general

La app inicia con una sesion anonima en Firebase Authentication. A partir de esa sesion se mantiene un carrito asociado al usuario actual dentro de Firestore, por lo que los productos agregados se sincronizan en tiempo real.

El flujo principal es el siguiente:

1. El usuario entra al catalogo de productos.
2. Puede filtrar por categoria.
3. Abre el detalle de un producto y elige una cantidad.
4. El producto se agrega al carrito validando stock disponible.
5. Desde el carrito pasa al checkout.
6. Completa sus datos personales y confirma la compra.
7. La orden se guarda en Firestore y se muestra una pantalla de confirmacion con el ID de la compra.

## Rutas principales

- `/` o `/products`: listado de productos.
- `/product/:id`: detalle de un producto.
- `/cart`: carrito de compras.
- `/checkout`: formulario de compra.
- `/order/:orderId`: confirmacion de la orden creada.

## Tecnologias usadas

- React 19
- Vite
- React Router DOM
- Firebase Authentication
- Firestore

## Fuente de datos

La aplicacion trabaja con estas colecciones de Firestore:

- `productos`: contiene el catalogo de productos.
- `users/{uid}/cart`: contiene el carrito del usuario autenticado.
- `ordenes`: contiene las compras confirmadas.

## Flujo de carrito

El carrito vive en el contexto global `CartContext` y se sincroniza con Firestore en tiempo real. Cuando el usuario:

- agrega un producto, se valida que exista stock y que la cantidad no supere el maximo disponible;
- elimina un producto, se borra el documento correspondiente del carrito;
- finaliza la compra, el carrito se vacia automaticamente despues de crear la orden.

## Flujo de compra

En el checkout se valida que:

- haya productos en el carrito;
- el formulario del comprador este completo y valido.

Si todo esta correcto, se crea una orden con:

- datos del comprador;
- items comprados;
- total de la compra;
- fecha y estado inicial `pending`.

Luego se redirige a la pagina de confirmacion con el ID de la orden.

## Estructura del proyecto

- `src/main.jsx`: punto de entrada de la app.
- `src/App.jsx`: definicion de rutas y arranque de Firebase Auth.
- `src/firebase.js`: configuracion de Firebase y funciones de acceso a datos.
- `src/context/CartContext.jsx`: estado global del carrito.
- `src/pages/`: vistas principales de la app.
- `src/components/`: componentes reutilizables de interfaz.

## Scripts disponibles

- `npm run dev`: levanta el entorno de desarrollo.
- `npm run build`: genera la build de produccion.
- `npm run preview`: previsualiza la build generada.
- `npm run lint`: ejecuta ESLint.
- `npm run deploy`: publica la aplicacion con GitHub Pages.

## Instalacion y uso

1. Instalar dependencias con `npm install`.
2. Ejecutar `npm run dev`.
3. Abrir la URL que muestra Vite en el navegador.

## Ejemplo de orden (JSON)

A continuación hay un ejemplo de cómo se guarda una orden en Firestore cuando se crea mediante el checkout:

```json
{
  "buyer": {
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@example.com",
    "phone": "+541112345678",
    "address": "Calle Falsa 123, Ciudad"
  },
  "items": [
    {
      "productId": "abc123",
      "name": "Camiseta",
      "price": 29.99,
      "quantity": 2,
      "subtotal": 59.98
    },
    {
      "productId": "def456",
      "name": "Gorra",
      "price": 15.0,
      "quantity": 1,
      "subtotal": 15.0
    }
  ],
  "total": 74.98,
  "date": "2026-06-07T12:34:56.789Z",
  "status": "pending"
}
```

Nota: el campo `date` normalmente se guarda con la marca temporal al crear la orden y `status` inicia como `pending`.
