import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ScanEye, Eye, EyeOff, Fingerprint, Layers3, FileCheck2 } from 'lucide-react'
import '../pages/pages.css'

const points = [
  { icon: Fingerprint, text: 'Every file is SHA-256 hashed on receipt.' },
  { icon: Layers3, text: 'Per-model scores with the evidence behind them.' },
  { icon: FileCheck2, text: 'Reports built for audit and review.' },
]

export function PasswordField({ id, label, value, onChange, autoComplete, placeholder, minLength }) {
  const [show, setShow] = useState(false)
  return (
    <div className="tl-field">
      <label htmlFor={id}>{label}</label>
      <div className="tl-input-wrap">
        <input
          id={id}
          className="tl-input"
          type={show ? 'text' : 'password'}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="tl-reveal"
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
          onClick={() => setShow((v) => !v)}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  )
}

export default function AuthLayout({ title, subtitle, children, switchText }) {
  return (
    <div className="tl-page tl-auth">
      <aside className="tl-auth-side" aria-hidden="false">
        <Link to="/" className="tl-auth-brand" aria-label="TruthLens home">
          <span className="tl-mark"><ScanEye size={18} aria-hidden="true" /></span>
          <span>TruthLens</span>
        </Link>

        <div className="tl-auth-pitch">
          <h2>Evidence you can stand behind.</h2>
          <ul>
            {points.map(({ icon: Icon, text }) => (
              <li key={text}>
                <Icon size={16} aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="tl-auth-main">
        <div className="tl-auth-card">
          <h1>{title}</h1>
          <p className="tl-auth-sub">{subtitle}</p>
          {children}
          {switchText && <p className="tl-auth-switch">{switchText}</p>}
        </div>
      </main>
    </div>
  )
}