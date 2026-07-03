import { Routes, Route } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage'
import LoginPage from './pages/admin/LoginPage'
import AdminPage from './pages/admin/AdminPage'
import NewProductPage from './pages/admin/NewProductPage'
import EditProductPage from './pages/admin/EditProductPage'
import CategoriesPage from './pages/admin/CategoriesPage'
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
      <Route
        path="/admin/productos/:id/editar"
        element={
          <RequireAuth>
            <EditProductPage />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/categorias"
        element={
          <RequireAuth>
            <CategoriesPage />
          </RequireAuth>
        }
      />
      <Route path="/:slug" element={<CatalogPage />} />
    </Routes>
  )
}
