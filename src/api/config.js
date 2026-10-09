// Direccion del back (Spring Boot). En el proyecto base era la URL de
// jsonplaceholder; aca es nuestra API.
export const URL = 'http://localhost:4002'

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
export const handleResponse = (response) => {
  if (!response.ok) {
    const error = new Error(`Error ${response.status}`)
    error.status = response.status
    throw error
  }
  // 204 No Content (un DELETE que salio bien): no hay JSON para leer.
  if (response.status === 204) return null
  return response.json()
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
