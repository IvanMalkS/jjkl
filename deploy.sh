#!/bin/bash

# Deeplom Bot - Quick Deploy Script with PostgreSQL
echo "🚀 Deeplom Bot Deployment Script"
echo "================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Set environment variables if not provided
if [ -z "$JWT_SECRET" ]; then
    export JWT_SECRET="deeplom-production-secret-$(date +%s)"
    echo "🔐 Generated JWT secret"
fi

if [ -z "$POSTGRES_PASSWORD" ]; then
    export POSTGRES_PASSWORD="deeplom_password_2024"
    echo "🔐 Using default PostgreSQL password"
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose down 2>/dev/null || true

# Remove old volumes for fresh start (optional)
read -p "🗑️  Remove existing database data? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker volume rm $(docker compose config --volumes) 2>/dev/null || true
    echo "🗑️  Database volume removed"
fi

# Build containers
echo "🏗️  Building Docker containers..."

echo "📦 Building backend container..."
docker compose build backend

echo "📦 Building frontend container..."
docker compose build frontend

# Start PostgreSQL first
echo "🗄️  Starting PostgreSQL database..."
docker compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
timeout=60
counter=0
while ! docker compose exec -T postgres pg_isready -U deeplom_user -d deeplom > /dev/null 2>&1; do
    if [ $counter -ge $timeout ]; then
        echo "❌ PostgreSQL failed to start within $timeout seconds"
        docker compose logs postgres
        exit 1
    fi
    sleep 2
    counter=$((counter + 2))
    echo "   ... waiting ($counter/$timeout seconds)"
done

echo "✅ PostgreSQL is ready!"

# Start backend
echo "🔧 Starting backend service..."
docker compose up -d backend

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 15

# Start frontend
echo "🌐 Starting frontend service..."
docker compose up -d frontend

# Wait for all services
echo "⏳ Waiting for all services to be ready..."
sleep 10

# Check if services are running
if docker compose ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Frontend: http://localhost"
    echo "🔧 Backend API: http://localhost:5000"
    echo "🗄️  PostgreSQL: localhost:5432"
    echo ""
    echo "📋 Service status:"
    docker compose ps
    echo ""
    echo "📝 Useful commands:"
    echo "   View logs:     docker compose logs -f [service]"
    echo "   Stop all:      docker compose down"
    echo "   Restart:       docker compose restart [service]"
    echo "   Database CLI:  docker compose exec postgres psql -U deeplom_user -d deeplom"
    echo ""
    echo "🧪 Run tests with: ./test-deployment.sh"
else
    echo "❌ Deployment failed. Check logs:"
    docker compose logs
    exit 1
fi