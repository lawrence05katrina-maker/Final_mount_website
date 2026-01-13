# 🗄️ How to Create a PostgreSQL Database on Render

## 📋 Overview

Render provides managed PostgreSQL databases that are perfect for hosting your backend application. This guide will walk you through creating and configuring a PostgreSQL database on Render.

---

## 🚀 Step-by-Step Database Creation

### Step 1: Sign Up / Log In to Render

1. **Visit Render**: Go to https://render.com
2. **Create Account**: Sign up with GitHub, GitLab, or email
3. **Verify Email**: Check your email and verify your account

### Step 2: Create a New PostgreSQL Database

1. **Access Dashboard**: After logging in, you'll see the Render dashboard
2. **Click "New +"**: In the top right corner
3. **Select "PostgreSQL"**: From the dropdown menu

### Step 3: Configure Database Settings

#### **Database Configuration:**
```
Name: shrine-database
Database: shrine_db
User: shrine_user
Region: Choose closest to your users (e.g., Oregon, Frankfurt, Singapore)
PostgreSQL Version: 15 (recommended)
Plan: Free (for development) or Starter ($7/month for production)
```

#### **Important Settings:**
- **Database Name**: `shrine_db` (must match your backend .env file)
- **User**: `shrine_user` (or keep default)
- **Region**: Choose the same region where you'll deploy your backend
- **Plan**: 
  - **Free**: Good for development/testing (limited storage, sleeps after inactivity)
  - **Starter ($7/month)**: Recommended for production (persistent, better performance)

### Step 4: Create the Database

1. **Click "Create Database"**
2. **Wait for Provisioning**: This takes 2-3 minutes
3. **Database Status**: Will show "Available" when ready

---

## 🔗 Get Database Connection Details

### Step 1: Access Database Info

1. **Go to Dashboard**: Click on your database name
2. **Find Connection Info**: Scroll down to "Connections" section

### Step 2: Copy Connection Details

You'll see information like this:

```
Hostname: dpg-xxxxxxxxx-a.oregon-postgres.render.com
Port: 5432
Database: shrine_db
Username: shrine_user
Password: [auto-generated password]
```

### Step 3: Get Connection String

Render provides different connection formats:

#### **Internal Connection String** (for Render services):
```
postgresql://shrine_user:password@dpg-xxxxxxxxx-a:5432/shrine_db
```

#### **External Connection String** (for local development):
```
postgresql://shrine_user:password@dpg-xxxxxxxxx-a.oregon-postgres.render.com:5432/shrine_db
```

---

## ⚙️ Configure Your Backend

### Step 1: Update Environment Variables

Update your `.env` file with Render database credentials:

```env
# Render PostgreSQL Database Configuration
DB_HOST=dpg-xxxxxxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=shrine_db
DB_USER=shrine_user
DB_PASSWORD=your_generated_password_here

# Alternative: Use full connection string
DATABASE_URL=postgresql://shrine_user:password@dpg-xxxxxxxxx-a.oregon-postgres.render.com:5432/shrine_db

# JWT Configuration (keep as is)
JWT_SECRET=shrine_jwt_secret_key_2024_devasahayam_mount_secure_token
JWT_EXPIRES_IN=24h

# Admin Configuration (keep as is)
ADMIN_SESSION_TIMEOUT=24h
```

### Step 2: Update Database Connection Code

If using connection string, update your `src/db/db.js`:

```javascript
const { Pool } = require('pg');
require('dotenv').config();

// Use DATABASE_URL if available (Render style), otherwise use individual variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
  port: process.env.DATABASE_URL ? undefined : process.env.DB_PORT,
  database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME,
  user: process.env.DATABASE_URL ? undefined : process.env.DB_USER,
  password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = pool;
```

---

## 🛠️ Set Up Database Schema

### Method 1: Using Render's Built-in SQL Editor

1. **Go to Database Dashboard**: Click on your database
2. **Click "Connect"**: In the top right
3. **Open SQL Editor**: Click "Open SQL Editor"
4. **Copy Schema**: Copy the entire content from `database/schema.sql`
5. **Paste and Execute**: Paste in the editor and click "Run"

### Method 2: Using psql Command Line

```bash
# Connect to your Render database
psql postgresql://shrine_user:password@dpg-xxxxxxxxx-a.oregon-postgres.render.com:5432/shrine_db

# Run the schema file
\i database/schema.sql

# Exit
\q
```

