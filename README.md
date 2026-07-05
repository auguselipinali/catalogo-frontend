# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Variables de entorno (producción)

Las variables se configuran en el hosting (**Render**), no se versionan. Para el
frontend hay un `.env.example` como plantilla.

**Frontend (build de Vite):**

| Variable | Uso |
| --- | --- |
| `VITE_API_URL` | URL base de la API (sin slash final). |
| `VITE_WHATSAPP_NUMERO` | Número de WhatsApp del comercio para los pedidos del carrito. Formato internacional, solo dígitos (sin `+`, espacios ni guiones). |

> ⚠️ **Vite inlinea las variables `VITE_*` en build-time**, no en runtime: quedan
> horneadas en el bundle al compilar. Si cambiás una en Render **hay que
> rebuildear/redeployar** — un restart no alcanza. Si `VITE_WHATSAPP_NUMERO`
> queda vacía en el build, el link de pedido sale como `wa.me/?text=` (sin
> número). Verificá que tenga valor antes de rebuildear.

**Backend (.NET):**

| Variable | Uso |
| --- | --- |
| `ConnectionStrings__DefaultConnection` | Cadena de conexión a la base de datos. |
| `Jwt__SecretKey` | Clave para firmar/validar los JWT. |
| `SEED_ADMIN_PASSWORD` | Contraseña del admin inicial (seed). |
| `Cors__AllowedOrigins__0` | Origin permitido por CORS (dominio del frontend). |

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
