# 🚀 DEPLOYMENT CHECKLIST

## Pre-Deployment Verification

### ✅ Files Ready
- [ ] `frontend-dist/` folder contains built React app
- [ ] `backend/` folder contains Node.js application
- [ ] `database/` folder contains SQL setup files
- [ ] All scripts are executable

### ✅ Server Requirements
- [ ] Web server (Nginx/Apache) installed
- [ ] Node.js (v18+) installed
- [ ] PostgreSQL installed
- [ ] PM2 installed (recommended)
- [ ] SSL certificate ready (optional but recommended)

---

## 🎯 DEPLOYMENT STEPS

### 1. Database Setup
```bash
# Create database and user
sudo -u postgres psql < deployment/database/setup.sql

# Import schema
sudo -u postgres psql shrine_db < deployment/database/schema.sql

# Add initial data
sudo -u postgres psql shrine_db < deployment/database/initial-data.sql
```

**Verify**: `sudo -u postgres psql shrine_db -c "\dt"`

### 2. Backend Deployment
```bash
# Copy backend files to server
cp -r deployment/backend/ /opt/shrine-backend/

# Install dependencies
cd /opt/shrine-backend/
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start with PM2
pm2 start src/server.js --name shrine-backend
pm2 save
pm2 startup
```

**Verify**: `curl http://localhost:5000/api/health`

### 3. Frontend Deployment
```bash
# Copy frontend files to web root
cp -r deployment/frontend-dist/* /var/www/devasahayammountshrine/

# Set permissions
chown -R www-data:www-data /var/www/devasahayammountshrine/
```

**Verify**: Visit your domain in browser

### 4. Web Server Configuration
```nginx
# Nginx configuration
server {
    server_name devasahayammountshrine.com www.devasahayammountshrine.com;
    root /var/www/devasahayammountshrine;
    index index.html;
    
    location / {
        try_files $uri /index.html;
    }
    
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

**Restart**: `sudo systemctl restart nginx`

---

## 🔐 SECURITY SETUP

### 1. Change Default Passwords
- [ ] Change database user password
- [ ] Change admin login (username: admin, password: admin123)
- [ ] Update JWT_SECRET in .env

### 2. SSL Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d devasahayammountshrine.com -d www.devasahayammountshrine.com
```

### 3. Firewall Setup
```bash
# Allow necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

---

## 🧪 TESTING

### Frontend Tests
- [ ] Website loads correctly
- [ ] Navigation works
- [ ] Forms submit properly
- [ ] Images display correctly
- [ ] Mobile responsive

### Backend Tests
- [ ] API endpoints respond
- [ ] Database connections work
- [ ] File uploads function
- [ ] Admin login works

### Integration Tests
- [ ] Frontend can communicate with backend
- [ ] Donations can be submitted
- [ ] Mass bookings work
- [ ] Admin panel accessible

---

## 📊 MONITORING

### Health Checks
```bash
# Backend status
pm2 status

# Database status
sudo systemctl status postgresql

# Web server status
sudo systemctl status nginx

# Disk space
df -h

# Memory usage
free -h
```

### Log Locations
- Backend logs: `pm2 logs shrine-backend`
- Nginx logs: `/var/log/nginx/`
- PostgreSQL logs: `/var/log/postgresql/`

---

## 🆘 TROUBLESHOOTING

### Common Issues

**Website not loading:**
- Check Nginx configuration
- Verify file permissions
- Check DNS settings

**API not working:**
- Verify backend is running: `pm2 status`
- Check database connection
- Review backend logs: `pm2 logs shrine-backend`

**Database errors:**
- Check PostgreSQL status: `sudo systemctl status postgresql`
- Verify credentials in .env
- Test connection: `sudo -u postgres psql shrine_db`

**File upload issues:**
- Check upload directory permissions
- Verify disk space: `df -h`
- Review backend logs for errors

---

## 📞 SUPPORT CONTACTS

- **Technical Issues**: Contact development team
- **Server Issues**: Contact hosting provider
- **Domain Issues**: Contact domain registrar

---

## ✅ POST-DEPLOYMENT

### Final Verification
- [ ] Website accessible via domain
- [ ] HTTPS working (if SSL configured)
- [ ] Admin panel login successful
- [ ] All forms working
- [ ] Database operations successful
- [ ] Backup system configured

### Documentation
- [ ] Server credentials documented
- [ ] Admin credentials shared securely
- [ ] Backup procedures documented
- [ ] Monitoring setup completed

---

**🎉 Deployment Complete!**

Your Devasahayam Mount Shrine website is now live and ready to serve your community.