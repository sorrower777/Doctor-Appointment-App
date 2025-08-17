@echo off
REM Production Build Script for Doctor Appointment App (Windows)
REM Run this script to build all components for production

echo 🚀 Building Doctor Appointment App for Production...

REM Build Frontend
echo 📦 Building Frontend...
cd fronted
call npm run build
if errorlevel 1 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)
echo ✅ Frontend build complete!

REM Build Admin Panel
echo 📦 Building Admin Panel...
cd ..\admin
call npm run build
if errorlevel 1 (
    echo ❌ Admin build failed!
    pause
    exit /b 1
)
echo ✅ Admin build complete!

REM Backend (no build needed, but we can install production dependencies)
echo 🔧 Preparing Backend...
cd ..\backend
call npm install --production
echo ✅ Backend ready!

echo 🎉 All builds completed successfully!
echo 📋 Next steps:
echo    1. Deploy backend to your hosting service
echo    2. Upload fronted/dist to your frontend hosting
echo    3. Upload admin/dist to your admin hosting
echo    4. Update environment variables with production URLs
pause
