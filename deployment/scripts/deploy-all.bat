@echo off
echo ========================================
echo DEVASAHAYAM MOUNT SHRINE - FULL DEPLOYMENT
echo ========================================

echo Step 1: Building Frontend...
call "%~dp0build-frontend.bat"

if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)

echo.
echo Step 2: Preparing Backend...
call "%~dp0prepare-backend.bat"

if %errorlevel% neq 0 (
    echo ERROR: Backend preparation failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo DEPLOYMENT PACKAGE READY!
echo ========================================
echo.
echo Your deployment package is ready in the 'deployment' folder:
echo.
echo 📁 deployment/
echo   ├── 📁 frontend-dist/     ^(Upload to web server^)
echo   ├── 📁 backend/           ^(Deploy to Node.js server^)
echo   ├── 📁 database/          ^(Import to PostgreSQL^)
echo   ├── 📁 scripts/           ^(Helper scripts^)
echo   └── 📄 README.md          ^(Deployment guide^)
echo.
echo NEXT STEPS:
echo 1. Read deployment/README.md for detailed instructions
echo 2. Upload frontend-dist/ to your web server
echo 3. Deploy backend/ to your Node.js server
echo 4. Import database/ files to PostgreSQL
echo.
echo ========================================
pause