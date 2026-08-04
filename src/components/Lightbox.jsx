import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './Lightbox.module.css'

// Modal de imagen ampliada para el catálogo público. Se apoya en el zoom
// nativo del navegador (pinch en mobile): no fija touch-action ni toca el
// viewport, así el pellizco funciona sobre la imagen sin gestos custom.
export default function Lightbox({ src, alt, onClose }) {
  // Cerrar con Esc y bloquear el scroll del fondo mientras está abierto.
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <button
        className={styles.close}
        type="button"
        onClick={onClose}
        aria-label="Cerrar imagen"
      >
        ✕
      </button>
      <img
        className={styles.image}
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body,
  )
}
