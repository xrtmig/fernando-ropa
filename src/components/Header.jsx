import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  Trash2,
  Plus,
} from 'lucide-react'
import { LogoMark } from './Hanger'
import { CATEGORIES } from '../data/products'
import { formatPrice } from '../lib/utils'

const ANNOUNCE = [
  'Envío gratis en compras desde S/. 250',
  'Nueva colección Otoño–Invierno 2026',
  '30 días de devolución garantizada',
  'Usa CLOSET10 y llévate 10% off',
  'Pago contraentrega disponible en Lima',
]

export default function Header({
  cartCount,
  wishlist,
  onCartOpen,
  onSearchOpen,
  onToggleWishlist,
  onAddToCart,
  onNavigateCategory,
  onHome,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)

  const goCategory = (id) => (e) => {
    e.preventDefault()
    onNavigateCategory(id)
    setMenuOpen(false)
    setWishlistOpen(false)
  }

  return (
    <>
      {/* ── Barra de anuncios ─────────────────────────── */}
      <div className="announce" aria-hidden="true">
        <div className="announce-track">
          {[...ANNOUNCE, ...ANNOUNCE].map((msg, i) => (
            <span className="announce-item" key={i}>
              <span className="announce-dot" />
              {msg}
            </span>
          ))}
        </div>
      </div>

      {/* ── Header principal ──────────────────────────── */}
      <header className="header">
        <div className="container header-inner">
          {/* Izquierda: menú móvil + nav escritorio */}
          <div className="header-left">
            <button
              className="icon-btn menu-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu size={22} strokeWidth={1.8} />
            </button>
            <nav className="header-nav" aria-label="Navegación principal">
              <a href="#coleccion" onClick={goCategory('todos')}>Colección</a>
              <a href="#lookbook">Lookbook</a>
              <a href="#contacto">Contacto</a>
            </nav>
          </div>

          {/* Centro: logotipo */}
          <a className="logo" href="#" onClick={(e) => { e.preventDefault(); onHome() }} aria-label="Clothes Closet — inicio">
            <span className="logo-mark">
              <LogoMark size={26} />
              <span className="logo-word">CLOTHES&nbsp;CLOSET</span>
            </span>
            <span className="logo-sub">Est. 2019 · Lima</span>
          </a>

          {/* Derecha: iconos */}
          <div className="header-right" style={{ position: 'relative' }}>
            <button className="icon-btn" onClick={onSearchOpen} aria-label="Buscar productos">
              <Search size={21} strokeWidth={1.8} />
            </button>

            <button
              className="icon-btn"
              onClick={() => setWishlistOpen((v) => !v)}
              aria-label="Abrir favoritos"
              aria-expanded={wishlistOpen}
            >
              <Heart size={21} strokeWidth={1.8} fill={wishlist.length ? 'var(--accent)' : 'none'} color={wishlist.length ? 'var(--accent)' : 'currentColor'} />
              {wishlist.length > 0 && (
                <motion.span
                  key={wishlist.length}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                  className="icon-badge"
                >
                  {wishlist.length}
                </motion.span>
              )}
            </button>

            <button className="icon-btn" onClick={onCartOpen} aria-label="Abrir carrito">
              <ShoppingBag size={21} strokeWidth={1.8} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 16 }}
                  className="icon-badge"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* ── Dropdown de favoritos ── */}
            <AnimatePresence>
              {wishlistOpen && (
                <>
                  <button
                    aria-label="Cerrar favoritos"
                    onClick={() => setWishlistOpen(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: 75, cursor: 'default' }}
                  />
                  <motion.div
                    className="wishlist-pop"
                    style={{ zIndex: 80 }}
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.22 }}
                  >
                    <h4>Favoritos · {wishlist.length}</h4>
                    {wishlist.length === 0 ? (
                      <p style={{ padding: '6px 16px 18px', fontSize: 12.5, color: 'var(--ink-soft)' }}>
                        Aún no tienes favoritos. Toca el corazón de una prenda y aparecerá aquí.
                      </p>
                    ) : (
                      <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                        {wishlist.map((p) => (
                          <div className="wishlist-item" key={p.id}>
                            <img src={p.img} alt={p.name} loading="lazy" />
                            <div>
                              <p className="wishlist-item-name">{p.name}</p>
                              <p className="wishlist-item-price">{formatPrice(p.price)}</p>
                            </div>
                            <div className="wishlist-actions">
                              <button
                                className="icon-btn"
                                style={{ width: 34, height: 34 }}
                                title="Agregar al carrito (talla M)"
                                aria-label={`Agregar ${p.name} al carrito`}
                                onClick={() => onAddToCart(p, { size: 'M', color: p.colors[0].name })}
                              >
                                <Plus size={17} />
                              </button>
                              <button
                                className="icon-btn"
                                style={{ width: 34, height: 34 }}
                                title="Quitar de favoritos"
                                aria-label={`Quitar ${p.name} de favoritos`}
                                onClick={() => onToggleWishlist(p)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Subnavegación de colecciones ─────────────── */}
        <nav className="subnav" aria-label="Colecciones">
          {CATEGORIES.map((c) => (
            <a key={c.id} className="subnav-link" href="#coleccion" onClick={goCategory(c.id)}>
              {c.label}
            </a>
          ))}
        </nav>
      </header>

      {/* ── Menú móvil ─────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
          >
            <motion.div
              className="mobile-menu-panel"
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <LogoMark size={30} />
                <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
                  <X size={24} strokeWidth={1.8} />
                </button>
              </div>
              <nav className="mobile-menu-links">
                {CATEGORIES.map((c) => (
                  <a key={c.id} className="mobile-menu-link" href="#coleccion" onClick={goCategory(c.id)}>
                    {c.label}
                    <ChevronRight size={20} strokeWidth={1.6} />
                  </a>
                ))}
                <a className="mobile-menu-link" href="#lookbook" onClick={() => setMenuOpen(false)}>
                  Lookbook
                  <ChevronRight size={20} strokeWidth={1.6} />
                </a>
              </nav>
              <p style={{ marginTop: 18, fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 700 }}>
                Envío gratis desde S/. 250 · Lima, Perú
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
