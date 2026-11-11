// Utilidades compartidas: formato de precio, hash y stock por tienda.

export const formatPrice = (n) =>
  `S/. ${Number(n).toFixed(2)}`

export function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export const STORES = [
  { id: 'flagship', name: 'Flagship Centro', detail: 'Av. Grau 258 · Piso 1' },
  { id: 'jockey', name: 'Jockey Plaza', detail: 'Local 2034 · Surco' },
  { id: 'realplaza', name: 'Real Plaza Salaverry', detail: 'Av. Gral. Salaverry 2370' },
]

// Disponibilidad determinista por producto + talla + tienda.
export function availabilityFor(productId, size) {
  return STORES.map((store) => {
    const h = hashString(`${productId}|${size}|${store.id}`)
    const bucket = h % 10
    if (bucket < 5) return { ...store, status: 'stock', units: (h % 14) + 6 }
    if (bucket < 8) return { ...store, status: 'low', units: (h % 3) + 1 }
    return { ...store, status: 'out', units: 0 }
  })
}
