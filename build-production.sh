#!/bin/bash

# Production Build Script for Doctor Appointment App
# Run this script to build all components for production

echo "🚀 Building Doctor Appointment App for Production..."

# Build Frontend
echo "📦 Building Frontend..."
cd fronted
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi
echo "✅ Frontend build complete!"

# Build Admin Panel
echo "📦 Building Admin Panel..."
cd ../admin
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Admin build failed!"
    exit 1
fi
echo "✅ Admin build complete!"

# Backend (no build needed, but we can run tests)
echo "🔧 Preparing Backend..."
cd ../backend
npm install --production
echo "✅ Backend ready!"

echo "🎉 All builds completed successfully!"
echo "📋 Next steps:"
echo "   1. Deploy backend to your hosting service"
echo "   2. Upload frontend/dist to your frontend hosting"
echo "   3. Upload admin/dist to your admin hosting"
echo "   4. Update environment variables with production URLs"
