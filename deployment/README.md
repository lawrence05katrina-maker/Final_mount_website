# Church Website Deployment Guide

## Overview
This guide provides a complete deployment solution for the St. Devasahayam Mount Shrine website, optimized for low-cost hosting suitable for non-profit organizations.

## Budget: USD 60 / ₹5,000 per year

## Architecture

### Recommended Cloud Provider: **DigitalOcean + Cloudflare**

```
┌─────────────────────────────────────────────────────────────────┐
│                        DEPLOYMENT ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Domain] → [Cloudflare CDN] → [DigitalOcean Droplet]         │
│                    ↓                        ↓                   │
│              [Static Files]            [Node.js API]            │
│              [Video CDN]               [PostgreSQL]             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Cost Breakdown (Annual):
- **DigitalOcean Droplet** (Basic): $48/year ($4/month)
- **Domain Registration**: $12/year
- **Cloudflare**: Free tier
- **Total**: ~$60/year

## Components

1. **Frontend**: Static React build served via Cloudflare CDN
2. **Backend**: Node.js API with PM2 process manager
3. **Database**: Self-hosted PostgreSQL with automated backups
4. **Media**: Cloudflare R2 object storage (free tier: 10GB)
5. **SSL**: Free Cloudflare SSL certificates

## Quick Start

1. Follow the [Server Setup Guide](./guides/01-server-setup.md)
2. Configure [Database Setup](./guides/02-database-setup.md)
3. Deploy [Backend Application](./guides/03-backend-deployment.md)
4. Deploy [Frontend Application](./guides/04-frontend-deployment.md)
5. Setup [Media Storage](./guides/05-media-storage.md)
6. Configure [Domain & SSL](./guides/06-domain-ssl.md)

## Support

For technical support, refer to the [Handover Documentation](./handover/README.md).