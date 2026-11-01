import { Outlet, Navigate, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useAuthStore } from '../store/authStore'

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const user = useAuthStore((s) => s.user)
  const authReady = useAuthStore((s) => s.status === 'ready')

  if (!authReady) return null

  if (!user) {
    return <Navigate to="/login" replace state={{ from: pathname }} />
  }

  // .app-shell carries the workspace tokens, fonts and reset defined in pages/app.css.
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <div className="app-main-inner">
          <Outlet />
        </div>
      </main>
    </div>
  )
}