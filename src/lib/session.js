const TOKEN_KEY = 'catalogo.token'

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// Decodifica el payload del JWT (segundo segmento). Devuelve null si no se puede.
function decodePayload(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

// Devuelve un email/nombre para saludar, si el JWT trae algún claim usable.
// El token actual no incluye email, así que normalmente devuelve null.
export function getUserEmail() {
  const token = getToken()
  if (!token) return null

  const claims = decodePayload(token)
  if (!claims) return null

  return claims.email ?? claims.name ?? claims.unique_name ?? null
}

// Slug del comercio logueado, tomado del claim tenant_slug del JWT.
export function getTenantSlug() {
  const token = getToken()
  if (!token) return null

  const claims = decodePayload(token)
  return claims?.tenant_slug ?? null
}

// True si no hay token, no se puede decodificar, o el claim exp ya venció.
// Reemplazo client-side del 401 (el endpoint público que usa el panel no lo da).
export function isTokenExpired() {
  const token = getToken()
  if (!token) return true

  const claims = decodePayload(token)
  if (!claims || typeof claims.exp !== 'number') return true

  return claims.exp <= Date.now() / 1000
}
