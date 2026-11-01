import { Link, useNavigate } from 'react-router-dom'
import { ScanEye, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { getErrorMessage } from '../services/api'
import { useState } from 'react'

export default function Register() {
  const [name,       setName]       = useState('')
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [error,      setError]      = useState('')
  const [submitting, setSubmitting] = useState(false)
  const register = useAuthStore((s) => s.register)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register({ name, email, password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to create your account. Please try again.'))
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">

        <Link to="/" className="brand auth-brand">
          <span className="brand-mark"><ScanEye size={17} /></span>
          <span className="brand-name">Truth<span>Lens</span></span>
        </Link>

        <h1 className="heading-md">Create account</h1>
        <p className="auth-subtitle">Start verifying media with forensic precision.</p>

        <form onSubmit={submit}>
          <div className="form-field">
            <label htmlFor="reg-name">Full name</label>
            <input
              id="reg-name"
              className="input"
              required
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
              className="input"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              className="input"
              type="password"
              required
              minLength="4"
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="analyze-error" role="alert" style={{ marginBottom: 16 }}>
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <button className="btn auth-submit" type="submit" disabled={submitting}>
            {submitting ? 'Creating account…' : <><ShieldCheck size={15} /> Create account</>}
          </button>
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
