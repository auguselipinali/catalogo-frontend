import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  getAdminProducts,
  deleteProduct,
  SessionExpiredError,
} from '../../api/admin'
import { formatPrice } from '../../lib/format'
import { getTenantSlug, clearToken } from '../../lib/session'
import styles from './AdminPage.module.css'

function truncate(text, max = 80) {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max)}…` : text
}

export default function AdminPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // loading | ok | error
  const [deletingId, setDeletingId] = useState(null)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    let active = true
    getAdminProducts(getTenantSlug())
      .then((data) => {
        if (!active) return
        setProducts(data)
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

  function handleLogout() {
    clearToken()
    navigate('/admin/login')
  }

  function handleSessionExpired() {
    clearToken()
    navigate('/admin/login')
  }

  async function handleDelete(product) {
    if (!window.confirm(`¿Borrar «${product.name}»?`)) return

    setActionError('')
    setDeletingId(product.id)

    try {
      await deleteProduct(product.id)
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
    } catch (err) {
      if (err instanceof SessionExpiredError) {
        handleSessionExpired()
        return
      }
      setActionError('No pudimos borrar el producto. Intentá de nuevo.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.bar}>
        <h1 className={styles.title}>Panel de administración</h1>
        <button className={styles.logout} type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.toolbar}>
          <Link className={styles.addButton} to="/admin/productos/nuevo">
            Agregar producto
          </Link>
        </div>

        {actionError && <p className={styles.actionError}>{actionError}</p>}

        {renderContent()}
      </div>
    </main>
  )

  function renderContent() {
    if (status === 'loading') {
      return <p className={styles.state}>Cargando productos…</p>
    }

    if (status === 'error') {
      return (
        <p className={styles.state}>
          No pudimos cargar los productos. Intentá de nuevo en un momento.
        </p>
      )
    }

    if (products.length === 0) {
      return <p className={styles.state}>Todavía no tenés productos cargados.</p>
    }

    return (
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Descripción</th>
              <th>Imagen</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td className={styles.price}>{formatPrice(product.price)}</td>
                <td>{truncate(product.description)}</td>
                <td>{product.imageUrl ? 'Sí' : '—'}</td>
                <td>
                  <button
                    className={styles.delete}
                    type="button"
                    onClick={() => handleDelete(product)}
                    disabled={deletingId === product.id}
                  >
                    {deletingId === product.id ? 'Borrando…' : 'Borrar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
