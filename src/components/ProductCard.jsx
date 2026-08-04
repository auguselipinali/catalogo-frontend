import { useRef, useState } from 'react'
import { formatPrice } from '../lib/format'
import { useCart } from '../cart/CartContext'
import Lightbox from './Lightbox'
import styles from './ProductCard.module.css'

// Ampliación de la lupa en desktop.
const ZOOM = 2.2

// Solo dispositivos con mouse real: en touch no hay lupa (tap -> lightbox).
function detectHover() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  )
}

export default function ProductCard({ product }) {
  const { id, name, price, description, imageUrl } = product
  const { addItem } = useCart()
  const [imgFailed, setImgFailed] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const [canHover] = useState(detectHover)

  const lensRef = useRef(null)
  const zoomImgRef = useRef(null)
  const rectRef = useRef(null)

  const showPlaceholder = !imageUrl || imgFailed

  // Cacheamos el rect de la imagen al entrar, dimensionamos la imagen ampliada
  // (ZOOM× el tamaño de la imagen, cuadrada) y mostramos la lupa.
  function handleEnter(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    rectRef.current = rect
    if (zoomImgRef.current) {
      zoomImgRef.current.style.width = `${rect.width * ZOOM}px`
      zoomImgRef.current.style.height = `${rect.height * ZOOM}px`
    }
    if (lensRef.current) lensRef.current.style.display = 'block'
  }

  // Movemos la lupa y la imagen ampliada por ref (sin re-render por mousemove).
  function handleMove(e) {
    const rect = rectRef.current
    const lens = lensRef.current
    const zoomImg = zoomImgRef.current
    if (!rect || !lens || !zoomImg) return

    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    const r = lens.offsetWidth / 2

    lens.style.left = `${cx - r}px`
    lens.style.top = `${cy - r}px`
    zoomImg.style.transform = `translate(${r - cx * ZOOM}px, ${r - cy * ZOOM}px)`
  }

  function handleLeave() {
    if (lensRef.current) lensRef.current.style.display = 'none'
  }

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        {showPlaceholder ? (
          <div className={styles.placeholder} aria-hidden="true">
            <span className={styles.placeholderIcon}>✿</span>
            <span className={styles.placeholderText}>Sin imagen</span>
          </div>
        ) : (
          <button
            className={styles.imageButton}
            type="button"
            onClick={() => setZoomed(true)}
            aria-label={`Ampliar imagen de ${name}`}
            onMouseEnter={canHover ? handleEnter : undefined}
            onMouseMove={canHover ? handleMove : undefined}
            onMouseLeave={canHover ? handleLeave : undefined}
          >
            <img
              className={styles.image}
              src={imageUrl}
              alt={name}
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
            {canHover && (
              <span className={styles.lens} ref={lensRef} aria-hidden="true">
                <img
                  className={styles.zoomImg}
                  ref={zoomImgRef}
                  src={imageUrl}
                  alt=""
                />
              </span>
            )}
          </button>
        )}
      </div>

      {zoomed && (
        <Lightbox src={imageUrl} alt={name} onClose={() => setZoomed(false)} />
      )}

      <div className={styles.body}>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.price}>{formatPrice(price)}</p>
        {description && <p className={styles.description}>{description}</p>}
        <button
          className={styles.add}
          type="button"
          onClick={() => addItem(id)}
        >
          Agregar
        </button>
      </div>
    </article>
  )
}
