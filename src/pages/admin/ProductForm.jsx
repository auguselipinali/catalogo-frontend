import { useEffect, useState } from 'react'
import { getCategories } from '../../api/admin'
import styles from './ProductForm.module.css'

// Formulario reutilizable (crear y editar). Valida y delega en onSubmit(values).
// Carga sus propias categorías para el selector; si falla, degrada sin romper.
export default function ProductForm({
  initialValues,
  submitting,
  error,
  submitLabel = 'Guardar',
  onSubmit,
  onCancel,
}) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [price, setPrice] = useState(initialValues?.price ?? '')
  const [description, setDescription] = useState(
    initialValues?.description ?? '',
  )
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? '')
  // '' = "Sin categoría" (categoryId null). En editar viene de initialValues.
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId ?? '')
  const [categories, setCategories] = useState([])
  const [categoriesFailed, setCategoriesFailed] = useState(false)
  const [validationError, setValidationError] = useState('')

  // Categorías del tenant para el selector. Si falla, dejamos el select
  // deshabilitado con aviso; el resto del form sigue funcionando.
  useEffect(() => {
    let active = true
    getCategories()
      .then((data) => {
        if (active) setCategories(data)
      })
      .catch(() => {
        if (active) setCategoriesFailed(true)
      })

    return () => {
      active = false
    }
  }, [])

  function handleSubmit(event) {
    event.preventDefault()

    const trimmedName = name.trim()
    const numericPrice = Number(price)

    if (!trimmedName) {
      setValidationError('El nombre no puede estar vacío.')
      return
    }
    if (!(numericPrice > 0)) {
      setValidationError('El precio tiene que ser mayor a 0.')
      return
    }

    setValidationError('')
    onSubmit({
      name: trimmedName,
      price: numericPrice,
      description: description.trim(),
      imageUrl: imageUrl.trim() || null,
      categoryId: categoryId || null,
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label}>
        Nombre
        <input
          className={styles.input}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className={styles.label}>
        Precio
        <input
          className={styles.input}
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          step="0.01"
          required
        />
      </label>

      <label className={styles.label}>
        Descripción
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </label>

      <label className={styles.label}>
        Categoría
        <select
          className={styles.select}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          disabled={categoriesFailed}
        >
          <option value="">Sin categoría</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {categoriesFailed && (
          <span className={styles.fieldHint}>
            No se pudieron cargar las categorías.
          </span>
        )}
      </label>

      <label className={styles.label}>
        URL de imagen (opcional)
        <input
          className={styles.input}
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://…"
        />
      </label>

      {(validationError || error) && (
        <p className={styles.error}>{validationError || error}</p>
      )}

      <div className={styles.actions}>
        <button
          className={styles.cancel}
          type="button"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancelar
        </button>
        <button className={styles.submit} type="submit" disabled={submitting}>
          {submitting ? 'Guardando…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
