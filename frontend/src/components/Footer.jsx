import { Link } from 'react-router-dom'
import { ScanEye, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="brand">
            <span className="brand-mark"><ScanEye size={17} /></span>
            <span className="brand-name">Truth<span>Lens</span></span>
          </div>
          <p>
            Forensic-grade AI media verification for journalists,
            investigators, and legal professionals.
          </p>
        </div>

        <div className="footer-links-col">
          <h4>Product</h4>
          <nav className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/register">Get started</Link>
            <Link to="/login">Sign in</Link>
          </nav>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} TruthLens. All rights reserved.</span>
        <a href="https://github.com" aria-label="GitHub" target="_blank" rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--muted)', fontSize: 12 }}>
          <ExternalLink size={13} /> Source
        </a>
      </div>
    </footer>
  )
}