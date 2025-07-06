#!/bin/bash

# Robust service startup script for CI environment
set -e

echo "🚀 Starting services for CI environment..."

# Debug environment info
echo "📊 Environment info:"
echo "- OS: $(uname -a)"
echo "- Docker version: $(docker --version)"
echo "- Docker Compose version: $(docker compose version)"
echo "- Working directory: $(pwd)"
echo "- Available disk space: $(df -h .)"

# Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
docker compose -f compose.dev.yml down --volumes --remove-orphans || true

# Create environment files if they don't exist
echo "📝 Creating environment files..."
mkdir -p database backend

echo "POSTGRES_USER=postgres" > database/.dev.env
echo "POSTGRES_PASSWORD=840fb30f-e424-4a97-b58c-ef4433ebca85" >> database/.dev.env
echo "POSTGRES_DB=todo-app" >> database/.dev.env
echo "DATABASE_URL=postgresql://\${POSTGRES_USER}:\${POSTGRES_PASSWORD}@database:5432/\${POSTGRES_DB}" >> database/.dev.env

echo "SECRET_KEY=test-secret-key-for-ci" > backend/.dev.env
echo "TOKEN_ENCRYPTION_ALGORITHM=HS256" >> backend/.dev.env
echo "ACCESS_TOKEN_EXPIRE_MINUTES=1440" >> backend/.dev.env
echo "REFRESH_TOKEN_EXPIRE_DAYS=30" >> backend/.dev.env

echo "🏗️  Building Docker images..."
docker compose -f compose.dev.yml build --no-cache

echo "🗄️  Starting database first..."
docker compose -f compose.dev.yml up -d database

echo "⏳ Waiting for database to be ready..."
for i in {1..30}; do
  if docker compose -f compose.dev.yml exec -T database pg_isready -U postgres -d todo-app; then
    echo "✅ Database is ready!"
    break
  fi
  echo "Attempt $i: Database not ready, waiting 3 seconds..."
  sleep 3
  if [ $i -eq 30 ]; then
    echo "❌ Database failed to start"
    docker compose -f compose.dev.yml logs database
    exit 1
  fi
done

echo "🔄 Running database migration..."
docker compose -f compose.dev.yml up database-migration
migration_exit_code=$?
if [ $migration_exit_code -ne 0 ]; then
  echo "❌ Database migration failed with exit code $migration_exit_code"
  docker compose -f compose.dev.yml logs database-migration
  exit 1
fi
echo "✅ Database migration completed"

echo "🔧 Starting backend..."
docker compose -f compose.dev.yml up -d backend

echo "📊 Immediate backend status after start:"
docker compose -f compose.dev.yml ps backend

echo "⏳ Waiting for backend to be ready..."
for i in {1..60}; do
  # Check if backend container is still running
  if ! docker compose -f compose.dev.yml ps backend | grep -q "Up"; then
    echo "❌ Backend container stopped running!"
    echo "Backend status:"
    docker compose -f compose.dev.yml ps backend
    echo "Backend logs:"
    docker compose -f compose.dev.yml logs backend
    exit 1
  fi
  
  # Test port connectivity first
  if nc -z localhost 4322 2>/dev/null; then
    echo "✅ Port 4322 is accessible, testing HTTP..."
    if curl -f http://localhost:4322/health >/dev/null 2>&1; then
      echo "✅ Backend is ready!"
      break
    else
      echo "Port accessible but HTTP request failed"
    fi
  else
    echo "Attempt $i: Port 4322 not accessible yet..."
  fi
  
  # Show backend logs every 10 attempts
  if [ $((i % 10)) -eq 0 ]; then
    echo "🔍 Backend status at attempt $i:"
    docker compose -f compose.dev.yml ps backend
    echo "Backend logs (last 20 lines):"
    docker compose -f compose.dev.yml logs backend | tail -20
    echo "Docker network info:"
    docker network ls
    echo "Container network details:"
    docker compose -f compose.dev.yml exec backend ip addr 2>/dev/null || echo "Cannot get container IP"
  fi
  
  sleep 3
  if [ $i -eq 60 ]; then
    echo "❌ Backend failed to start after 3 minutes"
    echo "Final debug info:"
    echo "Backend status:"
    docker compose -f compose.dev.yml ps backend
    echo "Backend logs:"
    docker compose -f compose.dev.yml logs backend
    echo "All containers:"
    docker compose -f compose.dev.yml ps
    echo "System resources:"
    df -h
    docker system df
    exit 1
  fi
done

echo "🌐 Starting frontend..."
docker compose -f compose.dev.yml up -d frontend

echo "⏳ Waiting for frontend to be ready..."
for i in {1..30}; do
  if curl -f http://localhost:4321 >/dev/null 2>&1; then
    echo "✅ Frontend is ready!"
    break
  fi
  echo "Attempt $i: Frontend not ready, waiting 3 seconds..."
  sleep 3
  if [ $i -eq 30 ]; then
    echo "❌ Frontend failed to start"
    docker compose -f compose.dev.yml logs frontend
    exit 1
  fi
done

echo "🔍 Final service verification..."
echo "Service status:"
docker compose -f compose.dev.yml ps

echo "Testing backend API..."
response=$(curl -s http://localhost:4322/health || echo "FAILED")
if [[ "$response" == *"healthy"* ]]; then
  echo "✅ Backend API is responding correctly"
else
  echo "❌ Backend API test failed: $response"
  exit 1
fi

echo "Testing frontend..."
if curl -f http://localhost:4321 >/dev/null 2>&1; then
  echo "✅ Frontend is responding correctly"
else
  echo "❌ Frontend test failed"
  exit 1
fi

echo "🎉 All services are ready for testing!"