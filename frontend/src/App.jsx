import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toast } from './components/shared/Toast'
import { useAuthStore } from './context/store'

// Pages
import { LoginPage, RegisterPage } from './pages/AuthPages'
import { StudentDashboard } from './pages/StudentDashboard'
import { AdminDashboard } from './pages/AdminDashboard'
import { LandingPage } from './pages/LandingPage'
import { HistoryPage } from './pages/HistoryPage'
import { ProfilePage } from './pages/ProfilePage'

// ─── Protected Route Guard ───────────────────────────────
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token } = useAuthStore()

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect non-admin to dashboard, non-student to admin
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  return children
}

// ─── App ──────────────────────────────────────────────────
export default function App() {
  const { user } = useAuthStore()

  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Student-protected */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>}
        />
        <Route
          path="/history"
          element={<ProtectedRoute><HistoryPage /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
        />

        {/* Admin-protected */}
        <Route
          path="/admin"
          element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>}
        />

        {/* Catch-all */}
        <Route
          path="*"
          element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/'} replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}
