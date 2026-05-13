import express from 'express'
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authMiddleware, adminMiddleware, getAllUsers)
router.get('/:id', authMiddleware, getUserById)
router.put('/:id', authMiddleware, updateUser)
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser)

export default router
