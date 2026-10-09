import { useEffect, useState } from 'react'
import { URL, handleResponse, headers } from '../../api/config'
import { useAuth } from '../../context/AuthContext'

function AdminUsers() {
  const { token, user: me } = useAuth()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busyId, setBusyId] = useState(null)

  // MONTAJE: unico GET de usuarios. /users requiere token de ADMIN, por
  // eso el token es dependencia (se usa adentro del efecto).
  useEffect(() => {
    let active = true

    fetch(`${URL}/users`, { headers: headers(token) })
      .then(handleResponse)
      .then((data) => {
        if (active) setUsers(data)
      })
      .catch(() => {
        if (active) setError('No se pudieron cargar los usuarios.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    // DESMONTAJE
    return () => {
      active = false
    }
  }, [token])

  const showNotice = (text) => {
    setError('')
    setNotice(text)
  }

  // PUT: el back pide los cuatro campos de UserRequest. Devuelve el
  // usuario actualizado y se reemplaza en el array.
  const handleRole = (target) => {
    const role = target.role === 'ADMIN' ? 'USER' : 'ADMIN'
    setBusyId(target.id)

    fetch(`${URL}/users/${target.id}`, {
      method: 'PUT',
      headers: headers(token),
      body: JSON.stringify({
        username: target.username,
        name: target.name,
        surname: target.surname,
        role,
      }),
    })
      .then(handleResponse)
      .then((updated) => {
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
        showNotice(
          `${updated.name} ${updated.surname} ahora es ${updated.role === 'ADMIN' ? 'administrador' : 'comprador'}.`,
        )
      })
      .catch(() => setError('No se pudo cambiar el rol.'))
      .finally(() => setBusyId(null))
  }

  // DELETE (204): se saca del array.
  const handleDelete = (target) => {
    if (!window.confirm(`¿Borrar la cuenta de ${target.name} ${target.surname}?`)) return
    setBusyId(target.id)

    fetch(`${URL}/users/${target.id}`, {
      method: 'DELETE',
      headers: headers(token),
    })
      .then(handleResponse)
      .then(() => {
        setUsers((prev) => prev.filter((u) => u.id !== target.id))
        showNotice(`Borraste la cuenta de ${target.name} ${target.surname}.`)
      })
      .catch(() =>
        setError(`No se puede borrar a ${target.name}: tiene compras o productos asociados.`),
      )
      .finally(() => setBusyId(null))
  }

  if (loading) return <p className="loading">Cargando usuarios…</p>

  return (
    <>
      {error && <div className="alert">{error}</div>}
      {notice && <div className="alert alert-ok">{notice}</div>}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isMe = u.id === me.id
              return (
                <tr key={u.id}>
                  <td>
                    {u.name} {u.surname}
                    {isMe && <div className="product-meta">Tu cuenta</div>}
                  </td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={u.role === 'ADMIN' ? 'role-pill admin' : 'role-pill'}>
                      {u.role === 'ADMIN' ? 'Administrador' : 'Comprador'}
                    </span>
                  </td>
                  <td>
                    {/* Un admin no puede quitarse permisos ni borrarse a si mismo. */}
                    {!isMe && (
                      <div className="row-actions">
                        <button
                          type="button"
                          className="btn btn-outline btn-small"
                          onClick={() => handleRole(u)}
                          disabled={busyId === u.id}
                        >
                          {u.role === 'ADMIN' ? 'Hacer comprador' : 'Hacer administrador'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-small"
                          onClick={() => handleDelete(u)}
                          disabled={busyId === u.id}
                        >
                          Borrar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default AdminUsers
