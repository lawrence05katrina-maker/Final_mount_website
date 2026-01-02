# Database Setup Guide

## PostgreSQL Database Setup for Devasahayam Mount Shrine Website

### Prerequisites
- PostgreSQL 12 or higher
- Database admin access

### Setup Instructions

1. **Create Database**
   ```sql
   CREATE DATABASE devasahayam_shrine;
   ```

2. **Run Setup Script**
   ```bash
   psql -U your_username -d devasahayam_shrine -f setup.sql
   ```

3. **Update Backend Environment**
   Create `backend/.env` file:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/devasahayam_shrine
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   ```

### Tables Created

- **admins** - Admin user accounts
- **announcements** - Site announcements
- **contact_messages** - Contact form submissions
- **donations** - Donation records
- **gallery** - Photo and video gallery
- **livestream** - Live stream settings
- **mass_bookings** - Mass booking requests
- **prayer_requests** - Prayer submissions
- **testimonies** - User testimonials

### Default Admin Account

- **Username**: `admin`
- **Password**: `admin123` (⚠️ **CHANGE THIS IMMEDIATELY**)

### Security Notes

1. **Change default admin password** immediately after setup
2. **Use strong JWT secret** in production
3. **Set up proper database user** with limited permissions
4. **Enable SSL** for database connections in production
5. **Regular backups** are recommended

### Production Deployment

For production deployment:

1. **Use environment variables** for all sensitive data
2. **Set up database connection pooling**
3. **Configure proper backup strategy**
4. **Monitor database performance**
5. **Set up SSL certificates**

### Backup Command

```bash
pg_dump -U username -d devasahayam_shrine > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Command

```bash
psql -U username -d devasahayam_shrine < backup_file.sql
```