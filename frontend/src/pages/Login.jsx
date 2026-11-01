  import { Link, useNavigate } from 'react-router-dom'
  import { ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react'
  import { useState } from 'react'
  import { useAuthStore } from '../store/authStore'
  import { getErrorMessage } from '../services/api'
  import AuthLayout, { PasswordField } from './AuthLayout.jsx'

  export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const login = useAuthStore((s) => s.login)
    const loginDemo = useAuthStore((s) => s.loginDemo)
    const navigate = useNavigate()

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
      <AuthLayout
        title="Sign in"
        subtitle="Access your verification workspace."
        switchText={<>New to TruthLens? <Link to="/register">Create an account</Link></>}
      >
        <form onSubmit={submit} noValidate={false}>
          <div className="tl-field">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              className="tl-input"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <PasswordField
            id="login-password"
            label="Password"
            minLength={4}
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="tl-error" role="alert">
              <AlertCircle size={16} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <button className="tl-submit" type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : <>Sign in <ArrowRight size={15} aria-hidden="true" /></>}
          </button>
        </form>

        <div className="tl-divider"><span>or</span></div>

        <button className="tl-submit tl-submit-ghost" type="button" onClick={demoLogin} disabled={submitting}>
          <ShieldCheck size={15} aria-hidden="true" /> Continue as demo user
        </button>

        <p className="tl-auth-note">
          Demo mode: authentication is local-only until a backend is connected.
        </p>
      </AuthLayout>
    )
  }