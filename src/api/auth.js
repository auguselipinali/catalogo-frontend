const API_URL = import.meta.env.VITE_API_URL

// Error tipado para el caso "credenciales incorrectas" (401), como en catalog.js.
export class InvalidCredentialsError extends Error {
  constructor() {
    super('Credenciales incorrectas.')
    this.name = 'InvalidCredentialsError'
  }
}

// Inicia sesión contra la API. Devuelve el JWT (campo "token" de la respuesta).
export async function login(email, password) {
  if (!API_URL) {
    throw new Error('Falta configurar VITE_API_URL.')
  }

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (response.status === 401) {
    throw new InvalidCredentialsError()
  }

  if (!response.ok) {
    throw new Error(`Error al iniciar sesión (${response.status}).`)
  }

  const data = await response.json()
  return data.token
}
