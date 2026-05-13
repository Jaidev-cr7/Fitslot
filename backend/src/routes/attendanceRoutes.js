import express from 'express'
import {
  markAttendance,
  getAttendanceStats,
  getAllAttendance,
} from '../controllers/attendanceController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.post('/', authMiddleware, markAttendance)
router.get('/stats', authMiddleware, getAttendanceStats)
router.get('/', authMiddleware, adminMiddleware, getAllAttendance)

export default router
