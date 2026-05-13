// ─── Skeleton Card ───────────────────────────────────────
export const SkeletonCard = () => (
  <div className="bg-surface-1 border border-border rounded-xl p-6 animate-pulse">
    <div className="h-3 bg-surface-2 rounded w-1/2 mb-4" />
    <div className="h-8 bg-surface-2 rounded w-1/3 mb-2" />
    <div className="h-3 bg-surface-2 rounded w-2/3" />
  </div>
)

// ─── Skeleton Row ────────────────────────────────────────
export const SkeletonRow = () => (
  <div className="flex gap-4 py-3 px-4 border-b border-border animate-pulse">
    <div className="h-4 bg-surface-2 rounded flex-1" />
    <div className="h-4 bg-surface-2 rounded flex-1" />
    <div className="h-4 bg-surface-2 rounded w-20" />
    <div className="h-4 bg-surface-2 rounded w-16" />
  </div>
)

// ─── Full-page loader ────────────────────────────────────
export const PageLoader = () => (
  <div className="min-h-screen bg-surface-0 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-2 border-border border-t-accent rounded-full animate-spin" />
      <p className="text-text-muted text-sm">Loading...</p>
    </div>
  </div>
)
