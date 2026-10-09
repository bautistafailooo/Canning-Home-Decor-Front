import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import './index.css'

// Igual que en el proyecto base: BrowserRouter envuelve toda la app.
// AuthProvider y CartProvider comparten la sesion y el carrito con
// cualquier componente, sin pasar props de mano en mano.
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </BrowserRouter>,
)
