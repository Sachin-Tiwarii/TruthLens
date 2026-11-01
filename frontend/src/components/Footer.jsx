import { NavLink, Link, useNavigate } from 'react-router-dom'
import { ScanEye, LayoutDashboard, ScanSearch, History, Home, Plus, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const links = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Analyze', path: '/analyze', icon: ScanSearch },
  { name: 'History', path: '/history', icon: History },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="app-sidebar">
      <Link to="/" className="brand sidebar-brand">
        <span className="brand-mark"><ScanEye size={20} /></span>
        <span className="brand-name">truth<span>lens</span></span>
      </Link>

      <Link to="/analyze" className="btn sidebar-new-analysis">
        <Plus size={17} /> New analysis
      </Link>

      <nav className="sidebar-navigation" aria-label="Workspace">
        <div className="sidebar-group">
          <span className="sidebar-label">Menu</span>
          {links.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              {name}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="sidebar-bottom">
        <Link to="/" className="sidebar-link">
          <Home size={18} /> Home
        </Link>

        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="sidebar-user-info">
            <strong>{user?.name || 'Demo user'}</strong>
            <small>{user?.email || 'demo@truthlens.ai'}</small>
          </div>
          <button className="icon-btn" type="button" onClick={handleLogout} aria-label="Sign out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}