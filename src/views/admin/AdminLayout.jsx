import { NavLink, Outlet } from 'react-router-dom'

// Marco comun del panel. Cada pestaña es una ruta hija que React Router
// dibuja en <Outlet />.
function AdminLayout() {
  return (
    <>
      <h1>Panel de la tienda</h1>

      <nav className="admin-tabs">
        <NavLink to="/admin" end>
          Productos
        </NavLink>
        <NavLink to="/admin/categorias">Categorías</NavLink>
        <NavLink to="/admin/usuarios">Usuarios</NavLink>
      </nav>

      <Outlet />
    </>
  )
}

export default AdminLayout
