import { Link, useNavigate } from 'react-router-dom'
import { ScanEye, ArrowUpRight, LogIn } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const loginDemo = useAuthStore((s) => s.loginDemo)
  const navigate = useNavigate()
  const [demoLoading, setDemoLoading] = useState(false)

  const handleDemoLogin = async () => {
    if (user) {
      navigate('/dashboard')
      return
    }
    setDemoLoading(true)
    try {
      await loginDemo()
      navigate('/dashboard')
    } catch {
      // Send them to the sign-in page, which shows the error and lets them retry.
      navigate('/login')
    } finally {
      setDemoLoading(false)
    }
  }

  return (
    <header className="site-header">
      <div className="container nav-inner">

        {/* Brand */}
        <Link to="/" className="brand">
          <span className="brand-mark">
            <ScanEye size={20} />
          </span>

          <span className="brand-name">
            Truth<span>Lens</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>

        {/* Actions */}
        <div className="nav-actions">

          {user ? (
            <Link to="/dashboard" className="btn">
              Dashboard
              <ArrowUpRight size={15} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="nav-login">
                Sign in
              </Link>

              <button
                type="button"
                className="nav-demo-btn"
                onClick={handleDemoLogin}
                disabled={demoLoading}
              >
                <LogIn size={15} />
                {demoLoading ? 'Signing in…' : 'Demo User'}
              </button>

              <Link to="/register" className="btn">
                Get started
                <ArrowUpRight size={15} />
              </Link>
            </>
          )}

        </div>

      </div>
    </header>
  )
}