import { NavLink, Link, useNavigate } from 'react-router-dom'
import { ScanEye, LayoutDashboard, ScanSearch, History, Home, Plus, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import '../pages/app.css'

const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Analyze', path: '/analyze', icon: ScanSearch },
  { name: 'History', path: '/history', icon: History },
]

export default function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const displayName = user?.name?.split('@')[0] || 'Demo user'
  const initials = user?.name ? user.name.replace('@', '').slice(0, 2).toUpperCase() : 'TL'

  return (
    <aside className="app-sidebar">
      <Link to="/" className="app-brand" aria-label="TruthLens home">
        <span className="app-mark"><ScanEye size={18} aria-hidden="true" /></span>
        <span className="app-brand-name">TruthLens</span>
      </Link>

      <Link to="/analyze" className="app-btn app-new">
        <Plus size={15} aria-hidden="true" /> New analysis
      </Link>

      <nav className="app-nav" aria-label="Workspace">
        {navLinks.map(({ name, path, icon: Icon }) => (
          <NavLink key={path} to={path} className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}>
            <Icon size={17} aria-hidden="true" />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="app-side-bottom">
        <Link to="/" className="app-nav-link">
          <Home size={17} aria-hidden="true" /> <span>Home</span>
        </Link>
        <div className="app-user">
          <div className="app-avatar" aria-hidden="true">{initials}</div>
          <div className="app-user-info">
            <strong>{displayName}</strong>
            <span>{user?.email || 'demo@truthlens.ai'}</span>
          </div>
          <button type="button" className="app-signout" aria-label="Sign out" title="Sign out" onClick={handleLogout}>
            <LogOut size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  )
}