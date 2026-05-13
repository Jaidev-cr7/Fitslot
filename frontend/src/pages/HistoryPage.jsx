import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Navbar } from '../components/shared/Navbar'
import { BookingHistoryTable } from '../components/dashboard/DashboardComponents'
import { bookingsService } from '../services/api'
import { useNotification } from '../context/store'
import { PageLoader } from '../components/shared/Loaders'
import { History } from 'lucide-react'

export const HistoryPage = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      const res = await bookingsService.getMyBookings()
      setBookings(res.data.bookings || [])
    } catch (error) {
      showNotification('Failed to load history', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await bookingsService.cancel(bookingId)
      showNotification('Booking cancelled', 'success')
      await fetchHistory()
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to cancel booking', 'error')
    }
  }

  if (loading) return <PageLoader />

  return (
    <div className="bg-surface-0 min-h-screen">
      <Navbar />

      <main className="pt-20 px-4 md:px-8 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="p-3 bg-surface-2 rounded-xl text-text-primary">
              <History size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Booking History</h1>
              <p className="text-sm text-text-muted mt-0.5">View your past and upcoming gym sessions</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <BookingHistoryTable bookings={bookings} onCancel={handleCancelBooking} />
          </motion.div>
        </div>
      </main>
    </div>
  )
}
