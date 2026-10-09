import { Route, Routes } from 'react-router-dom'
import Navigation from './components/Navigation'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './views/Home'
import Catalog from './views/Catalog'
import ProductDetail from './views/ProductDetail'
import Login from './views/Login'
import Register from './views/Register'
import Cart from './views/Cart'
import Orders from './views/Orders'
import AdminLayout from './views/admin/AdminLayout'
import AdminProducts from './views/admin/AdminProducts'
import AdminCategories from './views/admin/AdminCategories'
import AdminUsers from './views/admin/AdminUsers'
import NotFound from './views/NotFound'

function App() {
  return (
    <>
      <Navigation />

      <main className="page">
        <Routes>
          {/* Publicas: cualquiera puede ver el catalogo */}
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          {/* Solo comprador (rol USER) */}
          <Route
            path="/carrito"
            element={
              <ProtectedRoute role="USER">
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-compras"
            element={
              <ProtectedRoute role="USER">
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Solo administrador (rol ADMIN) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminProducts />} />
            <Route path="categorias" element={<AdminCategories />} />
            <Route path="usuarios" element={<AdminUsers />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>Canning Home Decor. Trabajo práctico, UADE.</p>
      </footer>
    </>
  )
}

export default App
