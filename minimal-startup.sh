#!/bin/bash

# Minimal, bulletproof startup script for CI
set -e

echo "🚀 Minimal startup for CI environment..."

# Clean everything
docker compose -f compose.dev.yml down --volumes --remove-orphans || true
docker system prune -f || true

# Create environment files (essential for backend startup)
mkdir -p database backend
cat > database/.dev.env << EOF
POSTGRES_USER=postgres
POSTGRES_PASSWORD=840fb30f-e424-4a97-b58c-ef4433ebca85
POSTGRES_DB=todo-app
DATABASE_URL=postgresql://\${POSTGRES_USER}:\${POSTGRES_PASSWORD}@database:5432/\${POSTGRES_DB}
EOF

cat > backend/.dev.env << EOF
SECRET_KEY=test-secret-key-for-ci
TOKEN_ENCRYPTION_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_TOKEN_EXPIRE_DAYS=30
EOF

echo "📁 Environment files created:"
ls -la database/.dev.env backend/.dev.env

# Build with no cache to ensure fresh builds
echo "🏗️  Building with no cache..."
docker compose -f compose.dev.yml build --no-cache

# Start database first
echo "🗄️  Starting database..."
docker compose -f compose.dev.yml up -d database

# Wait for database
echo "⏳ Waiting for database..."
for i in {1..30}; do
  if docker compose -f compose.dev.yml exec -T database pg_isready -U postgres -d todo-app; then
    echo "✅ Database ready"
    break
  fi
  sleep 2
done

# Run migration
echo "🔄 Running migration..."
docker compose -f compose.dev.yml up database-migration
if [ $? -ne 0 ]; then
  echo "❌ Migration failed"
  docker compose -f compose.dev.yml logs database-migration
  exit 1
fi

# Start backend
echo "🔧 Starting backend..."
docker compose -f compose.dev.yml up -d backend

# Wait for backend with detailed checking
echo "⏳ Waiting for backend..."
for i in {1..60}; do
  # Check if container is running
  if ! docker compose -f compose.dev.yml ps backend | grep -q "Up"; then
    echo "❌ Backend container not running!"
    docker compose -f compose.dev.yml ps
    docker compose -f compose.dev.yml logs backend
    exit 1
  fi
  
  # Check port
  if curl -f http://localhost:4322/health >/dev/null 2>&1; then
    echo "✅ Backend ready!"
    break
  fi
  
  if [ $i -eq 60 ]; then
    echo "❌ Backend failed to respond"
    docker compose -f compose.dev.yml ps
    docker compose -f compose.dev.yml logs backend
    exit 1
  fi
  
  sleep 2
done

# Start frontend
echo "🌐 Starting frontend..."
docker compose -f compose.dev.yml up -d frontend

# Wait for frontend
echo "⏳ Waiting for frontend..."
for i in {1..30}; do
  if curl -f http://localhost:4321 >/dev/null 2>&1; then
    echo "✅ Frontend ready!"
    break
  fi
  sleep 2
done

echo "🎉 All services started successfully!"
docker compose -f compose.dev.yml ps