# Canning Home Decor: front

React 18 + Vite + React Router 7, armado sobre el proyecto base de la cátedra
(*React fetch Demo*). Consume la API Spring Boot del repo del back.

## Cómo levantarlo

1. Levantar el back con MySQL corriendo. Queda en `http://localhost:4002`.
2. En esta carpeta (donde está el `package.json`):

```bash
npm install
npm run dev
```

3. Abrir `http://localhost:5173`.

`npm install` va solo la primera vez. Después alcanza con `npm run dev`.

Desde la pantalla de registro siempre se crea un comprador (USER). Para tener un
administrador, registrarlo una vez desde Postman mandando `"role": "ADMIN"` a
`POST /api/v1/auth/register`. Después, desde el panel, ese admin puede convertir
a otros usuarios en administradores.

## Qué tomamos del proyecto base

| Del base | Acá |
|---|---|
| `BrowserRouter` en `main.jsx`, sin `StrictMode` | igual, más los dos contextos |
| `Navigation` con `Link` y rutas en `App.jsx` | igual, con menú según el rol |
| `PostList` hace el `fetch`, `PostCard` muestra por props | `ProductList` / `ProductCard`, `Orders` / `OrderCard` |
| `fetch(...).then(res => res.json()).then(setX).catch(...)` | igual; `handleResponse` además revisa `response.ok` |
| `const URL = ...` | `src/api/config.js` |
| carpetas `views/` y `components/` | igual |

## Las fotos de los productos

La base no guarda archivos: guarda direcciones. La tabla `product_images`
tiene una fila por foto y la API las devuelve en `imageUrls`.

Desde el panel las fotos se **suben**: `components/PhotoUploader.jsx` manda
el archivo a `POST /uploads` como `multipart/form-data`, el back lo guarda
con un nombre generado y devuelve la direccion publica. Esa direccion es la
que se guarda en el producto. La primera del array es la portada.

En multipart **no** hay que poner `Content-Type` a mano. El navegador lo
arma solo con el `boundary` que separa las partes del cuerpo; si lo
escribimos nosotros, ese boundary falta y el back no puede leer el archivo.
Por eso `PhotoUploader` no usa `headers()` de `api/config`, que siempre
pone `application/json`: manda solo el `Authorization`.

Si una direccion queda rota, `ProductPhoto` muestra el mismo recuadro que
cuando no hay foto, en lugar del icono de imagen rota del navegador.

## Los filtros viven en la URL

El catalogo no guarda los filtros en un `useState`: los lee de la URL con
`useSearchParams`. Asi un catalogo filtrado se puede compartir o guardar en
favoritos, y el boton Atras deshace el ultimo filtro.

`ProductList` recibe la consulta ya armada como **texto**, no como objeto.
Su `useEffect` depende de ese valor, y un objeto nuevo en cada render del
padre nunca es igual al anterior: el efecto correria siempre, en un bucle
infinito. Dos textos iguales si son iguales.

## Mensajes de error

`handleResponse` lee el cuerpo de la respuesta cuando algo sale mal y deja
el motivo en `error.serverMessage`. `errorText(error, fallback)` lo muestra
**solo si el error es 4xx**, o sea cuando el back lo decidio a proposito.
Un 5xx es una falla interna y su mensaje puede traer detalles de la base o
de la consulta SQL: en ese caso se muestra el texto propio de la vista.

## Estructura

```
src/
  api/config.js           URL del back, headers con token, handleResponse, formatos
  context/AuthContext     sesión: token, usuario (/me), login, registro, logout
  context/CartContext     carrito del comprador, compartido por toda la app
  components/             piezas que muestran datos por props
  views/                  una vista por ruta
  views/admin/            panel del ADMIN: productos, categorías, usuarios
```

## Rutas

| Ruta | Quién entra |
|---|---|
| `/`, `/productos/:id` | todos |
| `/login`, `/registro` | sin sesión |
| `/carrito`, `/mis-compras` | comprador (USER) |
| `/admin`, `/admin/categorias`, `/admin/usuarios` | administrador (ADMIN) |

## Regla de la cátedra: GET al montar, nada de GET después de modificar

Cada `useEffect` del proyecto:

| Archivo | Dependencias | Qué pide |
|---|---|---|
| `context/AuthContext.jsx` | `[]` | `GET /api/v1/auth/me`, solo si había un token guardado |
| `context/CartContext.jsx` | `[token, isBuyer]` | `GET /cart`, al entrar o al cambiar de usuario |
| `views/Home.jsx` | `[]` | `GET /categories` |
| `components/ProductList.jsx` | `[filters]` | `GET /products?...`, solo cuando cambian filtros o página |
| `views/ProductDetail.jsx` | `[id]` | `GET /products/{id}`, solo si cambia el id de la URL |
| `views/Orders.jsx` | `[token]` | `GET /orders` |
| `views/admin/AdminProducts.jsx` | `[]` | `GET /products` y `GET /categories` en paralelo |
| `views/admin/AdminCategories.jsx` | `[]` | `GET /categories` |
| `views/admin/AdminUsers.jsx` | `[token]` | `GET /users` |

Después de un POST, PUT, PATCH o DELETE **nunca** se vuelve a pedir la lista. Se
actualiza el estado con lo que devuelve el back:

- **POST** → `setLista(prev => [...prev, creado])`
- **PUT / PATCH** → `setLista(prev => prev.map(x => x.id === actualizado.id ? actualizado : x))`
- **DELETE** (204, sin cuerpo) → `setLista(prev => prev.filter(x => x.id !== id))`
- **Carrito**: todos sus endpoints devuelven el carrito actualizado → `setCart(respuesta)`.
  El checkout devuelve la orden y el carrito se vacía en el estado, sin pedirlo.

La única excepción es el login: el back devuelve solo el token, así que hay un
`GET /me` para saber nombre y rol. No es una recarga después de modificar:
es la primera lectura del usuario.

### Otros detalles de los efectos

- **Desmontaje**: cada efecto devuelve `() => { active = false }`. Si el usuario
  se va de la pantalla, o cambia un filtro antes de que llegue la respuesta, esa
  respuesta vieja se ignora y no pisa el estado.
- **Búsqueda sin GET por tecla**: el texto y los precios se aplican al tocar
  "Buscar". Tocar dos veces la misma categoría tampoco pide nada.
- **Sin efectos que copian props al estado**: para reiniciar un formulario se le
  cambia la `key` (`ProductForm`, `StockCell`, `Filters`).
- **Valores derivados en el render**: `isAdmin`, `isBuyer` y la cantidad de
  unidades del carrito se calculan, no son `useState` aparte.
- **La sesión se lee de `localStorage`** con un inicializador de `useState`,
  no con un efecto.
