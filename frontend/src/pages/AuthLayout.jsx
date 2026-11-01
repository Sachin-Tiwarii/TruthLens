import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import ForensicSpecimen from './ForensicSpecimen.jsx'
import './pages.css'

// Matches the 900px breakpoint where pages.css hides the side panel, so the
// WebGL scene only runs while it is actually on screen.
const WIDE_QUERY = '(min-width: 901px)'

function useIsWide() {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE_QUERY).matches)
  useEffect(() => {
    const mq = window.matchMedia(WIDE_QUERY)
    const onChange = (e) => setWide(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return wide
}

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
  const wide = useIsWide()

  return (
    <div className="tl-page tl-auth">
      <aside className="tl-auth-side">
        <div className="tl-auth-pitch">
          <h2>Evidence you can stand behind.</h2>
          <p>Upload an image, audio clip, or video. You get a verdict, a confidence score, and the evidence behind it.</p>
        </div>

        <div className="tl-auth-stage">
          <div className="tl-auth-stage-glow" />
          {wide && <ForensicSpecimen />}
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