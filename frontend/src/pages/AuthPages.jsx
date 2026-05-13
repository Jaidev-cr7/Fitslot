import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authService } from '../services/api'
import { useAuthStore, useNotification } from '../context/store'
import { Eye, EyeOff, Dumbbell } from 'lucide-react'

// ─── Shared form field ───────────────────────────────────
const Field = ({ label, children }) => (
  <div>
    <label className="label">{label}</label>
    {children}
  </div>
)

// ─── Login Page ──────────────────────────────────────────
export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser, setToken } = useAuthStore()
  const { showNotification } = useNotification()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data } = await authService.login({ email, password })
      setToken(data.token)
      setUser(data.user)
      showNotification('Signed in successfully', 'success')
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (error) {
      showNotification(error.response?.data?.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent shadow-glow mb-4">
            <Dumbbell size={22} className="text-surface-0" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Welcome back</h1>
          <p className="text-sm text-text-muted">Sign in to your FitSlot account</p>
        </div>

        {/* Card */}
        <div className="bg-surface-1 border border-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email">
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                required
                autoComplete="email"
              />
            </Field>

            <Field label="Password">
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-muted mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent hover:underline font-medium">
            Create one
          </Link>
        </p>

        {/* Demo hint */}
        <p className="text-center text-xs text-text-muted mt-6 p-3 bg-surface-1 rounded-lg border border-border">
          Admin: create via seed script · Students: register normally
        </p>
      </motion.div>
    </div>
  )
}

// ─── Register Page ───────────────────────────────────────
export const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser, setToken } = useAuthStore()
  const { showNotification } = useNotification()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      showNotification('Passwords do not match', 'error')
      return
    }

    if (password.length < 6) {
      showNotification('Password must be at least 6 characters', 'error')
      return
    }

    setLoading(true)

    try {
      const { data } = await authService.register({ name, email, password })
      setToken(data.token)
      setUser(data.user)
      showNotification('Account created! Welcome to FitSlot', 'success')
      navigate('/dashboard')
    } catch (error) {
      showNotification(error.response?.data?.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent shadow-glow mb-4">
            <Dumbbell size={22} className="text-surface-0" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Join FitSlot</h1>
          <p className="text-sm text-text-muted">Create your account to book gym slots</p>
        </div>

        {/* Card */}
        <div className="bg-surface-1 border border-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name">
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="input-field"
                required
                autoComplete="name"
              />
            </Field>

            <Field label="Email">
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                required
                autoComplete="email"
              />
            </Field>

            <Field label="Password">
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="input-field pr-10"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>

            <Field label="Confirm Password">
              <input
                id="register-confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="input-field"
                required
                autoComplete="new-password"
              />
            </Field>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-text-muted mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
