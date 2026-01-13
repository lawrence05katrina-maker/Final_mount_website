# Frontend Deployment Guide

## Step 1: Prepare Frontend Build

### 1.1 Local Build Preparation
```bash
# On your local machine, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create production environment file
cp .env.example .env.production
```

### 1.2 Production Environment Variables
```env
# API Configuration
VITE_API_BASE_URL=https://your-domain.com/api
VITE_API_TIMEOUT=30000

# Media Configuration
VITE_MEDIA_BASE_URL=https://your-domain.com
VITE_CDN_BASE_URL=https://media.your-domain.com

# Application Configuration
VITE_APP_NAME=St. Devasahayam Mount Shrine
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production

# Analytics (if using)
VITE_GA_TRACKING_ID=your-google-analytics-id

# Features
VITE_ENABLE_PWA=true
VITE_ENABLE_OFFLINE=true
```

### 1.3 Build for Production
```bash
# Build the application
npm run build

# Verify build
ls -la dist/
```

## Step 2: Deploy to Server

### 2.1 Upload Build Files
```bash
# Create frontend directory on server
ssh church@your-server-ip
mkdir -p /home/church/church-website/frontend

# From local machine, upload build files
scp -r dist/* church@your-server-ip:/home/church/church-website/frontend/

# Or use rsync for better performance
rsync -avz --delete dist/ church@your-server-ip:/home/church/church-website/frontend/
```

### 2.2 Set Proper Permissions
```bash
# On server, set permissions
sudo chown -R church:church /home/church/church-website/frontend
sudo chmod -R 755 /home/church/church-website/frontend
```

## Step 3: Nginx Configuration for Frontend

### 3.1 Update Nginx Configuration
```bash
# Edit the existing Nginx configuration
sudo nano /etc/nginx/sites-available/church-website
```

### 3.2 Enhanced Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Root directory for static files
    root /home/church/church-website/frontend;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval'" always;

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
        application/json
        image/svg+xml;

    # API routes (proxy to backend)
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
        
        # CORS headers for API
        add_header Access-Control-Allow-Origin "https://your-domain.com" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
    }

    # Uploads (served directly by Nginx)
    location /uploads/ {
        alias /home/church/church-website/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
        
        # Handle CORS for uploaded files
        add_header Access-Control-Allow-Origin "https://your-domain.com" always;
    }

    # Static assets with long cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
        
        # Handle missing files gracefully
        try_files $uri =404;
    }

    # Handle React Router (SPA)
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache HTML files for shorter time
        location ~* \.html$ {
            expires 1h;
            add_header Cache-Control "public, must-revalidate";
        }
    }

    # Security: Block access to sensitive files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ ~$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

### 3.3 Test and Reload Nginx
```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Step 4: PWA Configuration

### 4.1 Service Worker Setup
```bash
# Ensure service worker is properly served
# Add to Nginx configuration if needed
location /sw.js {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}

location /manifest.json {
    add_header Cache-Control "public, max-age=86400";
}
```

## Step 5: Performance Optimization

### 5.1 Enable Brotli Compression (Optional)
```bash
# Install Nginx Brotli module
sudo apt install nginx-module-brotli -y

# Add to Nginx main configuration
sudo nano /etc/nginx/nginx.conf
```

### 5.2 Brotli Configuration
```nginx
# Add to http block in nginx.conf
load_module modules/ngx_http_brotli_filter_module.so;
load_module modules/ngx_http_brotli_static_module.so;

http {
    # Existing configuration...
    
    # Brotli compression
    brotli on;
    brotli_comp_level 6;
    brotli_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
}
```

## Step 6: Automated Deployment Script

### 6.1 Create Deployment Script
```bash
# Create deployment script on server
nano /home/church/deploy-frontend.sh
```

### 6.2 Deployment Script Content
```bash
#!/bin/bash

# Frontend deployment script
set -e

FRONTEND_DIR="/home/church/church-website/frontend"
BACKUP_DIR="/home/church/backups/frontend"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo "Starting frontend deployment..."

# Create backup of current version
if [ -d "$FRONTEND_DIR" ]; then
    echo "Creating backup..."
    mkdir -p "$BACKUP_DIR"
    cp -r "$FRONTEND_DIR" "$BACKUP_DIR/frontend_$TIMESTAMP"
fi

# Deploy new version
echo "Deploying new version..."
# This assumes you've uploaded new files to a staging directory
# rsync -av --delete /home/church/staging/frontend/ $FRONTEND_DIR/

# Set permissions
chown -R church:church $FRONTEND_DIR
chmod -R 755 $FRONTEND_DIR

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Cleanup old backups (keep last 5)
find $BACKUP_DIR -name "frontend_*" -type d | sort -r | tail -n +6 | xargs rm -rf

echo "Frontend deployment completed successfully!"
echo "Backup created: frontend_$TIMESTAMP"
```

### 6.3 Make Script Executable
```bash
chmod +x /home/church/deploy-frontend.sh
```

## Step 7: Testing Frontend

### 7.1 Basic Functionality Test
```bash
# Test homepage
curl -I http://your-server-ip/

# Test API connectivity
curl http://your-server-ip/api/health

# Test static assets
curl -I http://your-server-ip/assets/index.css
```

### 7.2 Browser Testing Checklist
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] API calls succeed
- [ ] Images load properly
- [ ] Mobile responsiveness
- [ ] PWA installation prompt
- [ ] Offline functionality (if enabled)

## Step 8: Performance Monitoring

### 8.1 Setup Access Logs Analysis
```bash
# Create log analysis script
nano /home/church/analyze-logs.sh
```

### 8.2 Log Analysis Script
```bash
#!/bin/bash

# Analyze Nginx access logs
LOG_FILE="/var/log/nginx/access.log"

echo "=== Top 10 Most Requested Pages ==="
awk '{print $7}' $LOG_FILE | sort | uniq -c | sort -nr | head -10

echo "=== Response Codes Summary ==="
awk '{print $9}' $LOG_FILE | sort | uniq -c | sort -nr

echo "=== Top User Agents ==="
awk -F'"' '{print $6}' $LOG_FILE | sort | uniq -c | sort -nr | head -10
```

## Next Steps
Continue with [Media Storage Setup](./05-media-storage.md)