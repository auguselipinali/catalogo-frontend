import { getProducts } from './catalog'
import { getToken } from '../lib/session'

const API_URL = import.meta.env.VITE_API_URL

// Error tipado para sesión expirada/inválida (401 en un endpoint protegido).
// Los componentes lo capturan para limpiar el token y volver al login.
export class SessionExpiredError extends Error {
  constructor() {
    super('La sesión expiró.')
    this.name = 'SessionExpiredError'
  }
}

// fetch con Authorization: Bearer para endpoints del panel.
// Lanza SessionExpiredError ante 401; el resto de errores lo maneja quien llama.
async function authFetch(path, options = {}) {
  if (!API_URL) {
    throw new Error('Falta configurar VITE_API_URL.')
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getToken()}`,
    },
  })

  if (response.status === 401) {
    throw new SessionExpiredError()
  }

  return response
}

// PROVISIONAL: el panel lista con el endpoint público GET /{slug}/products
// porque el backend aún no expone un GET protegido para admin. Si el panel
// necesita datos que el público no ve (productos ocultos, stock, etc.),
// agregar GET /admin/products con JWT y reemplazar esta llamada.
export function getAdminProducts(slug) {
  return getProducts(slug)
}

// Crea un producto. Devuelve { id }.
export async function createProduct(product) {
  const response = await authFetch('/admin/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error(`Error al crear el producto (${response.status}).`)
  }

  return response.json()
}

// Actualiza un producto por id (204).
export async function updateProduct(id, product) {
  const response = await authFetch(`/admin/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error(`Error al guardar el producto (${response.status}).`)
  }
}

// Borra un producto por id (204).
export async function deleteProduct(id) {
  const response = await authFetch(`/admin/products/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Error al borrar el producto (${response.status}).`)
  }
}
