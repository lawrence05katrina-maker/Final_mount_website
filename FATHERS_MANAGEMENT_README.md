# Fathers Management System

This document describes the complete fathers management system that allows administrators to manage fathers/priests information with full CRUD operations while maintaining a clean public interface for users.

## Overview

The system consists of:
- **Database Schema**: PostgreSQL table with proper indexing and triggers
- **Backend API**: RESTful endpoints for CRUD operations
- **Admin Interface**: Full-featured admin panel for managing fathers
- **Public Interface**: User-friendly display of fathers information
- **Data Migration**: Scripts to initialize the database with existing data

## Database Schema

### Table: `fathers`

```sql
CREATE TABLE fathers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    period VARCHAR(255),
    category VARCHAR(50) NOT NULL CHECK (category IN ('parish_priest', 'assistant_priest', 'son_of_soil', 'deacon')),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Categories
- `parish_priest`: Parish Priests
- `assistant_priest`: Assistant Priests  
- `son_of_soil`: Sons of Soil
- `deacon`: Deacons

## API Endpoints

### Public Endpoints (No Authentication)
- `GET /api/fathers/active` - Get all active fathers grouped by category

### Admin Endpoints (Authentication Required)
- `GET /api/fathers/admin/all` - Get all fathers
- `GET /api/fathers/admin/stats` - Get statistics
- `GET /api/fathers/admin/category/:category` - Get fathers by category
- `GET /api/fathers/admin/:id` - Get father by ID
- `POST /api/fathers/admin` - Create new father
- `PUT /api/fathers/admin/:id` - Update father
- `DELETE /api/fathers/admin/:id` - Delete father
- `PATCH /api/fathers/admin/:id/toggle-active` - Toggle active status
- `PATCH /api/fathers/admin/:id/display-order` - Update display order

## Frontend Components

### Public Interface
- **File**: `frontend/src/app/pages/admin/FathersPage.tsx`
- **Route**: `/fathers`
- **Features**:
  - Displays active fathers grouped by category
  - Responsive design
  - Loading and error states
  - Fetches data from API

### Admin Interface
- **File**: `frontend/src/app/pages/admin/AdminFathersPage.tsx`
- **Route**: `/admin/fathers`
- **Features**:
  - Full CRUD operations (Create, Read, Update, Delete)
  - Statistics dashboard
  - Category filtering
  - Toggle active/inactive status
  - Bulk operations
  - Form validation
  - Responsive design

## Installation & Setup

### 1. Database Setup

Run the SQL schema file to create the table and insert initial data:

```bash
# Option 1: Run the SQL file directly
psql -d your_database -f fathers_database_schema.sql

# Option 2: Use the Node.js initialization script
cd backend
node initialize-fathers-db.js
```

### 2. Backend Setup

The backend is automatically configured when you start the server. The fathers system will be initialized along with other systems.

### 3. Frontend Setup

The frontend components are already integrated into the routing system:
- Public route: `/fathers`
- Admin route: `/admin/fathers`

## Usage

### For Administrators

1. **Login to Admin Panel**
   - Navigate to `/admin/login`
   - Enter admin credentials

2. **Access Fathers Management**
   - Go to `/admin/fathers`
   - View statistics and all fathers

3. **Add New Father**
   - Click "Add New Father" button
   - Fill in the form:
     - Name (required)
     - Period (optional)
     - Category (required)
     - Display Order
     - Active status
   - Click "Create"

4. **Edit Father**
   - Click "Edit" button on any father row
   - Modify the information
   - Click "Update"

5. **Delete Father**
   - Click "Delete" button on any father row
   - Confirm deletion

6. **Toggle Status**
   - Click "Activate/Deactivate" to toggle active status
   - Only active fathers appear on the public page

### For Users

1. **View Fathers Information**
   - Navigate to `/fathers`
   - View all active fathers organized by category
   - Information is automatically updated when admins make changes

## Data Structure

### Father Object
```typescript
interface Father {
  id: number;
  name: string;
  period?: string;
  category: 'parish_priest' | 'assistant_priest' | 'son_of_soil' | 'deacon';
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

### API Response Format
```json
{
  "success": true,
  "data": {
    "parish_priest": [...],
    "assistant_priest": [...],
    "son_of_soil": [...],
    "deacon": [...]
  }
}
```

## Testing

### Test the API
```bash
cd backend
node test-fathers-api.js
```

This will run comprehensive tests on all CRUD operations.

### Manual Testing
1. Start the backend server
2. Use a tool like Postman or curl to test endpoints
3. Check the admin interface functionality
4. Verify the public interface displays data correctly

## Security

- All admin endpoints require JWT authentication
- Input validation on all endpoints
- SQL injection protection through parameterized queries
- XSS protection through proper data sanitization

## Performance

- Database indexes on frequently queried columns
- Efficient queries with proper joins
- Caching considerations for public endpoints
- Optimized frontend rendering

## Maintenance

### Adding New Categories
1. Update the database CHECK constraint
2. Update the TypeScript interfaces
3. Update the admin form options
4. Update the category labels

### Backup Considerations
- Regular database backups
- Export functionality for data migration
- Version control for schema changes

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check database credentials in `.env`
   - Ensure PostgreSQL is running

2. **Authentication Error**
   - Verify JWT token is valid
   - Check admin login credentials

3. **Data Not Displaying**
   - Check if fathers are marked as active
   - Verify API endpoints are responding
   - Check browser console for errors

4. **Form Validation Errors**
   - Ensure required fields are filled
   - Check category values match allowed options
   - Verify display_order is a number

## Future Enhancements

- Image upload for fathers
- Bulk import/export functionality
- Advanced search and filtering
- Audit trail for changes
- Email notifications for updates
- Multi-language support

## Files Created/Modified

### New Files
- `fathers_database_schema.sql` - Database schema and initial data
- `backend/src/models/fathersModel.js` - Database model
- `backend/src/controllers/fathersController.js` - API controllers
- `backend/src/routes/fathersRoutes.js` - API routes
- `frontend/src/app/pages/admin/AdminFathersPage.tsx` - Admin interface
- `backend/initialize-fathers-db.js` - Database initialization script
- `backend/test-fathers-api.js` - API testing script

### Modified Files
- `backend/src/app.js` - Added fathers routes and initialization
- `frontend/src/app/pages/admin/FathersPage.tsx` - Updated to use API
- `frontend/src/app/App.tsx` - Added admin route import

This completes the full fathers management system with CRUD operations, proper database design, and both admin and public interfaces.