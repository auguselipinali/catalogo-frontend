import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, InvalidCredentialsError } from '../../api/auth'
import { saveToken } from '../../lib/session'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const token = await login(email, password)
      saveToken(token)
      navigate('/admin')
    } catch (err) {
      setError(
        err instanceof InvalidCredentialsError
          ? 'El email o la contraseña no son correctos.'
          : 'No pudimos iniciar sesión. Intentá de nuevo en un momento.',
      )
      setSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Panel de administración</h1>
        <p className={styles.subtitle}>Ingresá con tu cuenta</p>

        <label className={styles.label}>
          Email
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className={styles.label}>
          Contraseña
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.button} type="submit" disabled={submitting}>
          {submitting ? 'Ingresando…' : 'Iniciar sesión'}
        </button>
      </form>
    </main>
  )
}
