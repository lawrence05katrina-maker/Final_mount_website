# Media Storage & CDN Setup Guide

## Overview
This guide sets up Cloudflare R2 for object storage and CDN for video files, ensuring videos are not served through your Node.js application.

## Step 1: Cloudflare R2 Setup

### 1.1 Create Cloudflare Account
```bash
# Visit https://cloudflare.com
# Sign up with church email
# Verify email address
```

### 1.2 Enable R2 Object Storage
```bash
# In Cloudflare dashboard:
# 1. Go to R2 Object Storage
# 2. Click "Create bucket"
# 3. Bucket name: "church-media"
# 4. Location: Auto (or closest to India)
```

### 1.3 Create R2 API Token
```bash
# In Cloudflare dashboard:
# 1. Go to "My Profile" > "API Tokens"
# 2. Click "Create Token"
# 3. Use "Custom token" template
# 4. Permissions:
#    - Zone:Zone Settings:Edit
#    - Zone:Zone:Read
#    - Account:Cloudflare R2:Edit
# 5. Account Resources: Include - Your Account
# 6. Zone Resources: Include - Specific zone - your-domain.com
```

## Step 2: Configure R2 Bucket

### 2.1 Bucket Settings
```bash
# In R2 bucket settings:
# 1. Public access: Enabled
# 2. Custom domain: media.your-domain.com
# 3. CORS policy: Configure for your domain
```

### 2.2 CORS Configuration
```json
[
  {
    "AllowedOrigins": [
      "https://your-domain.com",
      "https://www.your-domain.com"
    ],
    "AllowedMethods": [
      "GET",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

## Step 3: Backend Integration

### 3.1 Install AWS SDK for R2
```bash
# On server, in backend directory
cd /home/church/church-website/backend
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

### 3.2 Create R2 Service Module
```bash
# Create R2 service file
nano /home/church/church-website/backend/src/services/r2Service.js
```

### 3.3 R2 Service Implementation
```javascript
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

class R2Service {
  constructor() {
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = process.env.R2_BUCKET_NAME;
    this.publicUrl = process.env.R2_PUBLIC_URL;
  }

  async uploadFile(key, buffer, contentType) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000', // 1 year
      });

      await this.client.send