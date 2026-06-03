import { Routes, Route, Link, useLocation } from 'react-router-dom'
import TestPage from './components/TestPage'
import ResultPage from './components/ResultPage'
import AdminPage from './components/AdminPage'

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        background: '#2c3e50', color: '#fff', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56,
      }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>
          エゴグラム診断
        </Link>
        <nav style={{ display: 'flex', gap: 16 }}>
          {!isAdmin ? (
            <Link to="/admin" style={{ color: '#bdc3c7', fontSize: 13 }}>管理画面</Link>
          ) : (
            <Link to="/" style={{ color: '#bdc3c7', fontSize: 13 }}>診断トップ</Link>
          )}
        </nav>
      </header>

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<TestPage />} />
          <Route path="/result/:id" element={<ResultPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      <footer style={{ textAlign: 'center', padding: '16px', fontSize: 12, color: '#95a5a6' }}>
        © 2024 エゴグラム採用診断システム
      </footer>
    </div>
  )
}
