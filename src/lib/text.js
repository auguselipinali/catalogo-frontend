// Normaliza texto para comparaciones tolerantes: separa los diacríticos
// (NFD), los quita, pasa a minúsculas y recorta. Así "argan" encuentra "Argán".
export function normalize(text) {
  return (text ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}
