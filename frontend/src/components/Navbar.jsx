import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ScanEye, ArrowRight, LogIn, Menu, X } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useState } from 'react'

export default function Navbar() {
  const loginDemo = useAuthStore((s) => s.loginDemo)
  const navigate  = useNavigate()
  const location  = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDemoLogin = async () => {
    try {
      await loginDemo()
      navigate('/dashboard')
    } catch {
      navigate('/dashboard') // fallback for demo
    }
    setMobileOpen(false)
  }

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <header className="site-header">
      <div className="container nav-inner">

        {/* Brand */}
        <Link to="/" className="brand">
          <span className="brand-mark"><ScanEye size={17} /></span>
          <span className="brand-name">Truth<span>Lens</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-links">
          <Link to="/"      className={isActive('/')}>Home</Link>
          <Link to="/about" className={isActive('/about')}>About</Link>
        </nav>

        {/* Desktop actions */}
        <div className="nav-actions">
          <button type="button" className="nav-demo-btn" onClick={handleDemoLogin}>
            <LogIn size={14} /> Demo
          </button>
          <Link to="/login"    className="nav-login">Sign in</Link>
          <Link to="/register" className="btn btn-sm">
            Get started <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="mobile-menu"
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="container">
          <nav className="mobile-nav">
            <Link to="/"         onClick={() => setMobileOpen(false)} className={isActive('/')}>Home</Link>
            <Link to="/about"    onClick={() => setMobileOpen(false)} className={isActive('/about')}>About</Link>
            <Link to="/login"    onClick={() => setMobileOpen(false)}>Sign in</Link>
            <Link to="/register" onClick={() => setMobileOpen(false)}>Get started</Link>
            <button type="button" onClick={handleDemoLogin}>
              <LogIn size={15} style={{ marginRight: 6 }} /> Continue as demo
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}