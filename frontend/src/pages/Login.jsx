import { Link, useNavigate } from 'react-router-dom'
import { ScanEye, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { getErrorMessage } from '../services/api'
import { useState } from 'react'

export default function Login() {
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [error,      setError]      = useState('')
  const [submitting, setSubmitting] = useState(false)
  const login      = useAuthStore((s) => s.login)
  const loginDemo  = useAuthStore((s) => s.loginDemo)
  const navigate   = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid credentials. Please try again.'))
      setSubmitting(false)
    }
  }

  const demoLogin = async () => {
    setError('')
    setSubmitting(true)
    try {
      await loginDemo()
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Demo login failed. Please try again.'))
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

        <h1 className="heading-md">Sign in</h1>
        <p className="auth-subtitle">Access your verification workspace.</p>

        <form onSubmit={submit}>
          <div className="form-field">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
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
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="input"
              type="password"
              required
              minLength="4"
              autoComplete="current-password"
              placeholder="Your password"
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
            {submitting ? 'Signing in…' : <><ArrowRight size={15} /> Sign in</>}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button
          className="btn btn-ghost auth-submit"
          type="button"
          onClick={demoLogin}
          disabled={submitting}
        >
          <ShieldCheck size={15} /> Continue as demo user
        </button>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>

        <div className="auth-note">
          Demo mode — authentication is local-only until a backend is connected.
        </div>
      </div>
    </div>
  )
}
