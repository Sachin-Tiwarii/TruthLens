import { Link, useNavigate } from 'react-router-dom'
import { ScanEye, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    login(email)
    navigate('/dashboard')
  }

  const demoLogin = () => {
    login('demo@truthlens.ai')
    navigate('/dashboard')
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

          <button className="btn auth-submit" type="submit">
            Sign in <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button className="btn btn-outline auth-submit demo-login-btn" type="button" onClick={demoLogin}>
          Continue as demo user
        </button>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
        <p className="auth-note">Demo mode: sign-in is local-only until a backend is connected.</p>
      </div>
    </div>
  )
}