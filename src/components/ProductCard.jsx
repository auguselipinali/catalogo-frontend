import { useState } from 'react'
import { formatPrice } from '../lib/format'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const { name, price, description, imageUrl } = product
  const [imgFailed, setImgFailed] = useState(false)

  const showPlaceholder = !imageUrl || imgFailed

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        {showPlaceholder ? (
          <div className={styles.placeholder} aria-hidden="true">
            Sin imagen
          </div>
        ) : (
          <img
            className={styles.image}
            src={imageUrl}
            alt={name}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>

      <div className={styles.body}>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.price}>{formatPrice(price)}</p>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </article>
  )
}
