import { useState } from 'react'
import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  Send,
} from 'lucide-react'

const CATEGORY_LINKS = [
  { id: 'todos', label: 'Todo el perchero' },
  { id: 'camisetas', label: 'Camisetas' },
  { id: 'chaquetas', label: 'Chaquetas' },
  { id: 'pantalones', label: 'Pantalones' },
  { id: 'chalecos', label: 'Chalecos' },
]

const HELP_LINKS = ['Envíos y entregas', 'Cambios y devoluciones', 'Guía de tallas', 'Métodos de pago', 'Cuidado de prendas']

export default function Footer({ onNavigateCategory }) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState('')

  const subscribe = (e) => {
    e.preventDefault()
    const value = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError('Ingresa un correo válido (ej. nombre@correo.com).')
      return
    }
    setError('')
    setSubscribed(true)
  }

  return (
    <footer className="footer" id="contacto">
      <div className="container">
        <div className="footer-top">
          {/* Marca + social */}
          <div>
            <p className="footer-brand">CLOTHES<span>&nbsp;CLOSET</span></p>
            <p style={{ fontSize: 12.5, marginTop: 10, maxWidth: '34ch' }}>
              Minimalismo con carácter: prendas esenciales diseñadas en Lima,
              confeccionadas para durar.
            </p>
            <div className="socials">
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} strokeWidth={1.8} /></a>
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={17} strokeWidth={1.8} /></a>
              <a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={17} strokeWidth={1.8} /></a>
              <a href="https://www.twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><Twitter size={17} strokeWidth={1.8} /></a>
            </div>
          </div>

          {/* Colecciones */}
          <nav aria-label="Colecciones">
            <h5>Colecciones</h5>
            <ul className="footer-links">
              {CATEGORY_LINKS.map((l) => (
                <li key={l.id}>
                  <a href="#coleccion" onClick={(e) => { e.preventDefault(); onNavigateCategory(l.id) }}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Ayuda */}
          <nav aria-label="Ayuda">
            <h5>Ayuda</h5>
            <ul className="footer-links">
              {HELP_LINKS.map((l) => (
                <li key={l}><a href="#contacto" onClick={(e) => e.preventDefault()}>{l}</a></li>
              ))}
            </ul>
          </nav>

          {/* Contacto + newsletter */}
          <div>
            <h5>Contacto</h5>
            <ul className="footer-links" style={{ marginBottom: 16 }}>
              <li style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <MapPin size={15} style={{ marginTop: 2, flex: 'none' }} /> Av. Grau 258, Piso 1<br />Lima Centro
              </li>
              <li style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
                <Phone size={15} style={{ flex: 'none' }} /> <a href="tel:+5116348790">+51 1 634 8790</a>
              </li>
              <li style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
                <Mail size={15} style={{ flex: 'none' }} /> <a href="mailto:hola@clothescloset.pe">hola@clothescloset.pe</a>
              </li>
              <li style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <Clock size={15} style={{ marginTop: 2, flex: 'none' }} /> Lun–Sáb 10:00–20:00<br />Dom 11:00–18:00
              </li>
            </ul>

            <form className="newsletter-box" onSubmit={subscribe} noValidate>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#f2efe8', letterSpacing: '.06em' }}>
                CLOSET CLUB — 10% off en tu primera compra
              </p>
              {subscribed ? (
                <p style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, color: '#7dd3a8', fontSize: 13, fontWeight: 700 }}>
                  <CheckCircle2 size={18} /> ¡Bienvenido/a a Closet Club! Revisa tu correo.
                </p>
              ) : (
                <>
                  <div className="newsletter-row">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tucorreo@email.com"
                      aria-label="Correo para el newsletter"
                    />
                    <button type="submit" className="icon-btn" style={{ background: '#d9b365', color: '#191914', width: 46, height: 46, borderRadius: 12 }} aria-label="Suscribirme">
                      <Send size={18} strokeWidth={2.2} />
                    </button>
                  </div>
                  {error && <p style={{ color: '#ffb3ab', fontSize: 11, marginTop: 8, fontWeight: 600 }}>{error}</p>}
                </>
              )}
            </form>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="footer-bottom">
          <p>© 2026 Clothes Closet S.A.C. · Lima, Perú — Todos los derechos reservados.</p>
          <nav aria-label="Legal">
            <a href="#contacto" onClick={(e) => e.preventDefault()}>Términos</a>
            <a href="#contacto" onClick={(e) => e.preventDefault()}>Privacidad</a>
            <a href="#contacto" onClick={(e) => e.preventDefault()}>Libro de Reclamaciones</a>
          </nav>
          <p>Visa · Mastercard · Amex · Yape · Plin · Contraentrega</p>
        </div>
      </div>
      <div className="watermark" aria-hidden="true">CLOSET</div>
    </footer>
  )
}
