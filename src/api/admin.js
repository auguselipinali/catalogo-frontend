import { getProducts } from './catalog'

// PROVISIONAL: el panel lista con el endpoint público GET /{slug}/products
// porque el backend aún no expone un GET protegido (AdminController solo
// tiene POST/PUT/DELETE). Si el panel necesita datos que el público no ve
// (productos ocultos, stock, etc.), agregar GET /admin/products con JWT
// en el backend y reemplazar esta llamada.
//
// Este módulo es la costura del panel: cuando exista el endpoint protegido,
// solo cambia acá y los componentes no se tocan.
export function getAdminProducts(slug) {
  return getProducts(slug)
}
