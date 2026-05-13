import { motion } from 'framer-motion'

// ─── Button ─────────────────────────────────────────────
export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const variants = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    ghost:     'btn-ghost',
    danger:    'btn-danger',
  }

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: '',
    lg: 'text-base px-6 py-3',
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${variants[variant]} ${size !== 'md' ? sizes[size] : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

// ─── Card ────────────────────────────────────────────────
export const Card = ({ children, className = '', hover = false, onClick }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : {}}
      onClick={onClick}
      className={`bg-surface-1 border border-border rounded-xl p-6 ${hover ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  )
}

// ─── Badge ───────────────────────────────────────────────
export const Badge = ({ children, variant = 'neutral', size = 'md' }) => {
  const variants = {
    success: 'badge-success',
    danger:  'badge-danger',
    warning: 'badge-warning',
    neutral: 'badge-neutral',
    // legacy aliases
    accent:  'badge-danger',
    primary: 'badge-success',
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1',
  }

  return (
    <span className={`badge ${variants[variant] || 'badge-neutral'} ${sizes[size]}`}>
      {children}
    </span>
  )
}

// ─── Spinner ─────────────────────────────────────────────
export const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return (
    <div className={`${sizes[size]} border-2 border-border border-t-accent rounded-full animate-spin`} />
  )
}

// ─── Empty State ─────────────────────────────────────────
export const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    {Icon && <Icon size={40} className="text-text-muted mb-4" />}
    <h3 className="text-text-primary font-semibold mb-1">{title}</h3>
    {description && <p className="text-text-muted text-sm">{description}</p>}
  </div>
)

// ─── Section Header ──────────────────────────────────────
export const SectionHeader = ({ title, action }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
    {action}
  </div>
)
