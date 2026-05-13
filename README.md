# 🏋️ FitSlot - College Gym Slot Booking System

A modern, production-ready MERN stack application for smart gym slot management and booking. Designed with premium UI/UX similar to leading SaaS products.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue)

## 🎨 Features

### For Students
- ✨ Beautiful dashboard with real-time slot availability
- 📅 Easy slot booking with capacity management
- ✅ Attendance tracking and history
- 📊 Personal statistics and booking insights
- 🔔 Real-time notifications
- 📱 Fully responsive mobile design

### For Admins
- 🎛️ Complete gym slot management
- 👥 User management and monitoring
- 📈 Analytics and reporting
- ⚙️ System settings and configuration
- 📊 Attendance management

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Smooth animations
- **Zustand** - State management
- **Axios** - HTTP client
- **React Router** - Navigation
- **Lucide React** - Modern icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## 📁 Project Structure

```
FitSlot/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── shared/          # Shared components (Navbar, Toast, etc.)
│   │   │   ├── landing/         # Landing page components
│   │   │   └── dashboard/       # Dashboard components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   ├── context/             # Zustand stores
│   │   ├── hooks/               # Custom hooks
│   │   ├── utils/               # Utility functions
│   │   ├── styles/              # CSS files
│   │   └── App.jsx              # Main app
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── index.html
│
└── backend/
    ├── src/
    │   ├── models/              # Mongoose schemas
    │   ├── controllers/         # Business logic
    │   ├── routes/              # API routes
    │   ├── middleware/          # Express middleware
    │   ├── config/              # Configuration files
    │   ├── utils/               # Utility functions
    │   └── index.js             # Entry point
    ├── package.json
    └── .env.example
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- MongoDB 5.0+
- Git

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/fitslot
# JWT_SECRET=your_secret_key_here
# PORT=5000

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # User login
GET    /api/auth/profile           # Get user profile (protected)
```

### Slots
```
GET    /api/slots                  # Get all slots
GET    /api/slots/:id              # Get slot by ID
POST   /api/slots                  # Create slot (admin only)
PUT    /api/slots/:id              # Update slot (admin only)
DELETE /api/slots/:id              # Delete slot (admin only)
```

### Bookings
```
GET    /api/bookings               # Get bookings (user's or all for admin)
POST   /api/bookings               # Create booking
POST   /api/bookings/:id/cancel    # Cancel booking
```

### Attendance
```
POST   /api/attendance             # Mark attendance
GET    /api/attendance/stats       # Get attendance statistics
GET    /api/attendance             # Get all attendance (admin only)
```

### Users
```
GET    /api/users                  # Get all users (admin only)
GET    /api/users/:id              # Get user by ID (admin only)
PUT    /api/users/:id              # Update user
DELETE /api/users/:id              # Delete user (admin only)
```

## 🎨 UI/UX Highlights

### Design System
- **Color Scheme**: Dark modern theme with cyan primary color
- **Typography**: Professional with clear hierarchy
- **Spacing**: Generous padding and margins for premium feel
- **Components**: Glassmorphism cards, smooth gradients
- **Animations**: Framer Motion for polished transitions

### Page Components

#### Landing Page
- Hero section with animated background
- Features showcase with icons
- Statistics counters
- How it works step-by-step guide
- Testimonials section
- CTA section
- Footer

#### Auth Pages
- Centered glassmorphic cards
- Animated entrance effects
- Password visibility toggle
- Form validation
- Smooth transitions

#### Student Dashboard
- Welcome section with personalized greeting
- Statistics cards with gradient backgrounds
- Available slots grid with real-time updates
- Booking history table
- Quick stats sidebar
- Announcements section

#### Admin Dashboard
- Real-time analytics cards
- Today's slots management table
- User management with status badges
- Capacity utilization visualization
- Edit/Delete actions for each item

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ Protected routes and API endpoints
- ✅ Role-based access control
- ✅ CORS protection
- ✅ Input validation

## 📱 Responsive Design

The application is fully responsive across all devices:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 🖥️ Desktop (1024px+)
- 🖥️ Large screens (1280px+)

## 🔄 Data Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'student' | 'admin',
  attendance: Number,
  bookings: [ObjectId],
  isActive: Boolean,
  timestamps: true
}
```

### Slot Schema
```javascript
{
  date: String,
  time: String,
  startTime: String,
  endTime: String,
  totalSeats: Number,
  availableSeats: Number,
  bookings: [ObjectId],
  isActive: Boolean,
  timestamps: true
}
```

### Booking Schema
```javascript
{
  user: ObjectId,
  slot: ObjectId,
  date: String,
  time: String,
  status: 'confirmed' | 'cancelled' | 'completed',
  bookedAt: Date,
  cancelledAt: Date,
  timestamps: true
}
```

### Attendance Schema
```javascript
{
  user: ObjectId,
  booking: ObjectId,
  date: String,
  time: String,
  checkInTime: Date,
  checkOutTime: Date,
  duration: Number,
  timestamps: true
}
```

## 🧪 Testing the Application

### Test Admin Account
- Email: `admin@college.edu`
- Password: `admin123`

### Test Student Account
- Email: `student@college.edu`
- Password: `student123`

## 📦 Build for Production

### Frontend Build
```bash
cd frontend
npm run build
npm run preview
```

### Backend Deployment
```bash
cd backend
npm install --production
npm start
```

## 🔧 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/fitslot
JWT_SECRET=your_secret_key_change_in_production
PORT=5000
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=https://api.fitslot.com/api
VITE_ENV=production
```

## 📝 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🚀 Deployment Guidelines

### Vercel (Frontend)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Heroku/Railway (Backend)
1. Add Procfile: `web: npm start`
2. Connect MongoDB Atlas
3. Set environment variables
4. Deploy

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

## 📄 License

MIT License - feel free to use this project

## 📧 Support

For support, email support@fitslot.com or open an issue in the repository.

## 🙏 Acknowledgments

- Inspired by modern SaaS design (Linear, Vercel, Stripe)
- Built with love for campus fitness enthusiasts
- Thanks to the open-source community

---

**Built with ❤️ for smarter gym management**
