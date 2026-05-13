import { Slot } from '../models/Slot.js'

export const getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.find({ isActive: true }).populate('bookings')
    res.status(200).json({
      success: true,
      slots,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const getSlotById = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id).populate('bookings')
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' })
    }

    res.status(200).json({
      success: true,
      slot,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const createSlot = async (req, res) => {
  try {
    const { date, time, startTime, endTime, totalSeats } = req.body

    if (!date || !time || !startTime || !endTime || !totalSeats) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    const slot = new Slot({
      date,
      time,
      startTime,
      endTime,
      totalSeats,
      availableSeats: totalSeats,
    })

    await slot.save()

    res.status(201).json({
      success: true,
      message: 'Slot created successfully',
      slot,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const updateSlot = async (req, res) => {
  try {
    const slot = await Slot.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Slot updated successfully',
      slot,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

export const deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    )
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Slot not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Slot deleted successfully',
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
