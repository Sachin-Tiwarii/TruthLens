import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ScanEye, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { getErrorMessage } from '../services/api'
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const login = useAuthStore((s) => s.login)
  const loginDemo = useAuthStore((s) => s.loginDemo)
  const navigate = useNavigate()
  const location = useLocation()
  const destination = location.state?.from || '/dashboard'

  const run = async (action) => {
    setError('')
    setSubmitting(true)
    try {
      await action()
      navigate(destination, { replace: true })
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to sign in. Please try again.'))
      setSubmitting(false)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    run(() => login(email, password))
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <Link to="/" className="brand auth-brand">
          <span className="brand-mark"><ScanEye /></span>
          <span className="brand-name">truth<span>lens</span></span>
        </Link>

        <h1 className="heading-md">Sign in</h1>

        <form onSubmit={submit}>
          <div className="form-field">
            <label htmlFor="login-email">Email</label>
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
            <div className="analyze-error auth-error" role="alert">
              <AlertCircle size={17} />
              <span>{error}</span>
            </div>
          )}

          <button className="btn auth-submit" type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : <>Sign in <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button
          className="btn btn-outline auth-submit demo-login-btn"
          type="button"
          disabled={submitting}
          onClick={() => run(loginDemo)}
        >
          Continue as demo user
        </button>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
        <p className="auth-note">The demo account is shared, so anyone using it can see its analyses.</p>
      </div>
    </div>
  )
}
