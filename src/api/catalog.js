const API_URL = import.meta.env.VITE_API_URL

// Error tipado para distinguir el caso "tenant inexistente" (404) del resto.
export class TenantNotFoundError extends Error {
  constructor(slug) {
    super(`No existe el comercio "${slug}".`)
    this.name = 'TenantNotFoundError'
    this.slug = slug
  }
}

// Trae los productos públicos de un comercio dado su slug.
// Devuelve un array de productos: { id, name, price, description, imageUrl }.
export async function getProducts(slug) {
  if (!API_URL) {
    throw new Error('Falta configurar VITE_API_URL.')
  }

  const response = await fetch(`${API_URL}/${slug}/products`)

  if (response.status === 404) {
    throw new TenantNotFoundError(slug)
  }

  if (!response.ok) {
    throw new Error(`Error al cargar el catálogo (${response.status}).`)
  }

  return response.json()
}
