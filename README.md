# thayspostres

Sitio web estático profesional para `thayspostres`, una marca local de repostería y postres personalizados.

El proyecto incluye un catálogo seleccionable con carrito de cotización por WhatsApp. No es tienda online, no tiene checkout, no procesa pagos, no confirma pedidos y no usa backend.

## Stack

- HTML5
- CSS3 modular
- JavaScript vanilla
- PWA básica
- JSON-LD seguro
- Open Graph
- Twitter Card
- Favicons locales

## Estructura

```text
thayspostres/
├── index.html
├── catalogo.html
├── pedidos.html
├── galeria.html
├── contacto.html
├── faq.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── README.md
├── assets/
│   ├── css/
│   ├── js/
│   └── img/
└── docs/
```

## Cómo abrir

Puedes abrir `index.html` directamente en el navegador o servir la carpeta con un servidor estático.

Ejemplo:

```bash
python -m http.server 8080
```

Luego visita:

```text
http://localhost:8080
```

## Configuración principal

Edita:

```text
assets/js/config.js
```

Ahí se centraliza:

- Nombre de marca.
- Base URL.
- WhatsApp.
- Redes sociales.
- Rutas internas.
- Configuración de cotización.
- Tipos de evento.
- Longitud máxima de nota.

## Configurar WhatsApp

En `assets/js/config.js`, reemplaza el valor vacío por el número real con código de país, sin espacios ni símbolos.

```js
contact: {
  whatsappNumber: "521XXXXXXXXXX"
},
quote: {
  whatsappNumber: "521XXXXXXXXXX"
}
```

Mientras el número esté vacío, el sitio no abrirá WhatsApp y mostrará un mensaje de validación.

## Catálogo y productos

Edita:

```text
assets/js/data-products.js
```

Cada producto debe tener:

```js
{
  id: "pastel-personalizado",
  name: "Pastel personalizado [SUPUESTO]",
  category: "Pasteles",
  description: "Diseño personalizado según idea, fecha y estilo deseado. [SUPUESTO]",
  image: "assets/img/products/pastel-personalizado.svg",
  tags: ["Personalizado", "Celebraciones"],
  isAssumption: true,
  quoteEnabled: true
}
```

No agregues precios, stock, disponibilidad, promociones ni tiempos de entrega sin validación.

## Carrito de cotización

El carrito permite:

- Agregar productos.
- Aumentar cantidades.
- Disminuir cantidades.
- Eliminar productos.
- Vaciar carrito.
- Agregar nota general opcional.
- Agregar fecha tentativa opcional.
- Seleccionar tipo de evento opcional.
- Enviar solicitud por WhatsApp.

No confirma pedidos.

## localStorage

El carrito usa localStorage con la key:

```text
thayspostres_quote_cart_v1
```

Guarda únicamente:

- Productos seleccionados.
- Cantidades.
- Tipo de evento opcional.
- Fecha tentativa opcional.
- Nota general opcional.

No guarda:

- Nombre del cliente.
- Teléfono del cliente.
- Dirección.
- Datos de pago.
- Identificaciones.
- Datos sensibles.

## SEO

Cada página incluye:

- Title único.
- Meta description única.
- Canonical.
- Open Graph.
- Twitter Card.
- JSON-LD seguro.
- Head comentado por bloques.
- Imagen OG local.

Antes de producción, reemplaza `[SUPUESTO A VALIDAR]` en `robots.txt` y `sitemap.xml` por el dominio real.

## JSON-LD seguro

El proyecto usa tipos seguros:

- `Organization`
- `Bakery`
- `WebSite`
- `WebPage`
- `BreadcrumbList`
- `ItemList`
- `FAQPage`

No usa `Offer`, precios, ratings, reviews, checkout, órdenes ni pagos.

## Favicons y PWA

El proyecto incluye:

- `favicon.ico`
- `assets/img/icons/favicon.svg`
- `assets/img/icons/apple-touch-icon.png`
- `assets/img/icons/android-chrome-192x192.png`
- `assets/img/icons/android-chrome-512x512.png`
- `site.webmanifest`

Reemplaza los iconos cuando exista identidad visual final.

## Publicación

Puedes publicar la carpeta completa en un hosting estático como Netlify, Vercel, GitHub Pages o un servidor propio estático.

Antes de publicar:

1. Configura dominio final.
2. Configura WhatsApp real.
3. Reemplaza imágenes placeholder.
4. Valida metadata.
5. Valida JSON-LD.
6. Valida `robots.txt`.
7. Valida `sitemap.xml`.
8. Verifica accesibilidad y responsive.

## Datos pendientes

Los siguientes datos permanecen como `[SUPUESTO A VALIDAR]`:

- WhatsApp.
- Redes sociales.
- Dirección exacta.
- Horarios.
- Delivery o recolección.
- Métodos de pago.
- Políticas comerciales.
- Fotografías reales.
- Dominio final.
