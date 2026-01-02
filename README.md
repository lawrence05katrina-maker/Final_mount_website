# Devasahayam Mount Shrine Website

A modern, responsive website for the Devasahayam Mount Shrine featuring donation management, prayer requests, mass bookings, and administrative capabilities.

## 🌟 Features

### Frontend
- **Homepage**: Beautiful carousel with church images and premium animations
- **Donations**: Secure donation system with multiple payment options
- **Prayer Requests**: Submit and manage prayer intentions
- **Mass Bookings**: Schedule mass bookings online
- **Gallery**: Photo and video gallery management
- **Testimonies**: User testimonials and experiences
- **Live Stream**: Integration for live masses and events
- **Contact**: Static location and contact information

### Admin Panel
- **Dashboard**: Overview of all activities
- **Donation Management**: Track and manage donations
- **Prayer Request Management**: Review and respond to prayers
- **Mass Booking Management**: Approve/reject booking requests
- **Gallery Management**: Upload and organize media
- **Testimony Management**: Moderate user testimonials
- **Announcement Management**: Create and manage announcements
- **Live Stream Management**: Control streaming settings

### Backend
- **RESTful API**: Node.js/Express backend
- **Database**: PostgreSQL for data persistence
- **Authentication**: Secure admin authentication
- **File Upload**: Image and video upload capabilities
- **Email Integration**: Automated notifications

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Router** for navigation
- **Sonner** for notifications

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** database
- **Multer** for file uploads
- **CORS** for cross-origin requests

### Deployment
- **Frontend**: Netlify
- **Backend**: Node.js hosting
- **Database**: PostgreSQL hosting

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devasahayam-mount-shrine-website
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Database Setup**
   - Create a PostgreSQL database
   - Run the SQL scripts in the database setup files
   - Update connection settings in backend/.env

5. **Environment Variables**
   
   **Backend (.env)**
   ```
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

6. **Start Development Servers**
   
   **Backend**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

## 📦 Build for Production

### Frontend Build
```bash
cd frontend
npm run build
```

### Backend Build
```bash
cd backend
npm run build
```

## 🌐 Deployment

### Netlify (Frontend)
1. Connect your GitHub repository to Netlify
2. Set build command: `cd frontend && npm run build`
3. Set publish directory: `frontend/dist`
4. Deploy

### Backend Deployment
- Deploy to your preferred Node.js hosting service
- Ensure PostgreSQL database is accessible
- Set environment variables

## 📁 Project Structure

```
devasahayam-mount-shrine-website/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── app/             # Main application components
│   │   ├── assets/          # Static assets (images, etc.)
│   │   └── api/             # API integration
│   ├── public/              # Public assets
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── src/                 # Source code
│   ├── uploads/             # File uploads
│   └── package.json
├── database/                # Database scripts and setup
└── README.md
```

## 🎨 Key Features Implemented

- ✅ **Homepage Carousel**: Automatic church image slideshow
- ✅ **Premium Animations**: Smooth entrance and hover effects
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Admin Authentication**: Secure admin access
- ✅ **File Management**: Image and video uploads
- ✅ **Database Integration**: PostgreSQL with proper schemas
- ✅ **Static Location**: Non-editable location information
- ✅ **Prayer Request System**: With beautiful animations
- ✅ **Donation Management**: Complete donation workflow

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact:
- Phone: +91 89037 60869
- Email: [Contact through the website]

---

**Built with ❤️ for the Devasahayam Mount Shrine Community**