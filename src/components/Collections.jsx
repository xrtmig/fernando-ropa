import { ArrowRight } from 'lucide-react'
import { PRODUCTS, CATEGORIES } from '../data/products'

const TILE_IMAGES = {
  camisetas: '/images/camiseta-esencial-blanca.jpg',
  chaquetas: '/images/chaqueta-bomber-oliva.jpg',
  pantalones: '/images/pantalon-jogger-negro.jpg',
  chalecos: '/images/chaleco-camel-acolchado.jpg',
}

export default function Collections({ onSelect }) {
  const tiles = CATEGORIES.filter((c) => c.id !== 'todos').map((c) => ({
    ...c,
    img: TILE_IMAGES[c.id],
    count: PRODUCTS.filter((p) => p.category === c.id).length,
  }))

  return (
    <section className="section" style={{ paddingTop: 0 }} aria-label="Colecciones">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Navega por colección</span>
            <h2 className="section-title">
              Cuatro mundos,<br />un <em>solo clóset.</em>
            </h2>
          </div>
        </div>
        <div className="tiles">
          {tiles.map((tile) => (
            <button
              key={tile.id}
              className="tile"
              onClick={() => onSelect(tile.id)}
              aria-label={`Ver colección de ${tile.label}`}
            >
              <img src={tile.img} alt={`Colección de ${tile.label}`} loading="lazy" />
              <span className="tile-body">
                <span>
                  <h3>{tile.label}</h3>
                  <small>{tile.count} prendas</small>
                </span>
                <span className="tile-arrow">
                  <ArrowRight size={18} strokeWidth={2} />
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
