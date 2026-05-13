import { Booking } from '../models/Booking.js'
import { Slot } from '../models/Slot.js'
import { User } from '../models/User.js'

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate('user', 'name email')
      .populate('slot', 'date time')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      bookings,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('slot', 'date time')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      bookings,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createBooking = async (req, res) => {
  try {
    const { slotId } = req.body

    if (!slotId) {
      return res.status(400).json({ success: false, message: 'Slot ID is required' })
    }

    const slot = await Slot.findById(slotId)
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' })
    }

    if (slot.availableSeats <= 0) {
      return res.status(400).json({ success: false, message: 'Slot is full' })
    }

    // Check if user already booked this slot
    const existingBooking = await Booking.findOne({
      user: req.userId,
      slot: slotId,
      status: 'confirmed',
    })

    if (existingBooking) {
      return res.status(400).json({ success: false, message: 'Already booked for this slot' })
    }

    const booking = new Booking({
      user: req.userId,
      slot: slotId,
      date: slot.date,
      time: slot.time,
      status: 'confirmed',
    })

    await booking.save()

    // Update slot
    slot.availableSeats -= 1
    slot.bookings.push(booking._id)
    await slot.save()

    // Update user bookings
    await User.findByIdAndUpdate(req.userId, {
      $push: { bookings: booking._id },
    })

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' })
    }

    if (booking.user.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled' })
    }

    booking.status = 'cancelled'
    booking.cancelledAt = new Date()
    await booking.save()

    // Update slot
    const slot = await Slot.findById(booking.slot)
    slot.availableSeats += 1
    slot.bookings = slot.bookings.filter((b) => b.toString() !== booking._id.toString())
    await slot.save()

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
