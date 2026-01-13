# 🏛️ Devasahayam Mount Shrine Website

A modern, responsive website for Devasahayam Mount Shrine built with React and Node.js, featuring donation management, mass booking system, gallery, testimonies, and admin panel.

## 🌟 Features

### Public Features
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Multilingual Support** - English and Tamil language options
- **Online Donations** - Secure donation system with UPI integration
- **Mass Booking** - Online mass intention booking system
- **Gallery** - Beautiful image gallery with categories
- **Testimonies** - Community testimonials and experiences
- **Live Streaming** - Integration with YouTube live streams
- **Contact Forms** - Contact and prayer request submissions
- **Announcements** - Latest news and updates

### Admin Features
- **Admin Dashboard** - Complete content management system
- **Donation Management** - Track and verify donations
- **Mass Booking Management** - Manage mass intentions and bookings
- **Gallery Management** - Upload and organize images
- **Testimony Moderation** - Approve and manage testimonies
- **Content Management** - Manage announcements and content
- **User Management** - Admin user management

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **Axios** for API communication

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **JWT** authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests

### Database
- **PostgreSQL** with comprehensive schema
- **Indexes** for performance optimization
- **Triggers** for automatic timestamp updates
- **Views** for reporting and analytics

## 📁 Project Structure

```
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Reusable components
│   │   │   ├── pages/        # Page components
│   │   │   ├── context/      # React context providers
│   │   │   └── App.tsx       # Main app component
│   │   └── styles/           # CSS styles
│   ├── public/               # Static assets
│   └── package.json
│
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Custom middleware
│   │   ├── db/               # Database configuration
│   │   └── server.js         # Server entry point
│   ├── uploads/              # File upload directory
│   └── package.json
│
├── database/                 # Database schema and setup
│   ├── schema.sql            # Complete database schema
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/lawrence05katrina-maker/Devashayam_website.git
   cd Devashayam_website
   ```

2. **Setup Database**
   ```bash
   # Create PostgreSQL database
   createdb shrine_db
   
   # Import schema
   psql shrine_db < database/schema.sql
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Start backend
   npm run dev
   ```

4. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   
   # Start frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🏗️ Production Deployment

For production deployment, use the prepared deployment package:

1. **Build deployment package**
   ```bash
   # Run the deployment script (Windows)
   deployment/scripts/deploy-all.bat
   
   # Or manually build
   cd frontend && npm run build
   ```

2. **Follow deployment guide**
   - See `deployment/README.md` for detailed instructions
   - Use `deployment/DEPLOYMENT-CHECKLIST.md` for step-by-step deployment

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shrine_db
DB_USER=shrine_user
DB_PASSWORD=your_password
PORT=5000
JWT_SECRET=your_jwt_secret
```

### Default Admin Credentials
- Username: `admin`
- Password: `admin123`
- **⚠️ Change these immediately after deployment!**

## 📱 Features Overview

### For Visitors
- Browse shrine information and history
- View gallery and testimonies
- Make online donations securely
- Book mass intentions online
- Submit prayer requests
- Watch live streams
- Contact the shrine

### For Administrators
- Manage all content through admin panel
- Verify and track donations
- Process mass booking requests
- Upload and organize gallery images
- Moderate and approve testimonies
- Manage announcements and news
- View analytics and reports

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- SQL injection protection
- File upload validation
- CORS configuration
- Environment variable protection
- Admin session management

## 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with:
- **13 main tables** for different functionalities
- **Indexes** for optimal performance
- **Triggers** for automatic updates
- **Views** for reporting
- **Foreign key constraints** for data integrity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the deployment documentation

## 🙏 Acknowledgments

- Built for Devasahayam Mount Shrine community
- Thanks to all contributors and testers
- Special thanks to the shrine administration for their guidance

---

**Made with ❤️ for the Devasahayam Mount Shrine community**
