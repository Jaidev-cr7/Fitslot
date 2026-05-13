export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err }),
  })
}

export class AppError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}
