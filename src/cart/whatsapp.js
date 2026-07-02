import { formatPrice } from '../lib/format'

// Arma el texto del pedido a partir de las líneas reconciliadas del carrito.
export function buildOrderMessage(detailedItems, total) {
  const lines = detailedItems.map(
    (item) => `- ${item.qty}x ${item.name} - ${formatPrice(item.subtotal)}`,
  )

  return (
    '¡Hola! Quiero hacer un pedido:\n' +
    lines.join('\n') +
    `\n\nTotal: ${formatPrice(total)}`
  )
}

// Link de WhatsApp con el mensaje url-encoded.
export function buildWhatsappUrl(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
