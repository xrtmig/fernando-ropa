import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X,
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  Lock,
  CheckCircle2,
  BadgePercent,
  Truck,
} from 'lucide-react'
import { FREE_SHIPPING_FROM, SHIPPING_COST } from '../data/products'
import { formatPrice } from '../lib/utils'

export default function CartDrawer({
  onClose,
  lines,
  subtotal,
  discount,
  total,
  promoInput,
  promoApplied,
  promoError,
  onPromoInputChange,
  onApplyPromo,
  onRemovePromo,
  onUpdateQty,
  onRemoveLine,
  onOrderPlaced,
  onExplore,
}) {
  const [placedOrder, setPlacedOrder] = useState(null)

  const freeShipping = subtotal - discount >= FREE_SHIPPING_FROM
  const shipping = lines.length === 0 ? 0 : freeShipping ? 0 : SHIPPING_COST
  const grandTotal = subtotal - discount + shipping
  const remaining = Math.max(0, FREE_SHIPPING_FROM - (subtotal - discount))
  const progress = Math.min(100, ((subtotal - discount) / FREE_SHIPPING_FROM) * 100)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && handleClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClose = () => {
    setPlacedOrder(null)
    onClose()
  }

  const checkout = () => {
    const num = `CC-${String(Date.now()).slice(-6)}`
    setPlacedOrder(num)
    onOrderPlaced() // vacía carrito y cupón en el estado global
  }

  const itemCount = lines.reduce((acc, l) => acc + l.qty, 0)

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="overlay"
        style={{ justifyContent: 'flex-end', padding: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        aria-hidden="true"
      />
      {/* Panel lateral */}
      <motion.aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        initial={{ x: '104%' }}
        animate={{ x: 0 }}
        exit={{ x: '104%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 34 }}
      >
        {/* ── Estado: pedido confirmado ─────────────────── */}
        {placedOrder ? (
          <div className="drawer-body" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="order-success" style={{ width: '100%' }}>
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              >
                <CheckCircle2 size={84} strokeWidth={1.4} color="#1e7a46" />
              </motion.div>
              <h3 className="serif" style={{ fontSize: 27, fontWeight: 600 }}>¡Gracias por tu compra!</h3>
              <p style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>
                Tu pedido <strong style={{ color: 'var(--ink)' }}>{placedOrder}</strong> fue confirmado.
                Te enviamos el detalle al correo registrado y lo despachamos en las próximas 24/48h.
              </p>
              <div
                style={{
                  background: 'var(--panel)', borderRadius: 14, padding: '12px 18px',
                  fontSize: 11.5, color: 'var(--ink-soft)', letterSpacing: '.04em',
                }}
              >
                Recojo en flagship Lima Centro disponible desde mañana.<br />
                Presenta tu número de pedido y DNI.
              </div>
              <button className="btn btn-dark" onClick={handleClose} style={{ marginTop: 6 }}>
                Seguir comprando
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ── Encabezado ─────────────────────────────── */}
            <div className="drawer-head">
              <h3>Tu carrito {itemCount > 0 && <span style={{ color: 'var(--ink-faint)' }}>· {itemCount}</span>}</h3>
              <button className="icon-btn" onClick={handleClose} aria-label="Cerrar carrito">
                <X size={22} strokeWidth={1.8} />
              </button>
            </div>

            {/* ── Barra de progreso de envío gratis ─────── */}
            <div className="ship-progress">
              <p>
                {freeShipping ? (
                  <><b>Envío gratis desbloqueado.</b> Llega en 24/48h a todo Lima.</>
                ) : (
                  <>Te faltan <b>{formatPrice(remaining)}</b> para <b>envío gratis</b></>
                )}
              </p>
              <div className="ship-bar" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
                <motion.div
                  className="ship-bar-fill"
                  animate={{ width: `${progress}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                />
              </div>
            </div>

            {/* ── Líneas del carrito ─────────────────────── */}
            <div className="drawer-body">
              {lines.length === 0 ? (
                <div className="cart-empty">
                  <ShoppingBag size={64} strokeWidth={1} color="var(--ink-faint)" style={{ margin: '0 auto 14px' }} />
                  <h4 className="serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--ink)' }}>
                    Tu carrito está vacío
                  </h4>
                  <p style={{ fontSize: 13, margin: '6px 0 18px' }}>
                    Las mejores prendas de la colección se están yendo. Dale un vistazo al perchero.
                  </p>
                  <button className="btn btn-dark" onClick={onExplore}>Descubrir la colección</button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {lines.map(({ key, product, color, size, qty }) => (
                    <motion.div
                      key={key}
                      layout
                      className="cart-line"
                      initial={{ opacity: 0, x: 48 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -64, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                    >
                      <img src={product.img} alt={product.name} />
                      <div>
                        <p className="cart-line-name">{product.name}</p>
                        <p className="cart-line-meta">{color} · Talla {size}</p>
                        <div className="qty" aria-label="Cantidad">
                          <button onClick={() => onUpdateQty(key, -1)} aria-label="Reducir cantidad">
                            <Minus size={13} strokeWidth={2.4} />
                          </button>
                          <span>{qty}</span>
                          <button onClick={() => onUpdateQty(key, +1)} aria-label="Aumentar cantidad">
                            <Plus size={13} strokeWidth={2.4} />
                          </button>
                        </div>
                      </div>
                      <div className="cart-line-right">
                        <p className="cart-line-price">{formatPrice(product.price * qty)}</p>
                        <button className="cart-line-remove" onClick={() => onRemoveLine(key)} aria-label={`Eliminar ${product.name}`}>
                          <Trash2 size={17} strokeWidth={1.8} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {lines.length > 0 && (
              <>
                {/* ── Cupón ─────────────────────────────── */}
                {promoApplied ? (
                  <div className="promo-ok">
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <BadgePercent size={17} strokeWidth={2.2} /> Cupón {promoApplied} aplicado (−10%)
                    </span>
                    <button onClick={onRemovePromo} style={{ fontWeight: 800, color: 'var(--ok)', textDecoration: 'underline' }}>
                      Quitar
                    </button>
                  </div>
                ) : (
                  <form className="promo-row" onSubmit={(e) => { e.preventDefault(); onApplyPromo() }}>
                    <input
                      value={promoInput}
                      onChange={(e) => onPromoInputChange(e.target.value)}
                      placeholder="CÓDIGO DE CUPÓN"
                      aria-label="Código de cupón"
                    />
                    <button type="submit" className="btn btn-outline" style={{ padding: '0 18px' }}>
                      Aplicar
                    </button>
                  </form>
                )}
                {promoError && (
                  <p style={{ color: 'var(--danger)', fontSize: 11.5, padding: '6px 22px 0', fontWeight: 600 }}>{promoError}</p>
                )}

                {/* ── Totales + CTA ─────────────────────── */}
                <div className="drawer-foot">
                  <div className="totals-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  {discount > 0 && (
                    <div className="totals-row"><span>Descuento cupón</span><span style={{ color: 'var(--ok)' }}>−{formatPrice(discount)}</span></div>
                  )}
                  <div className="totals-row">
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Truck size={14} /> Envío</span>
                    <span className={freeShipping ? 'free' : ''}>{freeShipping ? 'GRATIS' : formatPrice(SHIPPING_COST)}</span>
                  </div>
                  <div className="totals-row grand"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
                  <button className="btn btn-dark" onClick={checkout} style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
                    <Lock size={15} strokeWidth={2.2} /> Finalizar compra · {formatPrice(grandTotal)}
                  </button>
                  <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--ink-faint)', marginTop: 9, letterSpacing: '.06em' }}>
                    Pago seguro SSL · Visa, Mastercard, Amex, Yape, Plin y contraentrega
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </motion.aside>
    </>
  )
}
