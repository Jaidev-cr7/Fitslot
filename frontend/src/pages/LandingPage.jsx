import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../context/store'
import { Dumbbell, Calendar, Users, CheckSquare, ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react'

export const LandingPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const handleCTA = () => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } else {
      navigate('/register')
    }
  }

  return (
    <div className="min-h-screen bg-surface-0">
      {/* ── Nav ─────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-border/40 bg-surface-0/80 backdrop-blur-md">
        <div className="flex items-center justify-between h-14 px-6 max-w-6xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-glow-sm">
              <Dumbbell size={14} className="text-surface-0" />
            </div>
            <span className="font-bold text-text-primary tracking-tight">FitSlot</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}
                className="btn-primary text-sm"
              >
                Dashboard <ArrowRight size={14} />
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="btn-ghost text-sm">
                  Sign In
                </button>
                <button onClick={() => navigate('/register')} className="btn-primary text-sm">
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-muted text-accent-text border border-accent border-opacity-30 mb-6">
              <Zap size={10} /> Smart Gym Booking
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-text-primary leading-tight mb-6">
              Book your gym slot.{' '}
              <span className="text-accent">Track your progress.</span>
            </h1>
            <p className="text-lg text-text-muted mb-10 max-w-xl mx-auto">
              FitSlot helps gym-goers reserve workout sessions, track attendance,
              and stay consistent — all in one place.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={handleCTA} className="btn-primary text-base px-6 py-3">
                {user ? 'Go to Dashboard' : 'Start for Free'}
                <ArrowRight size={16} />
              </button>
              {!user && (
                <button onClick={() => navigate('/login')} className="btn-secondary text-base px-6 py-3">
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────── */}
      <section className="py-10 border-y border-border">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: '500+', label: 'Active Users' },
              { value: '2,000+', label: 'Bookings Made' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-3xl font-bold text-accent mb-1">{s.value}</p>
                <p className="text-sm text-text-muted">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-text-primary mb-3">Everything you need</h2>
            <p className="text-text-muted">Built for students and gym admins alike.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Calendar,
                title: 'Easy Slot Booking',
                desc: 'Browse available time slots and book in one click. No queues.',
              },
              {
                icon: CheckSquare,
                title: 'Attendance Tracking',
                desc: 'Admins can mark attendance per session. Students see their history.',
              },
              {
                icon: BarChart3,
                title: 'Insights & Stats',
                desc: 'Track your monthly sessions, attendance rate and booking trends.',
              },
              {
                icon: Users,
                title: 'Admin Dashboard',
                desc: 'Full control over slots, users and bookings from one panel.',
              },
              {
                icon: Shield,
                title: 'Secure JWT Auth',
                desc: 'Role-based access for students and admins. Tokens auto-expire.',
              },
              {
                icon: Zap,
                title: 'Real-time Updates',
                desc: 'Seat counts update instantly after each booking or cancellation.',
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-surface-1 border border-border rounded-xl p-6 hover:border-accent hover:border-opacity-50 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-accent-muted flex items-center justify-center mb-4">
                  <f.icon size={18} className="text-accent-text" />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-text-muted">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center bg-accent-muted border border-accent border-opacity-30 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Ready to get started?</h2>
          <p className="text-text-muted mb-8">
            Join FitSlot today and never miss a workout again.
          </p>
          <button onClick={handleCTA} className="btn-primary text-base px-8 py-3">
            {user ? 'Go to Dashboard' : 'Create Free Account'}
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="border-t border-border py-8 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-md bg-accent flex items-center justify-center">
            <Dumbbell size={11} className="text-surface-0" />
          </div>
          <span className="font-bold text-sm text-text-primary">FitSlot</span>
        </div>
        <p className="text-xs text-text-muted">
          © {new Date().getFullYear()} FitSlot. Built with React & Node.js.
        </p>
      </footer>
    </div>
  )
}
