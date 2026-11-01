import { Link } from 'react-router-dom'
import { ScanEye, ExternalLink } from 'lucide-react'
import './chrome.css'

export default function Footer() {
  return (
    <footer className="tl-footer">
      <div className="tl-container tl-footer-grid">
        <div className="tl-footer-brand">
          <Link to="/" className="tl-brand" aria-label="TruthLens home">
            <span className="tl-brand-mark"><ScanEye size={18} aria-hidden="true" /></span>
            <span className="tl-brand-name">TruthLens</span>
          </Link>
          <p>
            Forensic-grade media verification for journalists, investigators, and legal
            professionals. Every verdict comes with the evidence behind it.
          </p>
        </div>

        <nav className="tl-footer-col" aria-label="Explore">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>

        <nav className="tl-footer-col" aria-label="Account">
          <h4>Account</h4>
          <Link to="/register">Get started</Link>
          <Link to="/login">Sign in</Link>
        </nav>
      </div>

      <div className="tl-container tl-footer-bottom">
        <span>© {new Date().getFullYear()} TruthLens. All rights reserved.</span>
        <a
          href="https://github.com/Sachin-Tiwarii/TruthLens"
          target="_blank"
          rel="noreferrer"
          aria-label="TruthLens source code on GitHub"
        >
          <ExternalLink size={13} aria-hidden="true" /> Source code
        </a>
      </div>
    </footer>
  )
}