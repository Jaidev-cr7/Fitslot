import { LogOut, Dumbbell } from 'lucide-react'
import { useAuthStore } from '../../context/store.js'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

function getInitials(name = '') {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export const Navbar = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-40 border-b transition-all duration-300 ${
        scrolled
          ? 'bg-surface-0 border-border shadow-card'
          : 'bg-surface-0/60 border-transparent backdrop-blur-md'
      }`}
    >
      <div className="flex items-center justify-between h-14 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <button
          onClick={() => navigate(user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-glow-sm">
            <Dumbbell size={14} className="text-surface-0" />
          </div>
          <span className="font-bold text-base text-text-primary tracking-tight">
            FitSlot
          </span>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <button
                onClick={() => navigate('/login')}
                className="btn-ghost text-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn-primary text-sm"
              >
                Get Started
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Role indicator */}
              <span className="hidden sm:block text-xs text-text-muted font-medium px-2.5 py-1 rounded-full bg-surface-2 border border-border capitalize">
                {user.role}
              </span>

              {/* Nav links */}
              {user.role === 'admin' ? (
                <button
                  onClick={() => navigate('/admin')}
                  className="hidden md:block btn-ghost text-sm"
                >
                  Admin Panel
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="hidden md:block btn-ghost text-sm"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/history')}
                    className="hidden md:block btn-ghost text-sm"
                  >
                    History
                  </button>
                </>
              )}

              {/* Avatar (Click to go to Profile) */}
              <button
                onClick={() => navigate('/profile')}
                className="w-8 h-8 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-text-secondary text-xs font-bold hover:border-accent hover:text-accent transition"
                title="Profile"
              >
                {getInitials(user.name)}
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="btn-ghost p-2 rounded-lg"
                title="Sign out"
              >
                <LogOut size={16} className="text-text-muted" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
