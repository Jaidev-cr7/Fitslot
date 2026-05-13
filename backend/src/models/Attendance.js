import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    checkInTime: {
      type: Date,
      required: true,
    },
    checkOutTime: Date,
    duration: {
      type: Number, // in minutes
      default: 0,
    },
  },
  { timestamps: true }
)

export const Attendance = mongoose.model('Attendance', attendanceSchema)
