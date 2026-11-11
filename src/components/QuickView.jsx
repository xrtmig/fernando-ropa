import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  Store,
  Ruler,
  Loader2,
  CheckCircle2,
  MapPin,
  ChevronDown,
} from 'lucide-react'
import { SIZES } from '../data/products'
import { STORES, availabilityFor, formatPrice } from '../lib/utils'

const SIZE_GUIDE = [
  { size: 'XS', pecho: 86, cintura: 72 },
  { size: 'S', pecho: 92, cintura: 78 },
  { size: 'M', pecho: 98, cintura: 84 },
  { size: 'L', pecho: 104, cintura: 90 },
  { size: 'XL', pecho: 110, cintura: 96 },
  { size: 'XXL', pecho: 116, cintura: 102 },
]

const STATUS_META = {
  stock: { label: 'En stock', cls: 'stock-ok', dot: '#1e7a46' },
  low: { label: '¡Últimas unidades!', cls: 'stock-low', dot: '#b45309' },
  out: { label: 'Agotado', cls: 'stock-out', dot: '#b91c1c' },
}

export default function QuickView({
  product,
  isWishlisted,
  onToggleWishlist,
  onClose,
  onAddToCart,
}) {
  const firstAvailable = useMemo(
    () => SIZES.find((s) => !product.outOfStock.includes(s)) || 'M',
    [product],
  )

  const [color, setColor] = useState(product.colors[0].name)
  const [size, setSize] = useState(() =>
    product.outOfStock.includes('M') ? firstAvailable : 'M',
  )
  const [guideOpen, setGuideOpen] = useState(false)
  const [availOpen, setAvailOpen] = useState(false)
  const [store, setStore] = useState('all')
  const [contact, setContact] = useState('')
  const [contactError, setContactError] = useState('')
  const [checking, setChecking] = useState(false)
  const [results, setResults] = useState(null)

  // Reiniciar estado al cambiar de producto
  useEffect(() => {
    setColor(product.colors[0].name)
    setSize(product.outOfStock.includes('M') ? firstAvailable : 'M')
    setGuideOpen(false)
    setAvailOpen(false)
    setStore('all')
    setContact('')
    setContactError('')
    setChecking(false)
    setResults(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id])

  // Bloquear scroll del body + cerrar con Escape
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const isOut = product.outOfStock.includes(size)
  const isLow = product.lowStock.includes(size)
  const stockState = isOut ? 'out' : isLow ? 'low' : 'ok'
  const savePct = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0

  const checkAvailability = (e) => {
    e.preventDefault()
    if (!contact.trim()) {
      setContactError('Ingresa tu correo o celular para verificar.')
      return
    }
    setContactError('')
    setChecking(true)
    setResults(null)
    // Simulación de consulta a inventario en tiempo real (determinista)
    window.setTimeout(() => {
      const all = availabilityFor(product.id, size)
      setResults(store === 'all' ? all : all.filter((s) => s.id === store))
      setChecking(false)
    }, 900)
  }

  return (
    <motion.div
      className="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Vista ampliada de ${product.name}`}
    >
      <motion.div
        className="quickview"
        initial={{ opacity: 0, y: 48, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'relative' }}
      >
        <button className="icon-btn qv-close" onClick={onClose} aria-label="Cerrar vista ampliada">
          <X size={20} strokeWidth={2} />
        </button>

        {/* ── Imagen ampliada ─────────────────────────── */}
        <div className="qv-media">
          {product.badge && <span className="qv-badge">{product.badge}</span>}
          <img src={product.img} alt={`${product.name} — prenda ampliada`} />
        </div>

        {/* ── Detalles ─────────────────────────────────── */}
        <div className="qv-body">
          <span className="qv-cat">{product.category} · Colección 2026</span>
          <h3 className="qv-name">{product.name}</h3>
          <p className="qv-tagline">{product.tagline}</p>

          <div className="qv-rating">
            <span className="stars" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={14}
                  strokeWidth={1.6}
                  fill={i < Math.round(product.rating) ? '#c9a227' : 'none'}
                  color="#c9a227"
                />
              ))}
            </span>
            <b>{product.rating.toFixed(1)}</b>
            <span>· {product.reviews} reseñas verificadas</span>
          </div>

          <div className="qv-price-row">
            <span className="qv-price">{formatPrice(product.price)}</span>
            {product.oldPrice && <span className="qv-old">{formatPrice(product.oldPrice)}</span>}
            {savePct > 0 && <span className="qv-save">Ahorras {savePct}%</span>}
          </div>

          <p className="qv-blurb">{product.blurb}</p>
          <div className="qv-divider" />

          {/* Color */}
          <div className="qv-label">
            <span>Color — {color}</span>
          </div>
          <div className="swatches" role="radiogroup" aria-label="Selecciona un color">
            {product.colors.map((c) => (
              <button
                key={c.name}
                className={`swatch${color === c.name ? ' active' : ''}`}
                style={{ background: c.hex }}
                title={c.name}
                aria-label={`Color ${c.name}`}
                aria-pressed={color === c.name}
                onClick={() => setColor(c.name)}
              />
            ))}
          </div>

          {/* Talla */}
          <div className="qv-divider" />
          <div className="qv-label">
            <span>Talla — {size}</span>
            <button onClick={() => setGuideOpen((v) => !v)} aria-expanded={guideOpen}>
              <Ruler size={13} strokeWidth={2.2} /> Guía de tallas
              <ChevronDown
                size={13}
                strokeWidth={2.2}
                style={{ transform: guideOpen ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }}
              />
            </button>
          </div>
          <div className="sizes" role="radiogroup" aria-label="Selecciona una talla">
            {SIZES.map((s) => {
              const off = product.outOfStock.includes(s)
              return (
                <button
                  key={s}
                  className={`size-btn${size === s ? ' active' : ''}${off ? ' off' : ''}`}
                  disabled={off}
                  role="radio"
                  aria-checked={size === s}
                  aria-label={off ? `Talla ${s} agotada` : `Talla ${s}`}
                  onClick={() => setSize(s)}
                >
                  {s}
                </button>
              )
            })}
          </div>

          <AnimatePresence>
            {guideOpen && (
              <motion.div
                className="size-guide"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28 }}
                style={{ overflow: 'hidden' }}
              >
                <table>
                  <thead>
                    <tr><th>Talla</th><th>Pecho (cm)</th><th>Cintura (cm)</th></tr>
                  </thead>
                  <tbody>
                    {SIZE_GUIDE.map((r) => (
                      <tr key={r.size}><td>{r.size}</td><td>{r.pecho}</td><td>{r.cintura}</td></tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nota de stock */}
          <div className={`stock-note ${stockState === 'ok' ? 'stock-ok' : stockState === 'low' ? 'stock-low' : 'stock-out'}`}>
            <span
              className="stock-dot"
              style={{
                background: STATUS_META[stockState === 'ok' ? 'stock' : stockState].dot,
                animationPlayState: stockState === 'ok' ? 'paused' : 'running',
              }}
            />
            {stockState === 'ok' && `En stock en todas las tiendas · talla ${size}`}
            {stockState === 'low' && `¡Quedan pocas unidades en talla ${size}!`}
            {stockState === 'out' && `Talla ${size} agotada — prueba otra talla`}
          </div>

          {/* CTAs */}
          <div className="qv-ctas">
            <button
              className="btn btn-dark"
              disabled={isOut}
              onClick={() => onAddToCart(product, { color, size, qty: 1 })}
            >
              <ShoppingBag size={17} strokeWidth={2.2} />
              Agregar al carrito
            </button>
            <button className="btn btn-outline" onClick={() => setAvailOpen((v) => !v)} aria-expanded={availOpen}>
              <Store size={16} strokeWidth={2} />
              Consultar disponibilidad
              <ChevronDown size={15} strokeWidth={2.2} style={{ transform: availOpen ? 'rotate(180deg)' : 'none', transition: 'transform .25s', marginLeft: 'auto' }} />
            </button>
          </div>

          {/* Favorito */}
          <button
            className="btn"
            onClick={() => onToggleWishlist(product)}
            style={{ marginTop: 10, width: '100%', justifyContent: 'center', color: 'var(--ink-soft)', fontSize: 11 }}
            aria-pressed={isWishlisted}
          >
            <Heart size={16} strokeWidth={2} fill={isWishlisted ? 'var(--accent)' : 'none'} color={isWishlisted ? 'var(--accent)' : 'currentColor'} />
            {isWishlisted ? 'En tus favoritos' : 'Agregar a favoritos'}
          </button>

          {/* ── Panel de disponibilidad ─────────────────── */}
          <AnimatePresence>
            {availOpen && (
              <motion.div
                className="availability"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
                <h6><MapPin size={13} strokeWidth={2.2} /> Stock por tienda · Talla {size}</h6>
                <form className="avail-row" onSubmit={checkAvailability}>
                  <select value={store} onChange={(e) => { setStore(e.target.value); setResults(null) }} aria-label="Tienda">
                    <option value="all">Todas las tiendas</option>
                    {STORES.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Correo o celular"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    aria-label="Correo o celular para notificar"
                  />
                  <button type="submit" className="btn btn-dark" style={{ padding: '0 18px', fontSize: 11 }} disabled={checking}>
                    {checking ? <Loader2 size={15} className="spin" /> : 'Verificar'}
                  </button>
                </form>
                {contactError && (
                  <p style={{ color: 'var(--danger)', fontSize: 11.5, marginTop: 8, fontWeight: 600 }}>{contactError}</p>
                )}

                {results && (
                  <div className="avail-results">
                    {results.map((r) => {
                      const meta = STATUS_META[r.status]
                      return (
                        <div className="avail-store" key={r.id}>
                          <span className="avail-dot" style={{ background: meta.dot }} />
                          <span>
                            <strong style={{ fontSize: 12 }}>{r.name}</strong>
                            <small>{r.detail}</small>
                          </span>
                          <span className="avail-status" style={{ color: meta.dot }}>
                            {r.status === 'out' ? 'Agotado' : r.status === 'low' ? `¡Últimas ${r.units}!` : `${r.units} uds`}
                          </span>
                        </div>
                      )
                    })}
                    <p style={{ fontSize: 11, color: 'var(--ok)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, marginTop: 2 }}>
                      <CheckCircle2 size={14} /> Te confirmamos por {contact.includes('@') ? 'correo' : 'SMS'} si separas la pieza ahora.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
