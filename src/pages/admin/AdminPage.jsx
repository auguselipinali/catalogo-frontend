import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { getAdminProducts } from '../../api/admin'
import { formatPrice } from '../../lib/format'
import {
  getToken,
  getTenantSlug,
  clearToken,
  isTokenExpired,
} from '../../lib/session'
import styles from './AdminPage.module.css'

function truncate(text, max = 80) {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max)}…` : text
}

export default function AdminPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // loading | ok | error

  const authed = getToken() && !isTokenExpired()

  useEffect(() => {
    if (!authed) return

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
  }, [authed])

  // Guard: sin token o sesión expirada, limpiamos y vamos a login.
  if (!authed) {
    clearToken()
    return <Navigate to="/admin/login" replace />
  }

  function handleLogout() {
    clearToken()
    navigate('/admin/login')
  }

  return (
    <main className={styles.page}>
      <div className={styles.bar}>
        <h1 className={styles.title}>Panel de administración</h1>
        <button className={styles.logout} type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <div className={styles.content}>{renderContent()}</div>
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
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td className={styles.price}>{formatPrice(product.price)}</td>
                <td>{truncate(product.description)}</td>
                <td>{product.imageUrl ? 'Sí' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
