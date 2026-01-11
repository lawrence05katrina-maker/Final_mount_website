@echo off
echo ========================================
echo Building Frontend for Deployment
echo ========================================

cd /d "%~dp0..\..\frontend"

echo Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo Building production version...
call npm run build

if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo Copying build files to deployment folder...
if exist "%~dp0..\frontend-dist" rmdir /s /q "%~dp0..\frontend-dist"
xcopy /e /i /y "dist" "%~dp0..\frontend-dist"

if %errorlevel% neq 0 (
    echo ERROR: Failed to copy build files
    pause
    exit /b 1
)

echo ========================================
echo Frontend build completed successfully!
echo Files are ready in: deployment/frontend-dist/
echo ========================================
pause