import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProducts, TenantNotFoundError } from '../api/catalog'
import { normalize } from '../lib/text'
import { CartProvider } from '../cart/CartProvider'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import CartButton from '../components/CartButton'
import CartDrawer from '../components/CartDrawer'
import SiteFooter from '../components/SiteFooter'
import styles from './CatalogPage.module.css'

export default function CatalogPage() {
  const { slug } = useParams()
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading') // loading | ok | not-found | error
  const [shownSlug, setShownSlug] = useState(slug)
  const [query, setQuery] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)

  // Al cambiar de comercio volvemos a "loading" antes de pintar.
  // Patrón recomendado por React (ajustar estado en render según un prop).
  if (slug !== shownSlug) {
    setShownSlug(slug)
    setStatus('loading')
    setProducts([])
    setQuery('')
    setSelectedCategoryId(null)
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
      <SiteFooter />
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

    // Categorías con productos, derivadas de la lista cargada (únicas por id).
    const categories = []
    const seen = new Set()
    for (const p of products) {
      if (p.categoryId && !seen.has(p.categoryId)) {
        seen.add(p.categoryId)
        categories.push({ id: p.categoryId, name: p.categoryName })
      }
    }

    // Pipeline derivado en render, en AND: primero categoría, luego texto.
    const q = normalize(query)
    const visible = products
      .filter((p) => !selectedCategoryId || p.categoryId === selectedCategoryId)
      .filter(
        (p) =>
          !q ||
          normalize(p.name).includes(q) ||
          normalize(p.description).includes(q),
      )

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

          {categories.length > 0 && (
            <div className={styles.chips}>
              <button
                type="button"
                className={`${styles.chip} ${
                  selectedCategoryId === null ? styles.chipActive : ''
                }`}
                onClick={() => setSelectedCategoryId(null)}
              >
                Todos
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`${styles.chip} ${
                    selectedCategoryId === category.id ? styles.chipActive : ''
                  }`}
                  onClick={() => setSelectedCategoryId(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}

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
