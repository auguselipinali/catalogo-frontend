import { useState } from 'react'
import { Navigate, useNavigate, useLocation, useParams } from 'react-router-dom'
import { updateProduct, SessionExpiredError } from '../../api/admin'
import { clearToken } from '../../lib/session'
import ProductForm from './ProductForm'
import styles from './ProductFormPage.module.css'

export default function EditProductPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const product = location.state?.product

  // Sin el producto en el state (URL directa o recarga) no hay qué editar:
  // volvemos a la tabla, que es desde donde se entra a editar.
  if (!product) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(values) {
    setError('')
    setSubmitting(true)

    try {
      await updateProduct(id, values)
      navigate('/admin')
    } catch (err) {
      if (err instanceof SessionExpiredError) {
        clearToken()
        navigate('/admin/login')
        return
      }
      setError('No pudimos guardar los cambios. Intentá de nuevo en un momento.')
      setSubmitting(false)
    }
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Editar producto</h1>
      <ProductForm
        initialValues={product}
        submitting={submitting}
        error={error}
        submitLabel="Guardar cambios"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin')}
      />
    </main>
  )
}
