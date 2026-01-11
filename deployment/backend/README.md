# Backend Deployment Guide

## Setup Instructions

1. **Install Node.js** (version 18 or higher)
2. **Install dependencies**: `npm install`
3. **Configure environment**: Copy `.env.example` to `.env` and update values
4. **Start server**: `npm start`

## Production Deployment

Use PM2 for production deployment:

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start src/server.js --name shrine-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## Environment Variables

Required environment variables in `.env` file:

- **DB_HOST**: Database host (localhost)
- **DB_PORT**: Database port (5432)
- **DB_NAME**: Database name (shrine_db)
- **DB_USER**: Database user (shrine_user)
- **DB_PASSWORD**: Database password
- **PORT**: Server port (5000)
- **JWT_SECRET**: JWT secret key for authentication

## API Endpoints

The backend provides REST API endpoints for:

- `/api/admin` - Admin authentication and management
- `/api/donations` - Donation management
- `/api/mass-bookings` - Mass booking system
- `/api/gallery` - Gallery management
- `/api/testimonies` - Testimony management
- `/api/announcements` - Announcement management
- `/api/contact` - Contact form submissions
- `/api/prayers` - Prayer request management

## File Uploads

Upload directories are created automatically:
- `uploads/donations/` - Donation payment screenshots
- `uploads/gallery/` - Gallery images
- `uploads/management/` - Management/staff photos
- `uploads/payments/` - Payment verification screenshots

## Health Check

Test if the backend is running:
```bash
curl http://localhost:5000/api/health
```

## Troubleshooting

1. **Database connection issues**: Check PostgreSQL is running and credentials are correct
2. **Port already in use**: Change PORT in .env file
3. **File upload issues**: Ensure upload directories have write permissions
4. **JWT errors**: Verify JWT_SECRET is set in .env file