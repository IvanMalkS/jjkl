#!/bin/bash

# Deeplom Bot - Quick Deploy Script
echo "🚀 Deeplom Bot Deployment Script"
echo "================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Set JWT secret if not provided
if [ -z "$JWT_SECRET" ]; then
    export JWT_SECRET="deeplom-production-secret-$(date +%s)"
    echo "🔐 Generated JWT secret: $JWT_SECRET"
fi

# Build and start containers
echo "🏗️  Building Docker containers..."
docker-compose down 2>/dev/null || true

echo "📦 Building frontend container..."
docker-compose build frontend

echo "📦 Building backend container..."
docker-compose build backend

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Frontend: http://localhost"
    echo "🔧 Backend API: http://localhost:5000"
    echo ""
    echo "📋 Service status:"
    docker-compose ps
    echo ""
    echo "📝 To view logs:"
    echo "   Frontend: docker-compose logs frontend"
    echo "   Backend:  docker-compose logs backend"
    echo ""
    echo "🛑 To stop services:"
    echo "   docker-compose down"
else
    echo "❌ Deployment failed. Check logs:"
    docker-compose logs
    exit 1
fi