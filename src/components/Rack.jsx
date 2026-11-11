import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Eye, Heart, ShoppingBag } from 'lucide-react'
import Hanger from './Hanger'
import { CATEGORIES } from '../data/products'
import { formatPrice } from '../lib/utils'

/**
 * El Perchero — el corazón de la tienda.
 * Una barra cromada donde las prendas cuelgan de perchas de madera;
 * cada una se balancea de forma ligeramente distinta al pasar el cursor.
 */
export default function Rack({
  products,
  activeCategory,
  onCategoryChange,
  onQuickView,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
}) {
  const scrollRef = useRef(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  const updateArrows = () => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 14)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 14)
  }

  useEffect(() => {
    updateArrows()
    const el = scrollRef.current
    if (!el) return undefined
    el.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [products])

  const nudge = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.min(460, el.clientWidth * 0.75), behavior: 'smooth' })
  }

  return (
    <section className="section" id="coleccion" aria-label="Colección disponible">
      <div className="container">
        {/* Encabezado de sección */}
        <div className="section-head">
          <div>
            <span className="eyebrow">El Perchero · Otoño–Invierno</span>
            <h2 className="section-title">
              Cuélgalas todas<br />en <em>tu clóset.</em>
            </h2>
            <p className="section-sub">
              Desliza la barra cromada, toca una prenda y mírala de cerca.
              Cada pieza se balancea en su percha — como en la tienda.
            </p>
          </div>
          <div className="rack-nav" aria-hidden="true">
            <button className="rack-nav-btn" onClick={() => nudge(-1)} disabled={!canLeft} aria-label="Desplazar a la izquierda">
              <ChevronLeft size={20} strokeWidth={2} />
            </button>
            <button className="rack-nav-btn" onClick={() => nudge(1)} disabled={!canRight} aria-label="Desplazar a la derecha">
              <ChevronRight size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Filtros por colección */}
        <div className="chips" role="tablist" aria-label="Filtrar por colección">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={activeCategory === c.id}
              className={`chip${activeCategory === c.id ? ' active' : ''}`}
              onClick={() => onCategoryChange(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* El mueble: postes, barra y prendas */}
        <div className="rack-shell">
          <div className="rail-post left" />
          <div className="rail-post right" />
          <div className="rail" />

          <div className="rail-scroll" ref={scrollRef}>
            <AnimatePresence mode="popLayout" initial={false}>
              {products.map((p, i) => {
                const dir = i % 2 === 0 ? 1 : -1
                const wished = wishlistIds.includes(p.id)
                const isSale = Boolean(p.oldPrice)
                return (
                  <motion.div
                    key={p.id}
                    layout
                    className="garment"
                    initial={{ opacity: 0, y: 42, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.82, transition: { duration: 0.22 } }}
                    transition={{ type: 'spring', stiffness: 210, damping: 23, delay: i * 0.045 }}
                  >
                    {/* Badge y favorito (fuera del botón principal) */}
                    {p.badge && (
                      <span className={`garment-badge${isSale ? ' sale' : ''}`}>{p.badge}</span>
                    )}
                    <button
                      className={`garment-wish${wished ? ' active' : ''}`}
                      onClick={() => onToggleWishlist(p)}
                      aria-pressed={wished}
                      aria-label={wished ? `Quitar ${p.name} de favoritos` : `Agregar ${p.name} a favoritos`}
                    >
                      <Heart size={16} strokeWidth={2} fill={wished ? 'currentColor' : 'none'} />
                    </button>

                    {/* Prenda colgada — se balancea distinto en cada índice */}
                    <motion.button
                      className="garment-hit"
                      onClick={() => onQuickView(p)}
                      whileHover={{
                        rotate: [0, 2.7 * dir, -2.1 * dir, 1.25 * dir, -0.5 * dir, 0],
                        y: -9,
                        transition: { duration: 1.2, ease: 'easeOut' },
                      }}
                      style={{ transformOrigin: '50% 0%' }}
                      aria-label={`Ver ${p.name}`}
                    >
                      <Hanger className="garment-hanger" />
                      <span className="garment-media">
                        <img src={p.img} alt={p.name} draggable="false" loading="lazy" />
                      </span>
                      <span className="garment-info">
                        <span className="garment-cat">{p.category}</span>
                        <span className="garment-name">{p.name}</span>
                        <span className="garment-price">
                          {formatPrice(p.price)}
                          {p.oldPrice && <s>{formatPrice(p.oldPrice)}</s>}
                        </span>
                      </span>
                    </motion.button>

                    {/* Acciones rápidas */}
                    <div className="garment-actions">
                      <button className="mini-btn" onClick={() => onQuickView(p)}>
                        <Eye size={13} strokeWidth={2.4} /> Vista rápida
                      </button>
                      <button className="mini-btn solid" onClick={() => onQuickAdd(p)} aria-label={`Agregar ${p.name} al carrito`}>
                        <ShoppingBag size={13} strokeWidth={2.4} /> Agregar
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
