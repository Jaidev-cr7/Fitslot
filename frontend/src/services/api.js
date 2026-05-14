import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

if (!API_URL) {
  console.warn(
    '[FitSlot] VITE_API_URL is not set! ' +
    'Falling back to http://localhost:5000/api. ' +
    'Set VITE_API_URL in your .env file or Vercel dashboard.'
  )
}

const api = axios.create({
  baseURL: API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally — auto-logout on expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ─── Auth ────────────────────────────────────────────────
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  profile:  ()     => api.get('/auth/profile'),
  logout:   () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

// ─── Slots ───────────────────────────────────────────────
// Backend returns: { success, slots }
export const slotsService = {
  getAll:  ()         => api.get('/slots'),
  getById: (id)       => api.get(`/slots/${id}`),
  create:  (data)     => api.post('/slots', data),
  update:  (id, data) => api.put(`/slots/${id}`, data),
  delete:  (id)       => api.delete(`/slots/${id}`),
}

// ─── Bookings ────────────────────────────────────────────
// Backend returns: { success, bookings }
// GET /api/bookings → admin gets all, student gets own (handled server-side)
export const bookingsService = {
  getAll:       ()   => api.get('/bookings'),          // admin
  getMyBookings: ()  => api.get('/bookings'),          // student — same endpoint, role-gated server-side
  create:       (data) => api.post('/bookings', data),
  cancel:       (id)   => api.post(`/bookings/${id}/cancel`),
}

// ─── Attendance ──────────────────────────────────────────
// Backend returns: { success, attendance } / { success, stats }
export const attendanceService = {
  getAll:        ()     => api.get('/attendance'),
  markAttendance: (data) => api.post('/attendance', data),
  getStats:      ()     => api.get('/attendance/stats'),
}

// ─── Users ───────────────────────────────────────────────
// Backend returns: { success, users }
export const usersService = {
  getAll:  ()         => api.get('/users'),
  getById: (id)       => api.get(`/users/${id}`),
  update:  (id, data) => api.put(`/users/${id}`, data),
  delete:  (id)       => api.delete(`/users/${id}`),
}

export default api
