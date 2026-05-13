import { Attendance } from '../models/Attendance.js'
import { Booking } from '../models/Booking.js'
import { User } from '../models/User.js'

export const markAttendance = async (req, res) => {
  try {
    const { bookingId } = req.body

    if (!bookingId) {
      return res.status(400).json({ success: false, message: 'Booking ID is required' })
    }

    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' })
    }

    // Check if already marked
    const existingAttendance = await Attendance.findOne({ booking: bookingId })
    if (existingAttendance) {
      return res.status(400).json({ success: false, message: 'Attendance already marked' })
    }

    const attendance = new Attendance({
      user: booking.user,
      booking: bookingId,
      date: booking.date,
      time: booking.time,
      checkInTime: new Date(),
    })

    await attendance.save()

    // Update user attendance count
    await User.findByIdAndUpdate(booking.user, {
      $inc: { attendance: 1 },
    })

    // Mark booking as completed
    booking.status = 'completed'
    await booking.save()

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getAttendanceStats = async (req, res) => {
  try {
    const userId = req.query.userId || req.userId

    const totalAttendance = await Attendance.countDocuments({ user: userId })
    const thisMonth = await Attendance.countDocuments({
      user: userId,
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    })

    const user = await User.findById(userId)

    res.status(200).json({
      success: true,
      stats: {
        totalAttendance,
        thisMonth,
        attendanceRate: user?.attendance || 0,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('user', 'name email')
      .populate('booking', 'date time')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      attendance,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
