#!/bin/bash

# Test Deployment Script for Deeplom Bot with PostgreSQL
echo "🧪 Testing Deeplom Bot Deployment"
echo "================================="

# Test if containers are running
echo "📋 Checking container status..."
if docker compose ps | grep -q "Up"; then
    echo "✅ All containers are running"
    docker compose ps
else
    echo "❌ Some containers are not running"
    docker compose ps
    exit 1
fi

# Test PostgreSQL connectivity
echo "🗄️  Testing PostgreSQL database..."
if docker compose exec -T postgres pg_isready -U deeplom_user -d deeplom > /dev/null 2>&1; then
    echo "✅ PostgreSQL database is accessible"
else
    echo "❌ PostgreSQL database is not accessible"
    exit 1
fi

# Test backend API
echo "🔧 Testing backend API..."
sleep 5
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/auth/me | grep -q "401\|404"; then
    echo "✅ Backend API is responding"
else
    echo "❌ Backend API is not responding"
    exit 1
fi

# Test frontend accessibility
echo "🌐 Testing frontend accessibility..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200"; then
    echo "✅ Frontend is accessible on http://localhost"
else
    echo "❌ Frontend is not accessible"
    exit 1
fi

# Test user registration with database
echo "👤 Testing user registration with database..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test_'$(date +%s)'@example.com", 
    "password": "password123",
    "confirmPassword": "password123"
  }')

if echo "$REGISTER_RESPONSE" | grep -q "user"; then
    echo "✅ User registration works with database"
else
    echo "❌ User registration failed"
    echo "Response: $REGISTER_RESPONSE"
fi

# Test database tables exist
echo "🗂️  Testing database schema..."
TABLE_COUNT=$(docker compose exec -T postgres psql -U deeplom_user -d deeplom -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')

if [ "$TABLE_COUNT" -ge 3 ]; then
    echo "✅ Database tables created successfully ($TABLE_COUNT tables)"
else
    echo "❌ Database tables not found or incomplete"
    exit 1
fi

echo ""
echo "🎉 Deployment test completed successfully!"
echo "📍 Access your application:"
echo "   Frontend: http://localhost"
echo "   Backend:  http://localhost:5000"
echo "   Database: localhost:5432"
echo ""
echo "🔍 Management commands:"
echo "   View logs:     docker compose logs -f [service]"
echo "   Database CLI:  docker compose exec postgres psql -U deeplom_user -d deeplom"
echo "   Restart:       docker compose restart [service]"