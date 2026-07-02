import { useState } from 'react'
import {
  Navigate,
  useNavigate,
  useLocation,
  useNavigationType,
  useParams,
} from 'react-router-dom'
import { updateProduct, SessionExpiredError } from '../../api/admin'
import { clearToken } from '../../lib/session'
import ProductForm from './ProductForm'
import styles from './ProductFormPage.module.css'

export default function EditProductPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigationType = useNavigationType()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const product = location.state?.product

  // El state de navegación se guarda en history.state y SOBREVIVE al reload,
  // así que chequear !product no alcanza. Solo llegamos con intención real de
  // editar cuando venimos por el link "Editar" (un PUSH). Reload, URL directa
  // o back/forward son POP: no hay qué editar -> volvemos a la tabla.
  if (navigationType !== 'PUSH' || !product) {
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
