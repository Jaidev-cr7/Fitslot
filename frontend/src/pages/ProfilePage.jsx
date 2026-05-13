import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Navbar } from '../components/shared/Navbar'
import { useAuthStore, useNotification } from '../context/store'
import { attendanceService } from '../services/api'
import { PageLoader } from '../components/shared/Loaders'
import { User, Mail, Shield, Target, Calendar, CheckSquare } from 'lucide-react'
import { getInitials } from '../utils/helpers'

export const ProfilePage = () => {
  const { user } = useAuthStore()
  const { showNotification } = useNotification()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      const res = await attendanceService.getStats()
      setStats(res.data.stats || {})
    } catch (error) {
      showNotification('Failed to load profile data', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (loading || !user) return <PageLoader />

  return (
    <div className="bg-surface-0 min-h-screen">
      <Navbar />

      <main className="pt-20 px-4 md:px-8 pb-16">
        <div className="max-w-3xl mx-auto">
          
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-1 border border-border rounded-2xl p-8 mb-6 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-surface-2 border-2 border-accent/20 flex items-center justify-center text-3xl font-bold text-text-primary shrink-0 shadow-glow-sm">
              {getInitials(user.name)}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left z-10">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-text-primary">{user.name}</h1>
                <span className="badge badge-neutral capitalize flex items-center gap-1">
                  <Shield size={12} /> {user.role}
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-text-muted text-sm mb-6">
                <Mail size={14} /> {user.email}
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          {user.role === 'student' && stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-surface-1 border border-border rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-text-muted">Total Attendance</p>
                  <div className="p-2 bg-accent/10 rounded-lg text-accent text-sm">
                    <CheckSquare size={16} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-text-primary mb-1">
                  {stats.totalAttendance || 0}
                </p>
                <p className="text-xs text-text-muted">Lifetime gym check-ins</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-surface-1 border border-border rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-text-muted">This Month</p>
                  <div className="p-2 bg-surface-2 rounded-lg text-text-secondary text-sm">
                    <Calendar size={16} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-text-primary mb-1">
                  {stats.thisMonth || 0}
                </p>
                <p className="text-xs text-text-muted">Sessions in current month</p>
              </motion.div>
            </div>
          )}

          {/* Account Settings Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface-1 border border-border rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <User size={18} /> Account Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Full Name</label>
                <input type="text" value={user.name} disabled className="input-field opacity-60 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Email Address</label>
                <input type="email" value={user.email} disabled className="input-field opacity-60 cursor-not-allowed" />
              </div>
              <p className="text-xs text-text-muted mt-4">
                To update your profile information or password, please contact your gym administrator.
              </p>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  )
}
