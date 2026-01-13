# Backend Deployment Guide

## Step 1: Prepare Backend Code

### 1.1 Create Application Directory
```bash
# Create application directory
mkdir -p /home/church/church-website
cd /home/church/church-website

# Clone or upload your backend code
# If using Git:
git clone <your-repository-url> .
# Or upload files via SCP/SFTP
```

### 1.2 Install Dependencies
```bash
# Navigate to backend directory
cd backend

# Install production dependencies
npm ci --only=production
```

## Step 2: Environment Configuration

### 2.1 Create Production Environment File
```bash
# Create production environment file
cp .env.example .env.production
nano .env.production
```

### 2.2 Production Environment Variables
```env
# Server Configuration
NODE_ENV=production
PORT=3000
HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=church_website
DB_USER=church
DB_PASSWORD=your_secure_database_password

# JWT Configuration
JWT_SECRET=your_very_long_random_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# File Upload Configuration
UPLOAD_DIR=/home/church/church-website/uploads
MAX_FILE_SIZE=10485760

# CORS Configuration
FRONTEND_URL=https://your-domain.com
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Email Configuration (if using)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-church-email@gmail.com
SMTP_PASS=your-app-password

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### 2.3 Create Uploads Directory
```bash
# Create uploads directory with proper permissions
mkdir -p /home/church/church-website/uploads
chmod 755 /home/church/church-website/uploads
```

## Step 3: PM2 Configuration

### 3.1 Create PM2 Ecosystem File
```bash
# Create PM2 configuration
nano /home/church/church-website/ecosystem.config.js
```

### 3.2 PM2 Configuration Content
```javascript
module.exports = {
  apps: [{
    name: 'church-website-api',
    script: './backend/src/index.js',
    cwd: '/home/church/church-website',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_file: '/home/church/church-website/backend/.env.production',
    log_file: '/home/church/logs/church-api.log',
    error_file: '/home/church/logs/church-api-error.log',
    out_file: '/home/church/logs/church-api-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '500M',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s',
    watch: false,
    ignore_watch: ['node_modules', 'uploads', 'logs'],
    autorestart: true
  }]
};
```

### 3.3 Create Logs Directory
```bash
# Create logs directory
mkdir -p /home/church/logs
```

## Step 4: Start Backend Application

### 4.1 Start with PM2
```bash
# Navigate to application directory
cd /home/church/church-website

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Check status
pm2 status
pm2 logs church-website-api
```

### 4.2 Test Backend
```bash
# Test API endpoint
curl http://localhost:3000/api/health

# Expected response:
# {"status":"ok","timestamp":"..."}
```

## Step 5: Nginx Reverse Proxy Configuration

### 5.1 Create Nginx Configuration
```bash
# Create site configuration
sudo nano /etc/nginx/sites-available/church-website
```

### 5.2 Nginx Configuration Content
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # API routes
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Uploads (served directly by Nginx)
    location /uploads/ {
        alias /home/church/church-website/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Frontend static files (will be configured later)
    location / {
        root /home/church/church-website/frontend/dist;
        try_files $uri $uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
}
```

### 5.3 Enable Site
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/church-website /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 6: Backend Security

### 6.1 Create Systemd Service (Alternative to PM2)
```bash
# Create systemd service file
sudo nano /etc/systemd/system/church-website.service
```

### 6.2 Service Configuration
```ini
[Unit]
Description=Church Website API
After=network.target postgresql.service

[Service]
Type=simple
User=church
WorkingDirectory=/home/church/church-website/backend
Environment=NODE_ENV=production
EnvironmentFile=/home/church/church-website/backend/.env.production
ExecStart=/usr/bin/node src/index.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=church-website

[Install]
WantedBy=multi-user.target
```

### 6.3 Enable Service (Optional - use either PM2 or systemd)
```bash
# If you prefer systemd over PM2:
sudo systemctl daemon-reload
sudo systemctl enable church-website
sudo systemctl start church-website
sudo systemctl status church-website
```

## Step 7: Monitoring and Logs

### 7.1 PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs church-website-api

# Restart if needed
pm2 restart church-website-api
```

### 7.2 Log Rotation
```bash
# Setup log rotation
sudo nano /etc/logrotate.d/church-website
```

### 7.3 Log Rotation Configuration
```
/home/church/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 644 church church
    postrotate
        pm2 reloadLogs
    endscript
}
```

## Next Steps
Continue with [Frontend Deployment](./04-frontend-deployment.md)