# Server Setup Guide

## Step 1: Create DigitalOcean Droplet

### 1.1 Sign up for DigitalOcean
- Visit [DigitalOcean](https://www.digitalocean.com)
- Create account with church email
- Verify email and add payment method

### 1.2 Create Droplet
```bash
# Droplet Configuration:
- Image: Ubuntu 22.04 LTS
- Plan: Basic ($4/month)
- CPU: 1 vCPU
- Memory: 1GB RAM
- Storage: 25GB SSD
- Region: Choose closest to India (Bangalore/Singapore)
- Authentication: SSH Key (recommended) or Password
```

### 1.3 Initial Server Setup
```bash
# Connect to server
ssh root@your_server_ip

# Update system
apt update && apt upgrade -y

# Create non-root user
adduser church
usermod -aG sudo church

# Setup firewall
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable

# Switch to church user
su - church
```

## Step 2: Install Required Software

### 2.1 Install Node.js
```bash
# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2.2 Install PostgreSQL
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database user
sudo -u postgres createuser --interactive
# Enter: church
# Superuser: y

sudo -u postgres createdb church_website
```

### 2.3 Install PM2
```bash
# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 startup
pm2 startup
# Follow the displayed command
```

### 2.4 Install Nginx
```bash
# Install Nginx
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 3: Security Configuration

### 3.1 Configure SSH (if using password)
```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Add/modify these lines:
PermitRootLogin no
PasswordAuthentication yes
PubkeyAuthentication yes

# Restart SSH
sudo systemctl restart ssh
```

### 3.2 Setup Fail2Ban
```bash
# Install Fail2Ban
sudo apt install fail2ban -y

# Create jail configuration
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Start Fail2Ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

## Next Steps
Continue with [Database Setup](./02-database-setup.md)