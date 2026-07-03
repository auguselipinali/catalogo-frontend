import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  SessionExpiredError,
} from '../../api/admin'
import { clearToken } from '../../lib/session'
import styles from './CategoriesPage.module.css'

export default function CategoriesPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [status, setStatus] = useState('loading') // loading | ok | error
  const [actionError, setActionError] = useState('')

  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let active = true
    getCategories()
      .then((data) => {
        if (!active) return
        setCategories(data)
        setStatus('ok')
      })
      .catch(() => {
        if (!active) return
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  function handleSessionExpired() {
    clearToken()
    navigate('/admin/login')
  }

  async function handleCreate(event) {
    event.preventDefault()
    const name = newName.trim()
    if (!name) return

    setActionError('')
    setCreating(true)
    try {
      const { id } = await createCategory(name)
      setCategories((prev) => [...prev, { id, name }])
      setNewName('')
    } catch (err) {
      if (err instanceof SessionExpiredError) return handleSessionExpired()
      setActionError('No pudimos crear la categoría. Intentá de nuevo.')
    } finally {
      setCreating(false)
    }
  }

  function startEdit(category) {
    setActionError('')
    setEditingId(category.id)
    setEditingName(category.name)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingName('')
  }

  async function handleSaveEdit(event) {
    event.preventDefault()
    const name = editingName.trim()
    if (!name) return

    setActionError('')
    setSavingId(editingId)
    try {
      await updateCategory(editingId, name)
      setCategories((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, name } : c)),
      )
      cancelEdit()
    } catch (err) {
      if (err instanceof SessionExpiredError) return handleSessionExpired()
      setActionError('No pudimos guardar el cambio. Intentá de nuevo.')
    } finally {
      setSavingId(null)
    }
  }

  async function handleDelete(category) {
    const ok = window.confirm(
      `¿Borrar «${category.name}»?\n\nLos productos que la tengan asignada ` +
        'quedarán sin categoría.',
    )
    if (!ok) return

    setActionError('')
    setDeletingId(category.id)
    try {
      await deleteCategory(category.id)
      setCategories((prev) => prev.filter((c) => c.id !== category.id))
    } catch (err) {
      if (err instanceof SessionExpiredError) return handleSessionExpired()
      setActionError('No pudimos borrar la categoría. Intentá de nuevo.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className={styles.page}>
      <Link className={styles.back} to="/admin">
        ← Volver
      </Link>
      <h1 className={styles.title}>Categorías</h1>

      <form className={styles.createForm} onSubmit={handleCreate}>
        <input
          className={styles.input}
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nueva categoría"
          aria-label="Nombre de la nueva categoría"
        />
        <button
          className={styles.add}
          type="submit"
          disabled={creating || !newName.trim()}
        >
          {creating ? 'Agregando…' : 'Agregar categoría'}
        </button>
      </form>

      {actionError && <p className={styles.actionError}>{actionError}</p>}

      {renderList()}
    </main>
  )

  function renderList() {
    if (status === 'loading') {
      return <p className={styles.state}>Cargando categorías…</p>
    }

    if (status === 'error') {
      return (
        <p className={styles.state}>
          No pudimos cargar las categorías. Intentá de nuevo en un momento.
        </p>
      )
    }

    if (categories.length === 0) {
      return <p className={styles.state}>Todavía no tenés categorías.</p>
    }

    return (
      <ul className={styles.list}>
        {categories.map((category) => (
          <li key={category.id} className={styles.row}>
            {editingId === category.id ? (
              <form className={styles.editForm} onSubmit={handleSaveEdit}>
                <input
                  className={styles.input}
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  aria-label={`Nuevo nombre para ${category.name}`}
                  autoFocus
                />
                <div className={styles.rowActions}>
                  <button
                    className={styles.save}
                    type="submit"
                    disabled={savingId === category.id || !editingName.trim()}
                  >
                    {savingId === category.id ? 'Guardando…' : 'Guardar'}
                  </button>
                  <button
                    className={styles.secondary}
                    type="button"
                    onClick={cancelEdit}
                    disabled={savingId === category.id}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <>
                <span className={styles.name}>{category.name}</span>
                <div className={styles.rowActions}>
                  <button
                    className={styles.secondary}
                    type="button"
                    onClick={() => startEdit(category)}
                  >
                    Renombrar
                  </button>
                  <button
                    className={styles.delete}
                    type="button"
                    onClick={() => handleDelete(category)}
                    disabled={deletingId === category.id}
                  >
                    {deletingId === category.id ? 'Borrando…' : 'Borrar'}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    )
  }
}
