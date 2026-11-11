import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, CheckCircle2 } from 'lucide-react'
import Header from './components/Header'
import Hero from './components/Hero'
import Rack from './components/Rack'
import Collections from './components/Collections'
import Lookbook from './components/Lookbook'
import Footer from './components/Footer'
import QuickView from './components/QuickView'
import CartDrawer from './components/CartDrawer'
import SearchOverlay from './components/SearchOverlay'
import { PRODUCTS, PROMO_CODES, SIZES } from './data/products'

const lineKey = (id, color, size) => `${id}|${color}|${size}`
const PRODUCT_MAP = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]))

function loadJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [cart, setCart] = useState(() => loadJSON('cc-cart', []))
  const [wishlist, setWishlist] = useState(() => loadJSON('cc-wishlist', []))
  const [quickViewId, setQuickViewId] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [category, setCategory] = useState('todos')
  const [toast, setToast] = useState(null)
  const [promoInput, setPromoInput] = useState('')
  const [promoApplied, setPromoApplied] = useState(null)
  const [promoError, setPromoError] = useState('')
  const [showTop, setShowTop] = useState(false)

  // ── Persistencia ──────────────────────────────────────────────
  useEffect(() => {
    try { window.localStorage.setItem('cc-cart', JSON.stringify(cart)) } catch { /* noop */ }
  }, [cart])
  useEffect(() => {
    try { window.localStorage.setItem('cc-wishlist', JSON.stringify(wishlist)) } catch { /* noop */ }
  }, [wishlist])

  // ── Toast con auto-cierre ─────────────────────────────────────
  useEffect(() => {
    if (!toast) return undefined
    const t = window.setTimeout(() => setToast(null), 3400)
    return () => window.clearTimeout(t)
  }, [toast])

  // ── Botón “volver arriba” ─────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Navegación a colecciones ──────────────────────────────────
  const navigateCategory = useCallback((id) => {
    setCategory(id)
    const el = document.getElementById('coleccion')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // ── Carrito ───────────────────────────────────────────────────
  const addToCart = useCallback((product, { color, size, qty = 1 }) => {
    if (product.outOfStock.includes(size)) {
      setToast(`La talla ${size} de ${product.name} está agotada`)
      return
    }
    setCart((prev) => {
      const key = lineKey(product.id, color, size)
      const idx = prev.findIndex((l) => l.key === key)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + qty }
        return next
      }
      return [...prev, { key, id: product.id, color, size, qty }]
    })
    setToast(`Agregado: ${product.name} · Talla ${size}`)
  }, [])

  const quickAdd = useCallback((product) => {
    const size = SIZES.find((s) => !product.outOfStock.includes(s) && s === 'M')
      || SIZES.find((s) => !product.outOfStock.includes(s))
      || 'M'
    addToCart(product, { color: product.colors[0].name, size, qty: 1 })
  }, [addToCart])

  const updateQty = useCallback((key, delta) => {
    setCart((prev) =>
      prev
        .map((l) => (l.key === key ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0),
    )
  }, [])

  const removeLine = useCallback((key) => {
    setCart((prev) => prev.filter((l) => l.key !== key))
  }, [])

  const lines = useMemo(
    () =>
      cart
        .map((l) => ({ ...l, product: PRODUCT_MAP[l.id] }))
        .filter((l) => l.product),
    [cart],
  )

  const subtotal = useMemo(
    () => lines.reduce((acc, l) => acc + l.product.price * l.qty, 0),
    [lines],
  )
  const discount = promoApplied ? subtotal * PROMO_CODES[promoApplied] : 0
  const cartCount = lines.reduce((acc, l) => acc + l.qty, 0)

  const applyPromo = useCallback(() => {
    const code = promoInput.trim().toUpperCase()
    if (!code) return
    if (PROMO_CODES[code]) {
      setPromoApplied(code)
      setPromoError('')
      setToast(`Cupón ${code} aplicado`)
    } else {
      setPromoError('Cupón no válido. Prueba con CLOSET10.')
    }
  }, [promoInput])

  const orderPlaced = useCallback(() => {
    setCart([])
    setPromoApplied(null)
    setPromoInput('')
    setPromoError('')
  }, [])

  // ── Favoritos ─────────────────────────────────────────────────
  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.includes(product.id)
      setToast(exists ? `${product.name} eliminada de favoritos` : `${product.name} agregada a favoritos`)
      return exists ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    })
  }, [])

  const wishlistProducts = useMemo(
    () => PRODUCTS.filter((p) => wishlist.includes(p.id)),
    [wishlist],
  )

  const openQuickView = useCallback((product) => {
    setSearchOpen(false)
    setQuickViewId(product.id)
  }, [])

  const quickViewProduct = quickViewId ? PRODUCT_MAP[quickViewId] : null
  const filteredProducts = useMemo(
    () => (category === 'todos' ? PRODUCTS : PRODUCTS.filter((p) => p.category === category)),
    [category],
  )

  return (
    <>
      <Header
        cartCount={cartCount}
        wishlist={wishlistProducts}
        onCartOpen={() => setCartOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
        onToggleWishlist={toggleWishlist}
        onAddToCart={addToCart}
        onNavigateCategory={navigateCategory}
        onHome={scrollTop}
      />

      <main>
        <Hero onExplore={() => navigateCategory('todos')} />
        <Rack
          products={filteredProducts}
          activeCategory={category}
          onCategoryChange={setCategory}
          onQuickView={openQuickView}
          wishlistIds={wishlist}
          onToggleWishlist={toggleWishlist}
          onQuickAdd={quickAdd}
        />
        <Collections onSelect={navigateCategory} />
        <Lookbook onExplore={() => navigateCategory('todos')} />
      </main>

      <Footer onNavigateCategory={navigateCategory} />

      {/* ── Overlays ─────────────────────────────────────── */}
      <AnimatePresence>
        {quickViewProduct && (
          <QuickView
            key="quickview"
            product={quickViewProduct}
            isWishlisted={wishlist.includes(quickViewProduct.id)}
            onToggleWishlist={toggleWishlist}
            onClose={() => setQuickViewId(null)}
            onAddToCart={addToCart}
          />
        )}
        {cartOpen && (
          <CartDrawer
            key="cart"
            onClose={() => setCartOpen(false)}
            lines={lines}
            subtotal={subtotal}
            discount={discount}
            total={subtotal - discount}
            promoInput={promoInput}
            promoApplied={promoApplied}
            promoError={promoError}
            onPromoInputChange={(v) => { setPromoInput(v); setPromoError('') }}
            onApplyPromo={applyPromo}
            onRemovePromo={() => { setPromoApplied(null); setPromoInput(''); setPromoError('') }}
            onUpdateQty={updateQty}
            onRemoveLine={removeLine}
            onOrderPlaced={orderPlaced}
            onExplore={() => { setCartOpen(false); navigateCategory('todos') }}
          />
        )}
        {searchOpen && (
          <SearchOverlay
            key="search"
            products={PRODUCTS}
            onClose={() => setSearchOpen(false)}
            onSelect={openQuickView}
          />
        )}
      </AnimatePresence>

      {/* ── Toast ───────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 28, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 12, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <CheckCircle2 size={19} strokeWidth={2.2} />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Volver arriba ───────────────────────────────── */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            className="to-top"
            onClick={scrollTop}
            aria-label="Volver arriba"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            <ArrowUp size={20} strokeWidth={2} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
