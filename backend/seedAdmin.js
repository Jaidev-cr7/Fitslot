import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { User } from './src/models/User.js'
import bcrypt from 'bcryptjs'

dotenv.config()

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB for seeding admin...')

    const email = 'admin@gmail.com'
    const password = 'password123'
    
    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    let admin = await User.findOne({ email })
    if (admin) {
      admin.password = hashedPassword
      admin.role = 'admin'
      await admin.save()
      console.log('Admin user updated.')
    } else {
      admin = new User({
        name: 'Gym Admin',
        email,
        password: hashedPassword,
        role: 'admin',
      })
      await admin.save()
      console.log('Admin user created.')
    }

    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    process.exit(0)
  } catch (error) {
    console.error('Error seeding admin:', error)
    process.exit(1)
  }
}

seedAdmin()
