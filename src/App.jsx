import { Routes, Route } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage'
import LoginPage from './pages/admin/LoginPage'
import AdminPage from './pages/admin/AdminPage'
import NewProductPage from './pages/admin/NewProductPage'
import RequireAuth from './pages/admin/RequireAuth'

function Home() {
  return (
    <main className="home">
      <p>
        Indicá un comercio en la URL, por ejemplo <code>/lore</code>.
      </p>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <AdminPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/productos/nuevo"
        element={
          <RequireAuth>
            <NewProductPage />
          </RequireAuth>
        }
      />
      <Route path="/:slug" element={<CatalogPage />} />
    </Routes>
  )
}
