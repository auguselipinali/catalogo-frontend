import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProduct, SessionExpiredError } from '../../api/admin'
import { clearToken } from '../../lib/session'
import ProductForm from './ProductForm'
import styles from './NewProductPage.module.css'

export default function NewProductPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(values) {
    setError('')
    setSubmitting(true)

    try {
      await createProduct(values)
      navigate('/admin')
    } catch (err) {
      if (err instanceof SessionExpiredError) {
        clearToken()
        navigate('/admin/login')
        return
      }
      setError('No pudimos guardar el producto. Intentá de nuevo en un momento.')
      setSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Agregar producto</h1>
      <ProductForm
        submitting={submitting}
        error={error}
        submitLabel="Agregar producto"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin')}
      />
    </main>
  )
}
