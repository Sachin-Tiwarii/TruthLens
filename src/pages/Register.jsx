import { Link, useNavigate } from 'react-router-dom'
import { ScanEye, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    login(email)
    navigate('/dashboard')
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <Link to="/" className="brand auth-brand">
          <span className="brand-mark"><ScanEye /></span>
          <span className="brand-name">truth<span>lens</span></span>
        </Link>

        <h1 className="heading-md">Create account</h1>

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
            <label htmlFor="reg-email">Email</label>
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

          <button className="btn auth-submit" type="submit">
            Create account <ArrowRight size={16} />
          </button>
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
        <p className="auth-note">Demo mode: accounts are local-only until a backend is connected.</p>
      </div>
    </div>
  )
}