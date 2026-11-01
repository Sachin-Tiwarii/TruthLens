import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { getErrorMessage } from '../services/api'
import AuthLayout, { PasswordField } from './Authlayout.JSX'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
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
    <AuthLayout
      title="Create your account"
      subtitle="Start verifying images, audio, and video."
      switchText={<>Already registered? <Link to="/login">Sign in</Link></>}
    >
      <form onSubmit={submit}>
        <div className="tl-field">
          <label htmlFor="reg-name">Full name</label>
          <input
            id="reg-name"
            className="tl-input"
            required
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="tl-field">
          <label htmlFor="reg-email">Email address</label>
          <input
            id="reg-email"
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
          id="reg-password"
          label="Password"
          minLength={4}
          autoComplete="new-password"
          placeholder="Create a password"
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
          {submitting ? 'Creating account…' : <>Create account <ArrowRight size={15} aria-hidden="true" /></>}
        </button>
      </form>
    </AuthLayout>
  )
}