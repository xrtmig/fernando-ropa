import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X, SearchX } from 'lucide-react'
import { formatPrice } from '../lib/utils'

const normalize = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export default function SearchOverlay({ products, onClose, onSelect }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const results = useMemo(() => {
    const q = normalize(query.trim())
    if (!q) return products.slice(0, 8)
    return products.filter((p) =>
      normalize(`${p.name} ${p.category} ${p.tagline} ${p.colors.map((c) => c.name).join(' ')}`).includes(q),
    )
  }, [query, products])

  return (
    <motion.div
      className="search-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Buscar productos"
    >
      <div className="search-panel" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrap">
          <Search size={26} strokeWidth={1.8} color="var(--ink-soft)" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar prendas, colores, colecciones…"
            aria-label="Buscar productos"
          />
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar buscador">
            <X size={22} strokeWidth={1.8} />
          </button>
        </div>

        {results.length > 0 ? (
          <div className="search-results">
            {results.map((p) => (
              <button key={p.id} className="search-hit" onClick={() => onSelect(p)}>
                <img src={p.img} alt={p.name} loading="lazy" />
                <div>
                  <p>{p.name}</p>
                  <span>{formatPrice(p.price)}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'rgba(255,255,255,.75)' }}>
            <SearchX size={44} strokeWidth={1.4} style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: 15, fontWeight: 600 }}>Sin resultados para “{query}”</p>
            <p style={{ fontSize: 12.5, opacity: .75, marginTop: 4 }}>Prueba con “camiseta”, “bomber”, “denim” o “chaleco”.</p>
          </div>
        )}
        <p className="search-hint">Esc para cerrar · Mostrando {results.length} {results.length === 1 ? 'prenda' : 'prendas'}</p>
      </div>
    </motion.div>
  )
}
