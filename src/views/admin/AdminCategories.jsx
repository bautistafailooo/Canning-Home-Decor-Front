import { useEffect, useState } from 'react'
import { URL, handleResponse, headers } from '../../api/config'
import { useAuth } from '../../context/AuthContext'

function AdminCategories() {
  const { token } = useAuth()

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [saving, setSaving] = useState(false)

  // MONTAJE: unico GET de categorias de esta pantalla.
  useEffect(() => {
    let active = true

    fetch(`${URL}/categories`)
      .then(handleResponse)
      .then((data) => {
        if (active) setCategories(data.content)
      })
      .catch(() => {
        if (active) setError('No se pudieron cargar las categorías.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    // DESMONTAJE
    return () => {
      active = false
    }
  }, [])

  const showNotice = (text) => {
    setError('')
    setNotice(text)
  }

  // POST: el back devuelve la categoria creada (con su id) y se agrega al array.
  const handleCreate = (e) => {
    e.preventDefault()
    const description = newName.trim()
    if (!description) return

    setSaving(true)
    fetch(`${URL}/categories`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify({ description }),
    })
      .then(handleResponse)
      .then((created) => {
        setCategories((prev) => [...prev, created])
        setNewName('')
        showNotice(`Creaste la categoría ${created.description}.`)
      })
      .catch((err) =>
        setError(
          err.status === 400
            ? `Ya existe una categoría llamada ${description}.`
            : 'No se pudo crear la categoría.',
        ),
      )
      .finally(() => setSaving(false))
  }

  const startEdit = (category) => {
    setEditingId(category.id)
    setEditName(category.description)
  }

  // PUT: se reemplaza solo la categoria editada.
  const handleRename = (e) => {
    e.preventDefault()
    const description = editName.trim()
    if (!description) return

    setSaving(true)
    fetch(`${URL}/categories/${editingId}`, {
      method: 'PUT',
      headers: headers(token),
      body: JSON.stringify({ description }),
    })
      .then(handleResponse)
      .then((updated) => {
        setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
        setEditingId(null)
        showNotice(`La categoría ahora se llama ${updated.description}.`)
      })
      .catch(() => setError('No se pudo renombrar la categoría.'))
      .finally(() => setSaving(false))
  }

  // DELETE (204): se saca del array.
  const handleDelete = (category) => {
    if (!window.confirm(`¿Borrar la categoría ${category.description}?`)) return

    fetch(`${URL}/categories/${category.id}`, {
      method: 'DELETE',
      headers: headers(token),
    })
      .then(handleResponse)
      .then(() => {
        setCategories((prev) => prev.filter((c) => c.id !== category.id))
        showNotice(`Borraste la categoría ${category.description}.`)
      })
      .catch(() =>
        setError(
          `No se puede borrar ${category.description} porque tiene productos. Cambiales la categoría primero.`,
        ),
      )
  }

  if (loading) return <p className="loading">Cargando categorías…</p>

  return (
    <>
      {error && <div className="alert">{error}</div>}
      {notice && <div className="alert alert-ok">{notice}</div>}

      <form className="panel" onSubmit={handleCreate}>
        <h2>Nueva categoría</h2>
        <div className="inline-form">
          <input
            aria-label="Nombre de la categoría"
            placeholder="Ej: Iluminación"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button type="submit" className="btn" disabled={saving || !newName.trim()}>
            Crear categoría
          </button>
        </div>
      </form>

      {categories.length === 0 ? (
        <div className="empty-state">
          <h2>Todavía no hay categorías</h2>
          <p>Creá la primera para poder ordenar los productos.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Categoría</th>
                <th>
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  {editingId === category.id ? (
                    <td colSpan={2}>
                      <form className="inline-form" onSubmit={handleRename}>
                        <input
                          aria-label="Nuevo nombre"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                        />
                        <button type="submit" className="btn btn-small" disabled={saving}>
                          Guardar
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-small"
                          onClick={() => setEditingId(null)}
                        >
                          Cancelar
                        </button>
                      </form>
                    </td>
                  ) : (
                    <>
                      <td>{category.description}</td>
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="btn btn-outline btn-small"
                            onClick={() => startEdit(category)}
                          >
                            Renombrar
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-small"
                            onClick={() => handleDelete(category)}
                          >
                            Borrar
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default AdminCategories
