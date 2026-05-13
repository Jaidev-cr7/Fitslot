import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Navbar } from '../components/shared/Navbar'
import { Badge } from '../components/shared/UI'
import { useProtectedRoute } from '../hooks/useProtectedRoute'
import { slotsService, bookingsService, usersService, attendanceService } from '../services/api.js'
import { useNotification } from '../context/store.js'
import { SkeletonCard } from '../components/shared/Loaders'
import { Users, Zap, BarChart3, Trash2, Edit2, Plus, TrendingUp, X, CheckCircle2 } from 'lucide-react'
import { StatCard } from '../components/dashboard/DashboardComponents'

// ─── Admin Dashboard ─────────────────────────────────────
export const AdminDashboard = () => {
  const { user } = useProtectedRoute('admin')
  const { showNotification } = useNotification()

  const [slots, setSlots] = useState([])
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddSlot, setShowAddSlot] = useState(false)
  const [editSlot, setEditSlot] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const emptyForm = { date: '', time: '', startTime: '', endTime: '', totalSeats: 20 }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [slotsRes, bookingsRes, usersRes, attRes] = await Promise.allSettled([
        slotsService.getAll(),
        bookingsService.getAll(),
        usersService.getAll(),
        attendanceService.getAll(),
      ])

      // Backend returns: { success, slots/bookings/users/attendance }
      if (slotsRes.status === 'fulfilled')    setSlots(slotsRes.value.data.slots || [])
      if (bookingsRes.status === 'fulfilled') setBookings(bookingsRes.value.data.bookings || [])
      if (usersRes.status === 'fulfilled')    setUsers(usersRes.value.data.users || [])
      if (attRes.status === 'fulfilled')      setAttendance(attRes.value.data.attendance || [])
    } catch (err) {
      showNotification('Failed to load dashboard', 'error')
    } finally {
      setLoading(false)
    }
  }

  // ── Add / Edit slot ───────────────────────────────────
  const openAdd = () => { setForm(emptyForm); setEditSlot(null); setShowAddSlot(true) }
  const openEdit = (slot) => {
    setForm({
      date:       slot.date,
      time:       slot.time,
      startTime:  slot.startTime || '',
      endTime:    slot.endTime || '',
      totalSeats: slot.totalSeats,
    })
    setEditSlot(slot)
    setShowAddSlot(true)
  }

  const handleSlotSubmit = async (e) => {
    e.preventDefault()
    if (!form.date || !form.time || !form.totalSeats) {
      showNotification('Date, time and seats are required', 'error')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        date:       form.date,
        time:       form.time,
        startTime:  form.startTime || form.time,
        endTime:    form.endTime   || form.time,
        totalSeats: Number(form.totalSeats),
      }

      if (editSlot) {
        await slotsService.update(editSlot._id, payload)
        showNotification('Slot updated', 'success')
      } else {
        await slotsService.create(payload)
        showNotification('Slot created', 'success')
      }

      setShowAddSlot(false)
      setForm(emptyForm)
      setEditSlot(null)
      await fetchAll()
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to save slot', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Delete slot ───────────────────────────────────────
  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Delete this slot? Active bookings will not be refunded.')) return
    try {
      await slotsService.delete(slotId)
      showNotification('Slot removed', 'success')
      await fetchAll()
    } catch (err) {
      showNotification('Failed to delete slot', 'error')
    }
  }

  // ── Mark attendance ───────────────────────────────────
  const handleMarkAttendance = async (bookingId) => {
    try {
      await attendanceService.markAttendance({ bookingId })
      showNotification('Attendance marked', 'success')
      await fetchAll()
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to mark attendance', 'error')
    }
  }

  // ── Computed stats ────────────────────────────────────
  const activeSlots = slots.filter((s) => s.isActive)
  const avgUtil = activeSlots.length > 0
    ? Math.round(
        activeSlots.reduce(
          (acc, s) => acc + ((s.totalSeats - s.availableSeats) / s.totalSeats) * 100,
          0
        ) / activeSlots.length
      )
    : 0
  const studentCount = users.filter((u) => u.role === 'student').length

  if (loading) {
    return (
      <div className="bg-surface-0 min-h-screen">
        <Navbar />
        <main className="pt-20 px-4 md:px-8 pb-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
              <p className="text-sm text-text-muted mt-0.5">Manage slots, users and bookings</p>
            </div>
            <button
              onClick={openAdd}
              className="btn-primary"
            >
              <Plus size={16} />
              Add Slot
            </button>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard icon={Users}    title="Students"   value={studentCount} sub="registered" />
            <StatCard icon={Zap}      title="Active Slots" value={activeSlots.length} sub="available" />
            <StatCard icon={BarChart3} title="Bookings"  value={bookings.length} sub="total" accent />
            <StatCard icon={TrendingUp} title="Avg Utilization" value={`${avgUtil}%`} sub="capacity used" />
          </div>

          {/* ── Slots Table ─────────────────────────────── */}
          <Section title={`Gym Slots (${slots.length})`}>
            <TableWrapper
              empty={slots.length === 0}
              emptyMsg="No slots created yet. Click 'Add Slot' to get started."
            >
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Seats</th>
                  <th>Fill</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => {
                  const fill = Math.round(((slot.totalSeats - slot.availableSeats) / slot.totalSeats) * 100)
                  return (
                    <tr key={slot._id}>
                      <td className="font-medium">{slot.date}</td>
                      <td>{slot.time}</td>
                      <td>{slot.availableSeats}/{slot.totalSeats}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${fill >= 90 ? 'bg-danger' : fill >= 70 ? 'bg-warning' : 'bg-accent'}`}
                              style={{ width: `${fill}%` }}
                            />
                          </div>
                          <span className="text-xs text-text-muted">{fill}%</span>
                        </div>
                      </td>
                      <td>
                        <Badge variant={slot.isActive ? 'success' : 'neutral'} size="sm">
                          {slot.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(slot)}
                            className="p-1.5 rounded-md hover:bg-surface-2 transition text-text-muted hover:text-text-primary"
                            title="Edit slot"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteSlot(slot._id)}
                            className="p-1.5 rounded-md hover:bg-danger-muted transition text-text-muted hover:text-danger"
                            title="Delete slot"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </TableWrapper>
          </Section>

          {/* ── All Bookings ─────────────────────────────── */}
          <Section title={`Bookings (${bookings.length})`}>
            <TableWrapper
              empty={bookings.length === 0}
              emptyMsg="No bookings yet."
            >
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => {
                  const alreadyMarked = attendance.some((a) => a.booking?._id === b._id || a.booking === b._id)
                  return (
                    <tr key={b._id}>
                      <td className="font-medium">{b.user?.name || '—'}</td>
                      <td className="text-text-muted">{b.user?.email || '—'}</td>
                      <td>{b.date}</td>
                      <td>{b.time}</td>
                      <td>
                        <Badge
                          variant={
                            b.status === 'confirmed' ? 'success'
                            : b.status === 'cancelled' ? 'danger'
                            : 'neutral'
                          }
                          size="sm"
                        >
                          {b.status}
                        </Badge>
                      </td>
                      <td>
                        {b.status === 'confirmed' && !alreadyMarked ? (
                          <button
                            onClick={() => handleMarkAttendance(b._id)}
                            className="flex items-center gap-1 text-xs text-accent hover:underline font-medium"
                          >
                            <CheckCircle2 size={12} /> Mark
                          </button>
                        ) : alreadyMarked ? (
                          <span className="text-xs text-text-muted flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-accent" /> Marked
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </TableWrapper>
          </Section>

          {/* ── Users ───────────────────────────────────── */}
          <Section title={`Users (${users.length})`}>
            <TableWrapper
              empty={users.length === 0}
              emptyMsg="No users found."
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Attendance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="font-medium">{u.name}</td>
                    <td className="text-text-muted">{u.email}</td>
                    <td className="capitalize">{u.role}</td>
                    <td>{u.attendance || 0}</td>
                    <td>
                      <Badge variant={u.isActive ? 'success' : 'neutral'} size="sm">
                        {u.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableWrapper>
          </Section>
        </div>
      </main>

      {/* ── Add/Edit Slot Modal ──────────────────────── */}
      {showAddSlot && (
        <div className="modal-overlay" onClick={() => setShowAddSlot(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-surface-1 border border-border rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-text-primary">
                {editSlot ? 'Edit Slot' : 'Add New Slot'}
              </h2>
              <button
                onClick={() => setShowAddSlot(false)}
                className="btn-ghost p-2 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSlotSubmit} className="space-y-4">
              <div>
                <label className="label">Date *</label>
                <input
                  id="slot-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="input-field"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="label">Time Label *</label>
                <input
                  id="slot-time"
                  type="text"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  placeholder="e.g. 6:00 AM – 7:00 AM"
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Start Time</label>
                  <input
                    id="slot-start"
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">End Time</label>
                  <input
                    id="slot-end"
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="label">Total Seats *</label>
                <input
                  id="slot-seats"
                  type="number"
                  min="1"
                  max="200"
                  value={form.totalSeats}
                  onChange={(e) => setForm({ ...form, totalSeats: parseInt(e.target.value) || 1 })}
                  className="input-field"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSlot(false)}
                  className="btn-secondary flex-1 justify-center"
                >
                  Cancel
                </button>
                <button
                  id="slot-submit"
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 justify-center"
                >
                  {submitting
                    ? (editSlot ? 'Saving…' : 'Creating…')
                    : (editSlot ? 'Save Changes' : 'Create Slot')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// ─── Section wrapper ─────────────────────────────────────
const Section = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-surface-1 border border-border rounded-xl overflow-hidden mb-6"
  >
    <div className="px-6 py-4 border-b border-border">
      <h2 className="font-semibold text-text-primary">{title}</h2>
    </div>
    {children}
  </motion.div>
)

// ─── Table wrapper ───────────────────────────────────────
const TableWrapper = ({ children, empty, emptyMsg }) => {
  if (empty) {
    return (
      <div className="px-6 py-8 text-center">
        <p className="text-text-muted text-sm">{emptyMsg}</p>
      </div>
    )
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">{children}</table>
    </div>
  )
}
