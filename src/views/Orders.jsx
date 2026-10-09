import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { URL, handleResponse, headers } from '../api/config'
import { useAuth } from '../context/AuthContext'
import OrderCard from '../components/OrderCard'

// Historial de compras. Mismo patron que PostList del proyecto base:
// la vista hace el fetch y cada orden se dibuja con OrderCard.
function Orders() {
  const { token } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // MONTAJE: un GET /orders. El back ya las devuelve de la mas nueva a
  // la mas vieja. El token es dependencia porque se usa adentro.
  useEffect(() => {
    let active = true

    fetch(`${URL}/orders`, { headers: headers(token) })
      .then(handleResponse)
      .then((data) => {
        if (active) setOrders(data)
      })
      .catch((err) => {
        console.error('Error al cargar las compras', err)
        if (active) setError('No se pudieron cargar tus compras. Probá de nuevo.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    // DESMONTAJE
    return () => {
      active = false
    }
  }, [token])

  if (loading) return <p className="loading">Cargando tus compras…</p>
  if (error) return <div className="alert">{error}</div>

  if (orders.length === 0) {
    return (
      <section className="empty-state">
        <h1>Todavía no compraste nada</h1>
        <p>Cuando confirmes una compra desde el carrito, la vas a ver acá.</p>
        <Link to="/" className="btn">
          Ir a la tienda
        </Link>
      </section>
    )
  }

  return (
    <>
      <h1>Mis compras</h1>
      <div className="orders">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </>
  )
}

export default Orders
