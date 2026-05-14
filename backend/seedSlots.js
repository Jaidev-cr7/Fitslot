import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Slot } from './src/models/Slot.js'

dotenv.config()

const seedSlots = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB for seeding slots...')

    // Clear existing slots if you want, but maybe we just append
    // await Slot.deleteMany({})

    const today = new Date()
    const slotsToInsert = []

    // Create slots for today, tomorrow, and the day after
    for (let i = 0; i < 3; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dateString = date.toISOString().split('T')[0] // 'YYYY-MM-DD'

      const times = [
        { time: '06:00 AM - 08:00 AM', startTime: '06:00', endTime: '08:00' },
        { time: '08:00 AM - 10:00 AM', startTime: '08:00', endTime: '10:00' },
        { time: '04:00 PM - 06:00 PM', startTime: '16:00', endTime: '18:00' },
        { time: '06:00 PM - 08:00 PM', startTime: '18:00', endTime: '20:00' }
      ]

      for (const t of times) {
        slotsToInsert.push({
          date: dateString,
          time: t.time,
          startTime: t.startTime,
          endTime: t.endTime,
          totalSeats: 20,
          availableSeats: 20,
          bookings: [],
          isActive: true
        })
      }
    }

    const inserted = await Slot.insertMany(slotsToInsert)
    console.log(`Successfully seeded ${inserted.length} slots!`)
    process.exit(0)
  } catch (error) {
    console.error('Error seeding slots:', error)
    process.exit(1)
  }
}

seedSlots()
