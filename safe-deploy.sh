#!/bin/bash
echo "🧹 Cleaning ALL caches (npm, webpack, firebase)..."
rm -rf .firebase build node_modules/.cache

echo "🔨 Building fresh..."
npm run build

echo "🚀 Deploying to Firebase..."
firebase deploy --only hosting

echo "✅ Deploy complete!"
