#!/bin/sh

echo "🔄 Starting Deeplom Backend..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
while ! pg_isready -h postgres -p 5432 -U deeplom_user -d deeplom > /dev/null 2>&1; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Run database migrations
echo "🗄️ Running database migrations..."
drizzle-kit push

# Start the application
echo "🚀 Starting backend server..."
exec tsx server/production.ts