import { NavLink, Link, useNavigate } from 'react-router-dom'
import { ScanEye, LayoutDashboard, ScanSearch, History, Home, Plus, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Analyze',   path: '/analyze',   icon: ScanSearch },
  { name: 'History',   path: '/history',   icon: History },
]

export default function Sidebar() {
  const user     = useAuthStore((s) => s.user)
  const logout   = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.replace('@', '').slice(0, 2).toUpperCase()
    : 'TL'

  return (
    <aside className="sidebar">
      {/* Brand */}
      <Link to="/" className="sidebar-brand">
        <span className="brand-mark"><ScanEye size={17} /></span>
        <span className="brand-name" style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.02em', color: 'var(--ink)' }}>
          Truth<span style={{ color: 'var(--accent)', fontWeight: 400 }}>Lens</span>
        </span>
      </Link>

      {/* New analysis CTA */}
      <Link to="/analyze" className="btn btn-sm" style={{ marginBottom: 20, width: '100%', justifyContent: 'flex-start', gap: 8 }}>
        <Plus size={15} /> New analysis
      </Link>

      {/* Navigation */}
      <div className="sidebar-section-label">Workspace</div>
      <nav aria-label="Workspace navigation">
        {navLinks.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <Icon size={17} />
            {name}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <Link to="/" className="sidebar-link">
          <Home size={17} /> Home
        </Link>
        <div className="sidebar-user" style={{ marginTop: 8 }}>
          <div className="sidebar-user-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <strong>{user?.name?.split('@')[0] || 'Demo user'}</strong>
            <span>{user?.email || 'demo@truthlens.ai'}</span>
          </div>
          <button
            type="button"
            aria-label="Sign out"
            onClick={handleLogout}
            style={{
              width: 28, height: 28, display: 'grid', placeItems: 'center',
              borderRadius: 'var(--radius-sm)', color: 'var(--muted)',
              transition: 'all var(--t-fast)', flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bad-soft)'; e.currentTarget.style.color = 'var(--bad)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}