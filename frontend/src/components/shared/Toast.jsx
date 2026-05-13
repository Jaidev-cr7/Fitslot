import { motion, AnimatePresence } from 'framer-motion'
import { useNotification } from '../../context/store.js'
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react'

const icons = {
  success: CheckCircle2,
  error:   XCircle,
  warning: AlertTriangle,
}

const colors = {
  success: 'border-accent text-accent',
  error:   'border-danger text-danger',
  warning: 'border-warning text-warning',
}

export const Toast = () => {
  const { notification } = useNotification()

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          key={notification.message}
          initial={{ opacity: 0, y: -16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`fixed top-16 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg
                      bg-surface-1 border ${colors[notification.type] || colors.success}
                      shadow-card max-w-sm`}
        >
          {(() => {
            const Icon = icons[notification.type] || icons.success
            return <Icon size={18} className="flex-shrink-0" />
          })()}
          <p className="text-sm text-text-primary font-medium">{notification.message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
