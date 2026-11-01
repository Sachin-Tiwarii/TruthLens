import { Outlet, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Plus, ScanEye, LogOut } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import LoadingAnimation from '../components/LoadingAnimation'
import { useAuthStore } from '../store/authStore'

const getTitle = (path) => {
  if (path.startsWith('/dashboard')) return 'Dashboard'
  if (path.startsWith('/analyze')) return 'Analyze media'
  if (path.startsWith('/history')) return 'History'
  if (path.startsWith('/results')) return 'Result'
  if (path.startsWith('/report')) return 'Report'
  return 'Workspace'
}

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const user = useAuthStore((s) => s.user)
  const authReady = useAuthStore((s) => s.status === 'ready')
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!authReady) return <LoadingAnimation label="Loading your workspace" hint="" />
  if (!user) return <Navigate to="/login" replace state={{ from: pathname }} />

  return (
    <div className="workspace">
      <Sidebar />

      <div className="workspace-main">
        <header className="workspace-top">
          <Link to="/" className="workspace-mobile-brand">
            <ScanEye size={19} /> TruthLens
          </Link>

          <span className="workspace-page-title">{getTitle(pathname)}</span>

          <div className="workspace-actions">
            <Link to="/analyze" className="btn btn-small">
              <Plus size={15} /> New
            </Link>
            <button className="icon-btn" type="button" onClick={handleLogout} aria-label="Sign out">
              <LogOut size={17} />
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