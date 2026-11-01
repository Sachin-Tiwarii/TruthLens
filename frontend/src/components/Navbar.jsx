import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ScanEye, ArrowRight, LogIn, Menu, X } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useEffect, useState } from 'react'
import './chrome.css'

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
    <header className="tl-header">
      <div className="tl-container tl-nav">
        <Link to="/" className="tl-brand" aria-label="TruthLens home">
          <span className="tl-brand-mark"><ScanEye size={18} aria-hidden="true" /></span>
          <span className="tl-brand-name">TruthLens</span>
        </Link>

        <nav className="tl-links" aria-label="Primary">
          <Link to="/" {...linkProps('/')}>Home</Link>
          <Link to="/about" {...linkProps('/about')}>About</Link>
        </nav>

        <div className="tl-actions">
          <button type="button" className="tl-demo" onClick={handleDemoLogin}>
            <LogIn size={14} aria-hidden="true" /> Try demo
          </button>
          <Link to="/login" className="tl-link">Sign in</Link>
          <Link to="/register" className="tl-btn">
            Get started <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <button
          className="tl-burger"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="tl-mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="tl-container">
          <nav id="tl-mobile-nav" className="tl-drawer" aria-label="Mobile">
            <Link to="/" {...linkProps('/')}>Home</Link>
            <Link to="/about" {...linkProps('/about')}>About</Link>
            <Link to="/login" className="tl-link">Sign in</Link>
            <button type="button" className="tl-link tl-drawer-demo" onClick={handleDemoLogin}>
              <LogIn size={15} aria-hidden="true" /> Continue as demo
            </button>
            <Link to="/register" className="tl-btn tl-btn-block">
              Get started <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}