### Method 3: Using a Database Client

**Popular clients:**
- **pgAdmin**: https://www.pgadmin.org/
- **DBeaver**: https://dbeaver.io/
- **TablePlus**: https://tableplus.com/

**Connection details:**
- Host: `dpg-xxxxxxxxx-a.oregon-postgres.render.com`
- Port: `5432`
- Database: `shrine_db`
- Username: `shrine_user`
- Password: `[your generated password]`
- SSL: Required (enable SSL/TLS)

---

## 🔐 Security Best Practices

### 1. Environment Variables

**Never commit database credentials to git!**

```bash
# Add to .gitignore
.env
.env.local
.env.production
```

### 2. Use Environment Variables in Production

When deploying to Render, set environment variables in the service settings:

```
DB_HOST=dpg-xxxxxxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=shrine_db
DB_USER=shrine_user
DB_PASSWORD=your_password_here
```

### 3. SSL Connection

Always use SSL in production:

```javascript
ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
```

---

## 📊 Database Management

### Monitoring

1. **Database Dashboard**: Monitor performance, connections, storage
2. **Metrics**: View CPU, memory, and disk usage
3. **Logs**: Check database logs for errors

### Backups

**Render automatically backs up your database:**
- **Free Plan**: 7 days of backups
- **Paid Plans**: 30 days of backups
- **Manual Backups**: Available in dashboard

### Scaling

**Upgrade plans as needed:**
- **Free**: 1GB storage, shared CPU
- **Starter ($7/month)**: 10GB storage, dedicated CPU
- **Standard ($20/month)**: 50GB storage, better performance
- **Pro ($65/month)**: 200GB storage, high performance

---

## 🧪 Testing Database Connection

### Test Script

Create a test file `test-db-connection.js`:

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    
    const result = await client.query('SELECT NOW()');
    console.log('📅 Current time:', result.rows[0].now);
    
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📋 Tables:', tables.rows.map(row => row.table_name));
    
    client.release();
  } catch (err) {
    console.error('❌ Database connection error:', err);
  } finally {
    await pool.end();
  }
}

testConnection();
```

Run the test:
```bash
node test-db-connection.js
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. **Connection Timeout**
```
Error: connect ETIMEDOUT
```
**Solution:** Check if your IP is whitelisted (Render allows all IPs by default)

#### 2. **SSL Required**
```
Error: no pg_hba.conf entry for host
```
**Solution:** Enable SSL in your connection:
```javascript
ssl: { rejectUnauthorized: false }
```

#### 3. **Database Not Found**
```
Error: database "shrine_db" does not exist
```
**Solution:** Verify database name in Render dashboard matches your .env file

#### 4. **Authentication Failed**
```
Error: password authentication failed
```
**Solution:** Double-check username and password from Render dashboard

### Getting Help

1. **Render Documentation**: https://render.com/docs/databases
2. **Render Support**: Available in dashboard
3. **Community Forum**: https://community.render.com/

---

## 💰 Pricing Information

### Free Plan
- **Cost**: $0/month
- **Storage**: 1GB
- **Connections**: 97
- **Backup**: 7 days
- **Limitations**: Sleeps after 90 days of inactivity

### Starter Plan ($7/month)
- **Cost**: $7/month
- **Storage**: 10GB
- **Connections**: 97
- **Backup**: 30 days
- **Features**: Always available, no sleep

### Standard Plan ($20/month)
- **Cost**: $20/month
- **Storage**: 50GB
- **Connections**: 197
- **Backup**: 30 days
- **Features**: Better performance

---

## 🎯 Next Steps

After creating your database:

1. **✅ Set up database schema** using one of the methods above
2. **✅ Update your backend .env** with Render database credentials
3. **✅ Test the connection** using the test script
4. **✅ Deploy your backend** to Render Web Service
5. **✅ Configure environment variables** in Render service settings

---

## 📝 Quick Reference

### Essential Commands

```bash
# Connect to database
psql postgresql://user:password@host:5432/database

# Run schema file
psql -f database/schema.sql postgresql://user:password@host:5432/database

# Test connection
node test-db-connection.js
```

### Important URLs

- **Render Dashboard**: https://dashboard.render.com
- **Database Docs**: https://render.com/docs/databases
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

**🎉 Your PostgreSQL database on Render is now ready for your backend application!**