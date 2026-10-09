# María María Cafetería — sitio web

## Qué incluye

- Diseño elegante en tonos crema, café y dorado.
- Menú dinámico con categorías y buscador.
- Carrito con cantidades, eliminación y total.
- Carrito guardado en `localStorage`, por lo que no se pierde al recargar.
- Favoritos.
- Modal de detalle de producto.
- Checkout con validación básica.
- Pedido por WhatsApp.
- Formulario de contacto mediante correo del dispositivo.
- Modo oscuro.
- Diseño responsive para computadora, tablet y celular.

## Cómo abrirlo

1. Descomprime el proyecto.
2. Abre la carpeta en Visual Studio Code.
3. Abre `index.html`.
4. Puedes instalar la extensión "Live Server" y seleccionar "Open with Live Server".
5. También puedes abrir `index.html` directamente en Chrome.

## Antes de publicarlo

Abre `app.js` y modifica:

```js
const CONFIG = {
  WHATSAPP_NUMBER: "3332252962",
  BUSINESS_EMAIL: "cafemariamaria20@gmail.com",
  CURRENCY: "MXN"
};
```

Pon el WhatsApp y correo reales.

En `index.html`, cambia dirección, horario, teléfono y enlaces de redes sociales.

## Productos

Todos los productos están al inicio de `app.js`, dentro de `PRODUCTS`.

Puedes:
- cambiar nombre
- cambiar precio
- cambiar descripción
- cambiar categoría
- cambiar imagen

## Imágenes

Las fotografías del menú están enlazadas a Unsplash. Para una página real se recomienda reemplazarlas por fotografías propias de María María.

El logo incluido en `assets/logo.jpg` corresponde a la imagen proporcionada para este proyecto.

## Importante sobre "100% funcional"

Esta versión es funcional como sitio web y sistema de pedido por WhatsApp, pero hay funciones que necesitan servicios externos para ser una tienda comercial completa:

- Pagos con tarjeta: requiere Stripe, Mercado Pago u otro proveedor y claves.
- Base de datos de pedidos: requiere backend/base de datos.
- Panel administrativo: requiere autenticación + backend.
- Inventario real: requiere base de datos.
- Envíos y seguimiento: requiere integración con un proveedor.

No es seguro poner claves secretas de pagos o bases de datos dentro de `index.html` o `app.js`.

Para una versión comercial real, se recomienda agregar backend y base de datos.
