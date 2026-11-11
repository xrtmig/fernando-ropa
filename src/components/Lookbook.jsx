import { ArrowRight, Quote } from 'lucide-react'

export default function Lookbook({ onExplore }) {
  return (
    <section className="lookbook" id="lookbook" aria-label="Lookbook">
      <div className="lookbook-inner">
        <div className="lookbook-copy">
          <Quote size={40} strokeWidth={1.4} color="#d9b365" aria-hidden="true" />
          <p className="lookbook-quote">
            “La elegancia es <b>negarse a lo innecesario</b> — y abrigarse con lo esencial.”
          </p>
          <p className="lookbook-meta">Editorial Otoño–Invierno 2026 · Fotografía en Flagship Lima</p>
          <div>
            <button className="btn btn-accent" onClick={onExplore}>
              Explorar el perchero <ArrowRight size={16} strokeWidth={2.4} />
            </button>
          </div>
        </div>
        <figure className="lookbook-img">
          <img
            src="/images/chaqueta-cortavientos-gris.jpg"
            alt="Editorial Lookbook Clothes Closet — cortavientos Grit en la flagship de Lima"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = '/images/chaqueta-bomber-oliva.jpg'
            }}
          />
        </figure>
      </div>
    </section>
  )
}
