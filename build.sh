#!/bin/bash

# Custom build script to fix esbuild configuration issue
echo "🏗️  Building frontend with Vite..."
npx vite build

echo "🏗️  Building backend with esbuild..."
npx esbuild server/index.ts --platform=node --bundle --format=esm --outdir=dist

echo "✅ Build completed successfully!"