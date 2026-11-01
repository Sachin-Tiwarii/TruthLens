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

  return (
    <div className="workspace">
      <Sidebar />
      <div className="workspace-main">
        <main className="workspace-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}