import { useEffect } from 'react'
import { useCart } from '../cart/CartContext'
import { formatPrice } from '../lib/format'
import { buildOrderMessage, buildWhatsappUrl } from '../cart/whatsapp'
import styles from './CartDrawer.module.css'

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMERO

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    detailedItems,
    total,
    increment,
    decrement,
    removeItem,
  } = useCart()

  // Cerrar con Esc mientras está abierto.
  useEffect(() => {
    if (!isOpen) return
    function onKey(e) {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, closeCart])

  if (!isOpen) return null

  const isEmpty = detailedItems.length === 0
  const canOrder = !isEmpty && Boolean(WHATSAPP_NUMBER)

  function handleOrder() {
    const message = buildOrderMessage(detailedItems, total)
    window.open(
      buildWhatsappUrl(WHATSAPP_NUMBER, message),
      '_blank',
      'noopener',
    )
  }

  return (
    <div className={styles.overlay} onClick={closeCart}>
      <aside
        className={styles.drawer}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Carrito de compras"
      >
        <header className={styles.header}>
          <h2 className={styles.title}>Tu pedido</h2>
          <button
            className={styles.close}
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </header>

        {isEmpty ? (
          <div className={styles.empty}>
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          <ul className={styles.list}>
            {detailedItems.map((item) => (
              <li key={item.id} className={styles.line}>
                <div className={styles.lineInfo}>
                  <span className={styles.lineName}>{item.name}</span>
                  <span className={styles.lineUnit}>
                    {formatPrice(item.price)} c/u
                  </span>
                </div>

                <div className={styles.lineControls}>
                  <div className={styles.qty}>
                    <button
                      type="button"
                      onClick={() => decrement(item.id)}
                      aria-label={`Quitar una unidad de ${item.name}`}
                    >
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button
                      type="button"
                      onClick={() => increment(item.id)}
                      aria-label={`Agregar una unidad de ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                  <span className={styles.lineSubtotal}>
                    {formatPrice(item.subtotal)}
                  </span>
                </div>

                <button
                  className={styles.remove}
                  type="button"
                  onClick={() => removeItem(item.id)}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}

        <footer className={styles.footer}>
          <div className={styles.totalRow}>
            <span>Total</span>
            <span className={styles.totalValue}>{formatPrice(total)}</span>
          </div>
          <button
            className={styles.order}
            type="button"
            onClick={handleOrder}
            disabled={!canOrder}
          >
            Hacer pedido por WhatsApp
          </button>
          {!isEmpty && !WHATSAPP_NUMBER && (
            <p className={styles.warn}>
              Falta configurar el número de WhatsApp del comercio.
            </p>
          )}
        </footer>
      </aside>
    </div>
  )
}
