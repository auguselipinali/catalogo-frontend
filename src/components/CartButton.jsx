import { useCart } from '../cart/CartContext'
import styles from './CartButton.module.css'

export default function CartButton() {
  const { count, openCart } = useCart()

  // Oculto cuando el carrito está vacío.
  if (count === 0) return null

  return (
    <button
      className={styles.button}
      type="button"
      onClick={openCart}
      aria-label={`Abrir carrito (${count} productos)`}
    >
      <span className={styles.icon} aria-hidden="true">
        🛍️
      </span>
      <span className={styles.badge}>{count}</span>
    </button>
  )
}
