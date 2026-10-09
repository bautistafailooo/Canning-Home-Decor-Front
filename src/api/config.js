// Direccion del back (Spring Boot). Se puede cambiar sin tocar el codigo:
// se define en el archivo .env de la raiz del proyecto.
//
// Vite solo expone al navegador las variables que empiezan con VITE_, y las
// lee al arrancar: si cambias el .env hay que frenar y volver a correr
// "npm run dev". Si no hay .env, se usa el puerto de siempre.
export const URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4002'

// Arma los headers de cada pedido. Si hay token lo manda como
// "Authorization: Bearer ...", que es lo que espera el filtro JWT del back.
export const headers = (token) => {
  const result = { 'Content-Type': 'application/json' }
  if (token) result.Authorization = `Bearer ${token}`
  return result
}

// Va despues de cada fetch: .then(handleResponse)
//
// fetch NO falla solo cuando el back responde 400, 403 o 404: hay que
// revisar response.ok a mano. Si salio mal, se lanza un error para que
// caiga en el .catch del componente.
//
// Antes el error era siempre "Error 400" y se perdia lo que explicaba el
// back. Ahora se lee el cuerpo de la respuesta: Spring manda ahi el motivo
// de cada @ResponseStatus (por ejemplo "La categoria tiene productos
// asociados"). Queda en error.serverMessage, y error.status se mantiene
// para los casos en que la vista prefiere su propio texto.
export const handleResponse = (response) => {
  if (!response.ok) {
    return response.text().then((body) => {
      let serverMessage = ''
      try {
        serverMessage = JSON.parse(body).message ?? ''
      } catch {
        // El back no siempre responde JSON (por ejemplo un 403 vacio).
        serverMessage = ''
      }

      const error = new Error(serverMessage || `Error ${response.status}`)
      error.status = response.status
      error.serverMessage = serverMessage
      throw error
    })
  }

  // 204 No Content (un DELETE que salio bien): no hay JSON para leer.
  if (response.status === 204) return null
  return response.json()
}

// Texto para mostrarle a la persona.
//
// Solo se muestra lo que dijo el back cuando el error es 4xx, o sea cuando
// el back lo decidio a proposito ("La categoria tiene productos asociados").
// Un 5xx es una falla interna y su mensaje puede traer detalles de la base
// o de la consulta SQL: eso no va a la pantalla, va el texto propio de la
// vista.
export const errorText = (error, fallback) => {
  const esDeNegocio = error?.status >= 400 && error?.status < 500
  return (esDeNegocio && error.serverMessage) || fallback
}

// Formato de precio argentino: $ 125.000
export const formatPrice = (value) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value ?? 0)

// "9 de octubre de 2026"
export const formatDate = (iso) =>
  new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
