const priceFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
})

// Formatea un número como precio en pesos argentinos (ej: 1500 -> "$ 1.500,00").
export function formatPrice(value) {
  return priceFormatter.format(value)
}
