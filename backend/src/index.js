import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import { errorHandler } from './utils/errorHandler.js'

// Route imports
import authRoutes from './routes/authRoutes.js'
import slotRoutes from './routes/slotRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import attendanceRoutes from './routes/attendanceRoutes.js'
import userRoutes from './routes/userRoutes.js'

// Config must be loaded before anything else
dotenv.config()

const app = express()

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Connect to MongoDB
connectDB()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/slots', slotRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/users', userRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'FitSlot API is running' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Error handling (must be last)
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 FitSlot server running on port ${PORT}`)
})
