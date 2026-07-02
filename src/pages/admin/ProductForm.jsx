import { useState } from 'react'
import styles from './ProductForm.module.css'

// Formulario presentacional y reutilizable (crear y editar).
// No sabe de API ni de rutas: valida y delega en onSubmit(values).
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
  const [validationError, setValidationError] = useState('')

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
