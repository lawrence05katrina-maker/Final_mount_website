@echo off
echo ========================================
echo Preparing Backend for Deployment
echo ========================================

cd /d "%~dp0..\..\backend"

echo Cleaning backend folder...
if exist "%~dp0..\backend" rmdir /s /q "%~dp0..\backend"
mkdir "%~dp0..\backend"

echo Copying backend files...
xcopy /e /i /y "src" "%~dp0..\backend\src"
copy "package.json" "%~dp0..\backend\"
copy "package-lock.json" "%~dp0..\backend\"

echo Creating .env.example file...
(
echo # Database Configuration
echo DB_HOST=localhost
echo DB_PORT=5432
echo DB_NAME=shrine_db
echo DB_USER=shrine_user
echo DB_PASSWORD=your_secure_password_here
echo.
echo # Server Configuration
echo PORT=5000
echo.
echo # JWT Configuration
echo JWT_SECRET=your_jwt_secret_key_here
echo JWT_EXPIRES_IN=24h
echo.
echo # Admin Configuration
echo ADMIN_SESSION_TIMEOUT=24h
) > "%~dp0..\backend\.env.example"

echo Creating uploads directories...
mkdir "%~dp0..\backend\uploads"
mkdir "%~dp0..\backend\uploads\donations"
mkdir "%~dp0..\backend\uploads\gallery"
mkdir "%~dp0..\backend\uploads\management"
mkdir "%~dp0..\backend\uploads\payments"

echo Creating README for backend...
(
echo # Backend Deployment
echo.
echo ## Setup Instructions
echo.
echo 1. Install Node.js ^(version 18 or higher^)
echo 2. Run: npm install
echo 3. Copy .env.example to .env and configure
echo 4. Start with: npm start
echo.
echo ## Production Deployment
echo.
echo Use PM2 for production:
echo ```
echo npm install -g pm2
echo pm2 start src/server.js --name shrine-backend
echo pm2 save
echo pm2 startup
echo ```
echo.
echo ## Environment Variables
echo.
echo - DB_HOST: Database host ^(localhost^)
echo - DB_PORT: Database port ^(5432^)
echo - DB_NAME: Database name ^(shrine_db^)
echo - DB_USER: Database user ^(shrine_user^)
echo - DB_PASSWORD: Database password
echo - PORT: Server port ^(5000^)
echo - JWT_SECRET: JWT secret key
) > "%~dp0..\backend\README.md"

echo ========================================
echo Backend preparation completed!
echo Files are ready in: deployment/backend/
echo ========================================
pause