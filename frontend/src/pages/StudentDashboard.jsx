import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  DashboardCard,
  SlotCard,
} from '../components/dashboard/DashboardComponents'
import { Navbar } from '../components/shared/Navbar'
import { useProtectedRoute } from '../hooks/useProtectedRoute'
import { Link } from 'react-router-dom'
import { slotsService, bookingsService, attendanceService } from '../services/api.js'
import { useNotification } from '../context/store.js'
import { SkeletonCard, PageLoader } from '../components/shared/Loaders'
import { Calendar, CheckSquare, TrendingUp, LayoutGrid } from 'lucide-react'

export const StudentDashboard = () => {
  const { user } = useProtectedRoute()
  const { showNotification } = useNotification()

  const [slots, setSlots] = useState([])
  const [bookings, setBookings] = useState([])
  const [stats, setStats] = useState({
    totalBookings: 0,
    attendance: 0,
    availableSlots: 0,
    thisMonth: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Backend returns: { success, slots }
      const [slotsRes, bookingsRes, statsRes] = await Promise.allSettled([
        slotsService.getAll(),
        bookingsService.getMyBookings(),
        attendanceService.getStats(),
      ])

      const allSlots = slotsRes.status === 'fulfilled'
        ? slotsRes.value.data.slots || []
        : []

      const userBookings = bookingsRes.status === 'fulfilled'
        ? bookingsRes.value.data.bookings || []
        : []

      const attendanceData = statsRes.status === 'fulfilled'
        ? statsRes.value.data.stats || {}
        : {}

      setSlots(allSlots)
      setBookings(userBookings)
      setStats({
        totalBookings:  userBookings.length,
        attendance:     attendanceData.totalAttendance || 0,
        thisMonth:      attendanceData.thisMonth || 0,
        availableSlots: allSlots.filter((s) => s.availableSeats > 0).length,
      })
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      showNotification('Failed to load dashboard data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleBookSlot = async (slot) => {
    try {
      await bookingsService.create({ slotId: slot._id })
      showNotification('Slot booked successfully!', 'success')
      await fetchDashboardData()
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to book slot', 'error')
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await bookingsService.cancel(bookingId)
      showNotification('Booking cancelled', 'success')
      await fetchDashboardData()
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to cancel booking', 'error')
    }
  }

  if (loading) {
    return (
      <div className="bg-surface-0 min-h-screen">
        <Navbar />
        <main className="pt-20 px-4 md:px-8 pb-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-surface-0 min-h-screen">
      <Navbar />

      <main className="pt-20 px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Welcome */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-text-primary mb-0.5">
              Good {getTimeGreeting()}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-sm text-text-muted">
              Track your bookings and gym attendance
            </p>
          </motion.div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <DashboardCard
              title="Total Bookings"
              value={stats.totalBookings}
              subtext="all time"
              icon={Calendar}
              gradient={false}
            />
            <DashboardCard
              title="Attendance"
              value={stats.attendance}
              subtext="check-ins"
              icon={CheckSquare}
              gradient={false}
            />
            <DashboardCard
              title="This Month"
              value={stats.thisMonth}
              subtext="sessions"
              icon={TrendingUp}
              gradient={true}
            />
            <DashboardCard
              title="Open Slots"
              value={stats.availableSlots}
              subtext="available now"
              icon={LayoutGrid}
              gradient={false}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Slots grid */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-text-primary">Available Slots</h2>
                <span className="text-xs text-text-muted">
                  {stats.availableSlots} of {slots.length} open
                </span>
              </div>

              {slots.length === 0 ? (
                <div className="bg-surface-1 border border-border rounded-xl p-8 text-center">
                  <p className="text-text-muted text-sm">No slots available. Check back later.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {slots.map((slot, i) => (
                    <motion.div
                      key={slot._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <SlotCard slot={slot} onBook={() => handleBookSlot(slot)} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Recent bookings */}
              <div className="bg-surface-1 border border-border rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex justify-between items-center">
                  <h3 className="font-semibold text-text-primary text-sm">Recent Bookings</h3>
                  <Link to="/history" className="text-xs text-accent hover:underline">View All</Link>
                </div>
                <div className="divide-y divide-border">
                  {bookings.length === 0 ? (
                    <p className="text-text-muted text-xs px-5 py-4">No bookings yet.</p>
                  ) : (
                    bookings.slice(0, 5).map((b) => (
                      <div key={b._id} className="px-5 py-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {b.slot?.date || b.date}
                          </p>
                          <p className="text-xs text-text-muted">{b.slot?.time || b.time}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`badge text-xs ${
                            b.status === 'confirmed' ? 'badge-success'
                            : b.status === 'cancelled' ? 'badge-danger'
                            : 'badge-neutral'
                          }`}>
                            {b.status}
                          </span>
                          {b.status === 'confirmed' && (
                            <button
                              onClick={() => handleCancelBooking(b._id)}
                              className="text-xs text-danger hover:underline"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Info card */}
              <div className="bg-surface-1 border border-border rounded-xl p-5">
                <h3 className="font-semibold text-sm text-text-primary mb-3">Gym Info</h3>
                <ul className="space-y-2 text-xs text-text-muted">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    Open daily 6 AM – 10 PM
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    New slots added every day
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    Book early for peak hours
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function getTimeGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}
