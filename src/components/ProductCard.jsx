import { useState } from 'react'
import { formatPrice } from '../lib/format'
import { useCart } from '../cart/CartContext'
import Lightbox from './Lightbox'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const { id, name, price, description, imageUrl } = product
  const { addItem } = useCart()
  const [imgFailed, setImgFailed] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  const showPlaceholder = !imageUrl || imgFailed

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
          >
            <img
              className={styles.image}
              src={imageUrl}
              alt={name}
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
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
