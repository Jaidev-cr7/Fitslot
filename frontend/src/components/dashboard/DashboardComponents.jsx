import { motion } from 'framer-motion'
import { Badge } from '../shared/UI.jsx'
import { Calendar, Users } from 'lucide-react'

// ─── Stat Card ───────────────────────────────────────────
export const StatCard = ({ icon: Icon, title, value, sub, accent = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className={`rounded-xl p-5 border ${
      accent
        ? 'bg-accent-muted border-accent border-opacity-30'
        : 'bg-surface-1 border-border'
    }`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-text-muted mb-1">{title}</p>
        <p className={`text-2xl font-bold ${accent ? 'text-accent-text' : 'text-text-primary'}`}>
          {value}
        </p>
        {sub && <p className="text-xs text-text-muted mt-1">{sub}</p>}
      </div>
      {Icon && (
        <div className={`p-2 rounded-lg ${accent ? 'bg-accent bg-opacity-20' : 'bg-surface-2'}`}>
          <Icon size={18} className={accent ? 'text-accent-text' : 'text-text-secondary'} />
        </div>
      )}
    </div>
  </motion.div>
)

// ─── Dashboard Card (alias for StatCard) ─────────────────
export const DashboardCard = ({ icon, title, value, subtext, gradient }) => (
  <StatCard icon={icon} title={title} value={value} sub={subtext} accent={gradient} />
)

// ─── Slot Card ───────────────────────────────────────────
export const SlotCard = ({ slot, onBook }) => {
  const available = slot.availableSeats > 0
  const fillPct = ((slot.totalSeats - slot.availableSeats) / slot.totalSeats) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-surface-1 border border-border rounded-xl p-5 flex flex-col gap-4"
    >
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-text-muted mb-0.5 flex items-center gap-1">
            <Calendar size={11} />
            {slot.date}
          </p>
          <p className="text-lg font-bold text-text-primary">{slot.time}</p>
          {slot.startTime && slot.endTime && (
            <p className="text-xs text-text-muted">{slot.startTime} – {slot.endTime}</p>
          )}
        </div>
        <span className={available ? 'badge-success badge' : 'badge-danger badge'}>
          {available ? 'Open' : 'Full'}
        </span>
      </div>

      {/* Capacity bar */}
      <div>
        <div className="flex justify-between text-xs text-text-muted mb-1.5">
          <span className="flex items-center gap-1"><Users size={10} /> Seats</span>
          <span className="font-medium text-text-secondary">
            {slot.totalSeats - slot.availableSeats}/{slot.totalSeats}
          </span>
        </div>
        <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${fillPct}%` }}
            transition={{ duration: 0.6 }}
            className={`h-full rounded-full ${
              fillPct >= 90 ? 'bg-danger' : fillPct >= 70 ? 'bg-warning' : 'bg-accent'
            }`}
          />
        </div>
      </div>

      {/* Action */}
      <button
        onClick={available ? onBook : undefined}
        disabled={!available}
        className={available ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center opacity-40 cursor-not-allowed'}
      >
        {available ? 'Book Slot' : 'Slot Full'}
      </button>
    </motion.div>
  )
}

// ─── Booking History Table ────────────────────────────────
export const BookingHistoryTable = ({ bookings = [], onCancel }) => {
  if (bookings.length === 0) {
    return (
      <div className="bg-surface-1 border border-border rounded-xl p-8 text-center">
        <p className="text-text-muted text-sm">No booking history yet.</p>
      </div>
    )
  }

  const statusVariant = (status) => {
    if (status === 'confirmed') return 'success'
    if (status === 'cancelled') return 'danger'
    return 'neutral'
  }

  return (
    <div className="bg-surface-1 border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="font-semibold text-text-primary">Booking History</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td className="font-medium">{booking.date}</td>
                <td>{booking.time}</td>
                <td>
                  <Badge variant={statusVariant(booking.status)} size="sm">
                    {booking.status}
                  </Badge>
                </td>
                <td>
                  {booking.status === 'confirmed' && onCancel && (
                    <button
                      onClick={() => onCancel(booking._id)}
                      className="text-xs text-danger hover:underline font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Sidebar (kept for mobile nav) ───────────────────────
export const Sidebar = ({ isOpen, setIsOpen }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-30 md:hidden"
      onClick={() => setIsOpen(false)}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60" />
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        exit={{ x: -280 }}
        className="absolute left-0 top-0 h-full w-64 bg-surface-1 border-r border-border p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <nav className="mt-16 space-y-1">
          {[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Book a Slot', href: '/dashboard' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-surface-2 hover:text-text-primary transition text-sm font-medium"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </motion.div>
    </div>
  )
}
