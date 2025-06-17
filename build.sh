#!/bin/bash

# Custom build script to fix esbuild configuration issue
echo "🏗️  Building frontend with Vite..."
vite build

echo "🏗️  Building backend with esbuild..."
esbuild server/index.ts --platform=node --bundle --format=esm --outdir=dist

echo "✅ Build completed successfully!"