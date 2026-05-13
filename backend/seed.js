import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { User } from './src/models/User.js'
import { Slot } from './src/models/Slot.js'
import { hashPassword } from './src/utils/password.js'

dotenv.config()

// Connect to MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitslot'
    await mongoose.connect(uri)
    console.log('✓ MongoDB connected')
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

// Seed database
const seedDatabase = async () => {
  try {
    console.log('\n🌱 Starting database seeding...\n')

    // Clear existing data
    await User.deleteMany({})
    await Slot.deleteMany({})
    console.log('✓ Cleared existing data')

    // Create admin user
    const adminPassword = await hashPassword('admin123')
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@college.edu',
      password: adminPassword,
      role: 'admin',
      attendance: 0,
    })
    console.log('✓ Created admin user')
    console.log(`  Email: admin@college.edu`)
    console.log(`  Password: admin123\n`)

    // Create test student users
    const studentPassword = await hashPassword('student123')
    const students = await User.insertMany([
      {
        name: 'Priya Sharma',
        email: 'priya@college.edu',
        password: studentPassword,
        role: 'student',
        attendance: 24,
      },
      {
        name: 'Arjun Patel',
        email: 'arjun@college.edu',
        password: studentPassword,
        role: 'student',
        attendance: 18,
      },
      {
        name: 'Neha Verma',
        email: 'neha@college.edu',
        password: studentPassword,
        role: 'student',
        attendance: 32,
      },
      {
        name: 'Raj Kumar',
        email: 'raj@college.edu',
        password: studentPassword,
        role: 'student',
        attendance: 5,
      },
    ])
    console.log('✓ Created student users')
    console.log(`  Test student credentials:`)
    console.log(`  Email: priya@college.edu`)
    console.log(`  Password: student123\n`)

    // Create slots for today and tomorrow
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

    const times = [
      { time: '6:00 PM - 7:00 PM', start: '18:00', end: '19:00' },
      { time: '7:00 PM - 8:00 PM', start: '19:00', end: '20:00' },
      { time: '8:00 PM - 9:00 PM', start: '20:00', end: '21:00' },
      { time: '9:00 PM - 10:00 PM', start: '21:00', end: '22:00' },
    ]

    const slotsData = []
    
    // Add slots for today
    times.forEach((slot) => {
      slotsData.push({
        date: today,
        time: slot.time,
        startTime: slot.start,
        endTime: slot.end,
        totalSeats: 20,
        availableSeats: Math.floor(Math.random() * 15),
      })
    })

    // Add slots for tomorrow
    times.forEach((slot) => {
      slotsData.push({
        date: tomorrow,
        time: slot.time,
        startTime: slot.start,
        endTime: slot.end,
        totalSeats: 20,
        availableSeats: 20,
      })
    })

    await Slot.insertMany(slotsData)
    console.log(`✓ Created ${slotsData.length} gym slots`)
    console.log(`  Today (${today}): 4 slots`)
    console.log(`  Tomorrow (${tomorrow}): 4 slots\n`)

    console.log('✅ Database seeding completed successfully!\n')
    console.log('📍 You can now log in with:')
    console.log('   Admin: admin@college.edu / admin123')
    console.log('   Student: priya@college.edu / student123\n')

    process.exit(0)
  } catch (error) {
    console.error('✗ Seeding failed:', error.message)
    process.exit(1)
  }
}

// Run seeding
const runSeeding = async () => {
  await connectDB()
  await seedDatabase()
}

runSeeding()
