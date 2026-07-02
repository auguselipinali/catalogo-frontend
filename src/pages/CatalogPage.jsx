import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProducts, TenantNotFoundError } from '../api/catalog'
import { normalize } from '../lib/text'
import { CartProvider } from '../cart/CartProvider'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import CartButton from '../components/CartButton'
import CartDrawer from '../components/CartDrawer'
import styles from './CatalogPage.module.css'

export default function CatalogPage() {
  const { slug } = useParams()
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // loading | ok | not-found | error
  const [shownSlug, setShownSlug] = useState(slug)
  const [query, setQuery] = useState('')

  // Al cambiar de comercio volvemos a "loading" antes de pintar.
  // Patrón recomendado por React (ajustar estado en render según un prop).
  if (slug !== shownSlug) {
    setShownSlug(slug)
    setStatus('loading')
    setProducts([])
    setQuery('')
  }

  useEffect(() => {
    let active = true

    getProducts(slug)
      .then((data) => {
        if (!active) return
        setProducts(data)
        setStatus('ok')
      })
      .catch((err) => {
        if (!active) return
        setStatus(err instanceof TenantNotFoundError ? 'not-found' : 'error')
      })

    return () => {
      active = false
    }
  }, [slug])

  return (
    <>
      <Header />
      {renderContent()}
    </>
  )

  function renderContent() {
    if (status === 'loading') {
      return <p className={styles.state}>Cargando catálogo…</p>
    }

    if (status === 'not-found') {
      return (
        <p className={styles.state}>
          No encontramos el comercio <strong>{slug}</strong>. Revisá el enlace.
        </p>
      )
    }

    if (status === 'error') {
      return (
        <p className={styles.state}>
          Ocurrió un error al cargar el catálogo. Intentá de nuevo más tarde.
        </p>
      )
    }

    if (products.length === 0) {
      return (
        <p className={styles.state}>Este comercio todavía no cargó productos.</p>
      )
    }

    // Filtrado en vivo, derivado en render (sin estado extra). Tolerante a
    // mayúsculas y acentos vía normalize(). Query vacío -> todos.
    const q = normalize(query)
    const visible = q
      ? products.filter(
          (p) =>
            normalize(p.name).includes(q) ||
            normalize(p.description).includes(q),
        )
      : products

    return (
      <CartProvider slug={slug} products={products}>
        <main className={styles.page}>
          <div className={styles.search}>
            <span className={styles.searchIcon} aria-hidden="true">
              🔍
            </span>
            <input
              className={styles.searchInput}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos…"
              aria-label="Buscar productos"
            />
          </div>

          {visible.length === 0 ? (
            <p className={styles.state}>
              No encontramos productos con esa búsqueda.
            </p>
          ) : (
            <div className={styles.grid}>
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
        <CartButton />
        <CartDrawer />
      </CartProvider>
    )
  }
}
