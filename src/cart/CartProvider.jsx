import { useEffect, useMemo, useState } from 'react'
import { CartContext } from './CartContext'

// Solo persistimos { id, qty } por línea. Nombre y precio vienen SIEMPRE de la
// API (fuente de verdad); acá no se guardan para no servir datos desactualizados.
function storageKey(slug) {
  return `carrito.${slug}`
}

function readStored(slug) {
  try {
    const raw = localStorage.getItem(storageKey(slug))
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ slug, products, children }) {
  const [items, setItems] = useState(() => readStored(slug))
  const [isOpen, setIsOpen] = useState(false)

  // Reconciliación: cruzamos lo guardado contra los productos actuales.
  // - producto que ya no existe -> se descarta;
  // - precio y nombre -> siempre del API;
  // - subtotal = price * qty.
  const detailedItems = useMemo(() => {
    return items
      .map(({ id, qty }) => {
        const product = products.find((p) => p.id === id)
        if (!product) return null
        return {
          id,
          qty,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          subtotal: product.price * qty,
        }
      })
      .filter(Boolean)
  }, [items, products])

  // Persistimos ya reconciliado: solo ids que siguen existiendo. Así los
  // productos eliminados se limpian solos, sin tocar el estado dentro del render.
  useEffect(() => {
    const reconciled = detailedItems.map(({ id, qty }) => ({ id, qty }))
    localStorage.setItem(storageKey(slug), JSON.stringify(reconciled))
  }, [slug, detailedItems])

  const total = useMemo(
    () => detailedItems.reduce((sum, item) => sum + item.subtotal, 0),
    [detailedItems],
  )

  const count = useMemo(
    () => detailedItems.reduce((sum, item) => sum + item.qty, 0),
    [detailedItems],
  )

  function addItem(id) {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, qty: item.qty + 1 } : item,
        )
      }
      return [...prev, { id, qty: 1 }]
    })
  }

  function increment(id) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    )
  }

  function decrement(id) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item,
        )
        .filter((item) => item.qty > 0),
    )
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  function clear() {
    setItems([])
  }

  const value = {
    detailedItems,
    total,
    count,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    increment,
    decrement,
    removeItem,
    clear,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
