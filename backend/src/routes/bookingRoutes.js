import express from 'express'
import {
  getMyBookings,
  getAllBookings,
  createBooking,
  cancelBooking,
} from '../controllers/bookingController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authMiddleware, (req, res, next) => {
  if (req.userRole === 'admin') {
    return getAllBookings(req, res)
  }
  return getMyBookings(req, res)
})

router.post('/', authMiddleware, createBooking)
router.post('/:id/cancel', authMiddleware, cancelBooking)

export default router
