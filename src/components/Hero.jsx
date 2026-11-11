import { ArrowRight, Truck, RotateCcw, ShieldCheck, Sparkles, Star } from 'lucide-react'

const STATS = [
  { value: '+12.4K', label: 'Clientes felices' },
  { value: '4.9/5', label: '1,240 reseñas' },
  { value: '48h', label: 'Entrega en Lima' },
  { value: '30 días', label: 'Devolución fácil' },
]

export default function Hero({ onExplore }) {
  return (
    <>
      <section className="hero" id="inicio">
        <div className="container hero-inner">
          {/* ── Copy ─────────────────────────────── */}
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={13} strokeWidth={2.4} /> Otoño–Invierno 2026</span>
            <h1 className="hero-title">
              El clóset que<br />
              <em>siempre soñaste.</em>
            </h1>
            <p className="hero-sub">
              Prendas esenciales de algodón pima y cortes atemporales. Diseñadas en Lima,
              pensadas para durar décadas — del escritorio al fin de semana.
            </p>
            <div className="hero-ctas">
              <button className="btn btn-dark" onClick={onExplore}>
                Ver la colección <ArrowRight size={16} strokeWidth={2.4} />
              </button>
              <a className="btn btn-outline" href="#lookbook">Lookbook 2026</a>
            </div>
            <div className="hero-trust">
              <span className="hero-trust-item"><Truck size={17} strokeWidth={2} /> Envío 24/48h</span>
              <span className="hero-trust-item"><RotateCcw size={17} strokeWidth={2} /> Cambios gratis</span>
              <span className="hero-trust-item"><ShieldCheck size={17} strokeWidth={2} /> Compra protegida</span>
            </div>
          </div>

          {/* ── Visual editorial ─────────────────── */}
          <div className="hero-visual">
            <div className="hero-badge">
              <span>Nueva</span>
              Otoño–<br />Invierno<br />2026
            </div>
            <figure className="hero-arch">
              <img
                src="/images/hero-editorial.jpg"
                alt="Editorial Clothes Closet — modelo con gabardina beige y camiseta blanca en nuestra flagship de Lima"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = '/images/chaqueta-bomber-oliva.jpg'
                }}
              />
            </figure>
            <div className="hero-card">
              <Star size={26} fill="#c9a227" color="#c9a227" strokeWidth={1.4} />
              <div>
                <strong>4.9 / 5 — Excelente</strong>
                <small>Basado en 1,240 reseñas verificadas</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Franja de estadísticas ──────────────── */}
      <div className="stats-strip" aria-hidden="true">
        <div className="container stats-inner">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <b>{s.value}</b>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
