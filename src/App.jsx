import { Routes, Route } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage'

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
      <Route path="/:slug" element={<CatalogPage />} />
    </Routes>
  )
}
