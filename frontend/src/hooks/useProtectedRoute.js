import { useAuthStore } from '../context/store'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Protects a page from unauthenticated access.
 * @param {string|null} requiredRole - 'admin' | 'student' | null (any authenticated)
 */
export const useProtectedRoute = (requiredRole = null) => {
  const { user, token } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token || !user) {
      navigate('/login', { replace: true })
    } else if (requiredRole && user.role !== requiredRole) {
      // Redirect to appropriate dashboard
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
    }
  }, [token, user, requiredRole, navigate])

  return { user, token }
}
