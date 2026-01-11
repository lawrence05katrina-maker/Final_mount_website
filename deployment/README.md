# 🏛️ DEVASAHAYAM MOUNT SHRINE - DEPLOYMENT GUIDE

## 📋 DEPLOYMENT OVERVIEW

This guide provides step-by-step instructions for deploying the Devasahayam Mount Shrine website.

**Technology Stack:**
- Frontend: React (Vite) → Static files in `dist/`
- Backend: Node.js + Express
- Database: PostgreSQL
- Videos: Server-hosted (existing infrastructure)

---

## 🚀 QUICK DEPLOYMENT CHECKLIST

### ✅ What You'll Deploy:
1. **Frontend**: `frontend-dist/` folder → Web server
2. **Backend**: `backend/` folder → Node.js server
3. **Database**: `database/` folder → PostgreSQL setup

### ✅ What Church Needs:
- Web server (Nginx/Apache)
- Node.js runtime
- PostgreSQL database
- PM2 (recommended for backend)

---

## 📁 DEPLOYMENT PACKAGE STRUCTURE

```
deployment/
├── README.md                    # This guide
├── frontend-dist/              # Built React app (ready to serve)
├── backend/                    # Node.js backend
├── database/                   # Database setup files
└── scripts/                    # Deployment helper scripts
```

---

## 1️⃣ FRONTEND DEPLOYMENT

### Step 1: Upload Frontend Files
Copy the entire `frontend-dist/` folder to your web server:

```bash
# Server location
/var/www/devasahayammountshrine/
```

### Step 2: Nginx Configuration
```nginx
server {
    server_name devasahayammountshrine.com www.devasahayammountshrine.com;
    root /var/www/devasahayammountshrine;
    index index.html;
    
    location / {
        try_files $uri /index.html;
    }
    
    # Optional: Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 3: Restart Web Server
```bash
sudo systemctl restart nginx
```

---

## 2️⃣ DATABASE DEPLOYMENT

### Step 1: Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Step 2: Create Database
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE shrine_db;
CREATE USER shrine_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE shrine_db TO shrine_user;
\q
```

### Step 3: Import Database Schema
```bash
# Import the schema
sudo -u postgres psql shrine_db < database/schema.sql

# Verify tables were created
sudo -u postgres psql shrine_db -c "\dt"
```

---

## 3️⃣ BACKEND DEPLOYMENT

### Step 1: Install Node.js
```bash
# Install Node.js (version 18 or higher)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 2: Setup Backend
```bash
# Navigate to backend folder
cd backend/

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Step 3: Configure Environment
Edit `backend/.env`:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shrine_db
DB_USER=shrine_user
DB_PASSWORD=your_secure_password

# Server Configuration
PORT=5000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Admin Configuration
ADMIN_SESSION_TIMEOUT=24h
```

### Step 4: Install PM2 (Process Manager)
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the backend
pm2 start src/server.js --name shrine-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Step 5: Verify Backend
```bash
# Check if backend is running
pm2 status

# View logs
pm2 logs shrine-backend

# Test API endpoint
curl http://localhost:5000/api/health
```

---

## 4️⃣ VIDEO HANDLING

### Current Setup (Recommended)
Videos should remain in your existing server structure:
```
/var/www/devasahayammountshrine/videos/
├── shrine-video1.mp4
├── shrine-video2.mp4
└── ...
```

### Frontend Video URLs
Videos are referenced directly in the frontend:
```html
<video src="https://devasahayammountshrine.com/videos/shrine-video1.mp4" controls>
```

**❌ Do NOT put videos inside React dist folder**
**✅ Keep videos in separate server directory**

---

## 5️⃣ SSL CERTIFICATE (HTTPS)

### Using Certbot (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d devasahayammountshrine.com -d www.devasahayammountshrine.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 6️⃣ ADMIN SETUP

### Create First Admin User
```bash
# Connect to database
sudo -u postgres psql shrine_db

# Insert admin user (password: admin123 - CHANGE THIS!)
INSERT INTO admins (username, password, email, role) 
VALUES ('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@devasahayammountshrine.com', 'admin');
```

**⚠️ IMPORTANT: Change the default password after first login!**

---

## 7️⃣ MONITORING & MAINTENANCE

### Check System Status
```bash
# Check web server
sudo systemctl status nginx

# Check database
sudo systemctl status postgresql

# Check backend
pm2 status

# View backend logs
pm2 logs shrine-backend
```

### Backup Database
```bash
# Create backup
sudo -u postgres pg_dump shrine_db > backup_$(date +%Y%m%d).sql

# Restore from backup
sudo -u postgres psql shrine_db < backup_20240111.sql
```

---

## 🆘 TROUBLESHOOTING

### Common Issues

**Frontend not loading:**
- Check Nginx configuration
- Verify file permissions: `sudo chown -R www-data:www-data /var/www/devasahayammountshrine/`

**Backend not starting:**
- Check environment variables in `.env`
- Verify database connection
- Check PM2 logs: `pm2 logs shrine-backend`

**Database connection failed:**
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check database credentials in `.env`
- Test connection: `sudo -u postgres psql shrine_db`

**API requests failing:**
- Check if backend is running on port 5000
- Verify Nginx proxy configuration
- Check firewall settings

---

## 📞 SUPPORT

For technical support or questions about this deployment:
- Check logs first: `pm2 logs shrine-backend`
- Verify all services are running
- Contact your development team with specific error messages

---

## 🔒 SECURITY NOTES

1. **Change default passwords** immediately after deployment
2. **Use strong JWT secrets** in production
3. **Enable firewall** and close unnecessary ports
4. **Regular backups** of database and uploaded files
5. **Keep system updated** with security patches

---

**Deployment completed successfully! 🎉**

Your Devasahayam Mount Shrine website should now be live and accessible.