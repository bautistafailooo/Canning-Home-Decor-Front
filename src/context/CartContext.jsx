import { createContext, useContext, useEffect, useState } from 'react'
import { URL, handleResponse, headers } from '../api/config'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

const EMPTY_CART = { items: [], total: 0 }

export const CartProvider = ({ children }) => {
  const { token, isBuyer } = useAuth()
  const [cart, setCart] = useState(EMPTY_CART)
  const [loading, setLoading] = useState(false)

  // MONTAJE / ACTUALIZACION: el UNICO GET del carrito en toda la app.
  // Corre cuando cambia quien esta logueado (dependencias [token, isBuyer]).
  // Agregar, cambiar cantidad o quitar items NUNCA vuelve a disparar esto.
  useEffect(() => {
    if (!token || !isBuyer) {
      setCart(EMPTY_CART)
      return
    }

    let active = true
    setLoading(true)

    fetch(`${URL}/cart`, { headers: headers(token) })
      .then(handleResponse)
      .then((data) => {
        if (active) setCart(data)
      })
      .catch((error) => console.error('Error al cargar el carrito', error))
      .finally(() => {
        if (active) setLoading(false)
      })

    // DESMONTAJE: si el usuario cierra sesion antes de que llegue la
    // respuesta, no se pisa el carrito con datos viejos.
    return () => {
      active = false
    }
  }, [token, isBuyer])

  // Todos los endpoints del carrito devuelven el carrito ya actualizado.
  // Por eso se hace setCart(respuesta) y NO un GET /cart de nuevo.
  const addItem = (productId, quantity = 1) =>
    fetch(`${URL}/cart/items`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ productId, quantity }),
    })
      .then(handleResponse)
      .then(setCart)

  const updateItem = (itemId, quantity) =>
    fetch(`${URL}/cart/items/${itemId}?quantity=${quantity}`, {
      method: 'PUT',
      headers: headers(token),
    })
      .then(handleResponse)
      .then(setCart)

  const removeItem = (itemId) =>
    fetch(`${URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: headers(token),
    })
      .then(handleResponse)
      .then(setCart)

  const clearCart = () =>
    fetch(`${URL}/cart`, {
      method: 'DELETE',
      headers: headers(token),
    })
      .then(handleResponse)
      .then(setCart)

  // El checkout devuelve la ORDEN creada. El back deja el carrito vacio,
  // asi que aca se vacia tambien, sin pedirlo de nuevo.
  const checkout = () =>
    fetch(`${URL}/cart/checkout`, {
      method: 'POST',
      headers: headers(token),
    })
      .then(handleResponse)
      .then((order) => {
        setCart(EMPTY_CART)
        return order
      })

  // Valor derivado: cuantas unidades hay en total (para el globito del menu).
  const units = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  const value = { cart, loading, units, addItem, updateItem, removeItem, clearCart, checkout }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext)
