#!/bin/bash

# Deployment script for Bridge Champions
# This script builds and deploys the app to Firebase

set -e  # Exit on error

echo "🚀 Starting deployment process..."

# Navigate to project directory
cd "$(dirname "$0")"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Are you in the correct directory?"
  exit 1
fi

# Build the production bundle
echo "📦 Building production bundle..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed. Please check the errors above."
  exit 1
fi

echo "✅ Build successful!"

# Deploy to Firebase
echo "🌐 Deploying to Firebase..."
npm run deploy

if [ $? -ne 0 ]; then
  echo "❌ Deployment failed. Please check the errors above."
  exit 1
fi

echo "✅ Deployment successful! Your changes are now live."

