#!/bin/sh

# Test Docker build for frontend container
echo "Testing frontend Docker build..."

# Build only the frontend container
docker compose build frontend

if [ $? -eq 0 ]; then
    echo "✅ Frontend container built successfully"
else
    echo "❌ Frontend container build failed"
    exit 1
fi