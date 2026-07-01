import { Navigate, useNavigate } from 'react-router-dom'
import { getToken, getUserEmail, clearToken } from '../../lib/session'
import styles from './AdminPage.module.css'

export default function AdminPage() {
  const navigate = useNavigate()

  // Guard: sin token, a login.
  if (!getToken()) {
    return <Navigate to="/admin/login" replace />
  }

  const email = getUserEmail()

  function handleLogout() {
    clearToken()
    navigate('/admin/login')
  }

  return (
    <main className={styles.page}>
      <div className={styles.bar}>
        <button className={styles.logout} type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>Panel de administración</h1>
        <p className={styles.welcome}>
          {email ? `Bienvenida, ${email}` : 'Bienvenida'}
        </p>
      </div>
    </main>
  )
}
