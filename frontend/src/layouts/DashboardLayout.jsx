import { Outlet, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Plus, ScanEye, LogOut, Bell } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import LoadingAnimation from '../components/LoadingAnimation'
import { useAuthStore } from '../store/authStore'

const getTitle = (path) => {
  if (path.startsWith('/dashboard')) return 'Dashboard'
  if (path.startsWith('/analyze'))   return 'New Analysis'
  if (path.startsWith('/history'))   return 'Case Library'
  if (path.startsWith('/results'))   return 'Assessment'
  if (path.startsWith('/report'))    return 'Verification Report'
  return 'Workspace'
}

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const user      = useAuthStore((s) => s.user)
  const authReady = useAuthStore((s) => s.status === 'ready')
  const logout    = useAuthStore((s) => s.logout)
  const navigate  = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!authReady) return <LoadingAnimation label="Loading workspace" hint="" />
  if (!user)       return <Navigate to="/login" replace state={{ from: pathname }} />

  return (
    <div className="workspace">
      <Sidebar />

      <div className="workspace-main">
        <header className="workspace-top">
          {/* Mobile brand */}
          <Link to="/" className="workspace-mobile-brand brand">
            <span className="brand-mark" style={{ width: 26, height: 26 }}>
              <ScanEye size={14} />
            </span>
            <span className="brand-name" style={{ fontSize: 15 }}>
              Truth<span>Lens</span>
            </span>
          </Link>

          {/* Page title (hidden on mobile) */}
          <span style={{
            color: 'var(--muted)', fontSize: 13, fontWeight: 600,
            letterSpacing: '.04em', textTransform: 'uppercase',
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          }}>
            {getTitle(pathname)}
          </span>

          {/* Top bar actions */}
          <div className="workspace-top-actions">
            <Link to="/analyze" className="btn btn-sm" style={{ gap: 6 }}>
              <Plus size={14} /> New
            </Link>
            <button
              className="top-icon-btn"
              type="button"
              aria-label="Notifications"
            >
              <Bell size={15} />
            </button>
            <button
              className="top-icon-btn"
              type="button"
              onClick={handleLogout}
              aria-label="Sign out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </header>

        <main className="workspace-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}