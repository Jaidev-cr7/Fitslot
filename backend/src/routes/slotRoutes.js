import express from 'express'
import {
  getAllSlots,
  getSlotById,
  createSlot,
  updateSlot,
  deleteSlot,
} from '../controllers/slotController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/', getAllSlots)
router.get('/:id', getSlotById)
router.post('/', authMiddleware, adminMiddleware, createSlot)
router.put('/:id', authMiddleware, adminMiddleware, updateSlot)
router.delete('/:id', authMiddleware, adminMiddleware, deleteSlot)

export default router
