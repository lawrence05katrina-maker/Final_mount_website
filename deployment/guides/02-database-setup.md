# Database Setup Guide

## Step 1: PostgreSQL Configuration

### 1.1 Secure PostgreSQL Installation
```bash
# Set password for postgres user
sudo -u postgres psql
\password postgres
# Enter a strong password
\q

# Set password for church user
sudo -u postgres psql
\password church
# Enter a strong password
\q
```

### 1.2 Create Application Database
```bash
# Connect as church user
psql -U church -d postgres

# Create database
CREATE DATABASE church_website;

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE church_website TO church;

# Exit
\q
```

### 1.3 Configure PostgreSQL Security
```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/14/main/postgresql.conf

# Find and modify:
listen_addresses = 'localhost'
port = 5432

# Edit authentication
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Ensure these lines exist:
local   all             postgres                                peer
local   all             church                                  md5
host    church_website  church          127.0.0.1/32           md5
```

### 1.4 Restart PostgreSQL
```bash
sudo systemctl restart postgresql
```

## Step 2: Database Schema Setup

### 2.1 Create Schema File
```bash
# Create database directory
mkdir -p /home/church/church-website/database

# Create schema file
nano /home/church/church-website/database/schema.sql
```

### 2.2 Schema Content
```sql
-- Copy your existing schema.sql content here
-- This should include all tables for:
-- - Users/Authentication
-- - Announcements
-- - Management team
-- - Mass bookings
-- - Donations
-- - Prayer requests
-- - Gallery/Media
```

### 2.3 Import Schema
```bash
# Import schema
psql -U church -d church_website -f /home/church/church-website/database/schema.sql
```

## Step 3: Backup Configuration

### 3.1 Create Backup Script
```bash
# Create backup directory
mkdir -p /home/church/backups

# Create backup script
nano /home/church/backup-db.sh
```

### 3.2 Backup Script Content
```bash
#!/bin/bash

# Database backup script
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/church/backups"
DB_NAME="church_website"
DB_USER="church"

# Create backup
pg_dump -U $DB_USER -h localhost $DB_NAME > $BACKUP_DIR/church_website_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/church_website_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "church_website_*.sql.gz" -mtime +7 -delete

echo "Backup completed: church_website_$DATE.sql.gz"
```

### 3.3 Make Script Executable and Schedule
```bash
# Make executable
chmod +x /home/church/backup-db.sh

# Test backup
./backup-db.sh

# Schedule daily backups
crontab -e

# Add this line for daily backup at 2 AM:
0 2 * * * /home/church/backup-db.sh >> /home/church/backup.log 2>&1
```

## Step 4: Database Environment Configuration

### 4.1 Create Database Environment File
```bash
# Create .env file for database
nano /home/church/church-website/.env.database
```

### 4.2 Environment Variables
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=church_website
DB_USER=church
DB_PASSWORD=your_secure_password_here

# Backup Configuration
BACKUP_RETENTION_DAYS=7
BACKUP_SCHEDULE="0 2 * * *"
```

## Security Notes

1. **Never expose PostgreSQL to the internet**
2. **Use strong passwords for all database users**
3. **Regular backups are automated**
4. **Monitor backup logs regularly**

## Next Steps
Continue with [Backend Deployment](./03-backend-deployment.md)