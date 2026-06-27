# Changelog

## 2026-06-23 — Catálogo público (primera versión)

Frontend React + Vite que consume la API multi-tenant. Página de catálogo por slug
(/{slug}), grilla de cards mobile-first con nombre, precio (Intl es-AR/ARS),
descripción e imagen con placeholder. Estados de carga, error, tenant inexistente
(404) y catálogo vacío. Llamada a la API aislada en src/api/catalog.js, URL base
en VITE_API_URL. Verificado de punta a punta contra el backend: /lore muestra los
productos de Lore correctamente.
