#!/bin/bash
# update-bundle.sh
# Automated script to update the OpenAI SDK and rebuild the bundle

echo "🔄 Updating OpenAI SDK..."
cd ..
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building main project..."
npm run build

echo "📦 Rebuilding bundle..."
cd standalone-bundle
npm run build

echo "✅ Bundle updated successfully!"
echo "📊 Bundle size: $(du -h openai-bundle.js | cut -f1)"