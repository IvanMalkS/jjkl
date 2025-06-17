#!/bin/bash

# Test Deployment Script for Deeplom Bot
echo "🧪 Testing Deeplom Bot Deployment"
echo "================================="

# Test if containers are running
echo "📋 Checking container status..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ Containers are running"
else
    echo "❌ Containers are not running"
    exit 1
fi

# Test frontend accessibility
echo "🌐 Testing frontend accessibility..."
sleep 5
if curl -s -o /dev/null -w "%{http_code}" http://localhost | grep -q "200"; then
    echo "✅ Frontend is accessible on http://localhost"
else
    echo "❌ Frontend is not accessible"
    exit 1
fi

# Test backend API
echo "🔧 Testing backend API..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/auth/me | grep -q "401\|404"; then
    echo "✅ Backend API is responding"
else
    echo "❌ Backend API is not responding"
    exit 1
fi

# Test registration endpoint
echo "👤 Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "password123",
    "confirmPassword": "password123"
  }' \
  -w "%{http_code}")

if echo "$REGISTER_RESPONSE" | grep -q "200"; then
    echo "✅ User registration works"
else
    echo "❌ User registration failed"
fi

echo ""
echo "🎉 Deployment test completed!"
echo "📍 Access your application:"
echo "   Frontend: http://localhost"
echo "   Backend:  http://localhost:5000"
echo ""
echo "🔍 To view detailed logs:"
echo "   docker-compose logs frontend"
echo "   docker-compose logs backend"