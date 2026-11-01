import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useEffect, useState } from 'react'
import BrandMark from './BrandMark'
import './chrome.css'

const primaryLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const loginDemo = useAuthStore((s) => s.loginDemo)
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDemoLogin = async () => {
    try {
      await loginDemo()
    } catch {
      /* demo fallback: continue to the dashboard anyway */
    }
    setMobileOpen(false)
    navigate('/dashboard')
  }

  const isActive = (path) => location.pathname === path
  const linkProps = (path) => ({
    className: `tl-link${isActive(path) ? ' is-active' : ''}`,
    'aria-current': isActive(path) ? 'page' : undefined,
  })

  // Close the drawer on route change and on Escape
  useEffect(() => { setMobileOpen(false) }, [location.pathname])
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e) => e.key === 'Escape' && setMobileOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  return (
    <header className={`tl-header${mobileOpen ? ' is-open' : ''}`}>
      <div className="tl-container tl-nav">
        <Link to="/" className="tl-brand" aria-label="TruthLens home">
          <BrandMark className="tl-brand-mark" />
          <span className="tl-brand-name">TruthLens</span>
        </Link>

        <nav className="tl-links" aria-label="Primary">
          {primaryLinks.map(({ to, label }) => (
            <Link key={to} to={to} {...linkProps(to)}>{label}</Link>
          ))}
        </nav>

        <div className="tl-actions">
          <button type="button" className="tl-link" onClick={handleDemoLogin}>Try the demo</button>
          <Link to="/login" {...linkProps('/login')}>Sign in</Link>
          <span className="tl-divider" aria-hidden="true" />
          <Link to="/register" className="tl-btn">Get started</Link>
        </div>

        <button
          className="tl-burger"
          type="button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="tl-mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="tl-container">
          <nav id="tl-mobile-nav" className="tl-drawer" aria-label="Mobile">
            {primaryLinks.map(({ to, label }) => (
              <Link key={to} to={to} {...linkProps(to)}>{label}</Link>
            ))}
            <div className="tl-drawer-actions">
              <Link to="/register" className="tl-btn">Get started</Link>
              <Link to="/login" className="tl-btn tl-btn-ghost">Sign in</Link>
              <button type="button" className="tl-drawer-demo" onClick={handleDemoLogin}>
                Or try the demo without an account
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
