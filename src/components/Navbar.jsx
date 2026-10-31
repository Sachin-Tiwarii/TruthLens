import { Link, useNavigate } from 'react-router-dom'
import { ScanEye, ArrowUpRight, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleDemoLogin = () => {
    login('demo@truthlens.ai')
    navigate('/dashboard')
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

          <Link to="/login" className="nav-login">
            Sign in
          </Link>

          <button
            type="button"
            className="nav-demo-btn"
            onClick={handleDemoLogin}
          >
            <LogIn size={15} />
            Demo User
          </button>

          <Link to="/register" className="btn">
            Get started
            <ArrowUpRight size={15} />
          </Link>

        </div>

      </div>
    </header>
  )
}