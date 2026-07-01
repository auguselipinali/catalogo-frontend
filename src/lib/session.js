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
