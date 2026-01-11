-- Database Setup Script for Devasahayam Mount Shrine
-- Run this script as PostgreSQL superuser

-- =============================================
-- DATABASE AND USER CREATION
-- =============================================

-- Create database
CREATE DATABASE shrine_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Create application user
CREATE USER shrine_user WITH PASSWORD 'shrine_secure_password_2024';

-- Grant privileges
GRANT CONNECT ON DATABASE shrine_db TO shrine_user;
GRANT USAGE ON SCHEMA public TO shrine_user;
GRANT CREATE ON SCHEMA public TO shrine_user;

-- Connect to the new database
\c shrine_db

-- Grant table privileges (run after schema creation)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO shrine_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO shrine_user;

-- Grant privileges on future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO shrine_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO shrine_user;

-- Display success message
\echo 'Database and user created successfully!'
\echo 'Database: shrine_db'
\echo 'User: shrine_user'
\echo 'Next step: Run schema.sql to create tables'