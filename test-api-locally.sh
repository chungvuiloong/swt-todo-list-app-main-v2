#!/bin/bash

echo "🚀 Starting Todo List Application for API Testing"

# Create environment files if they don't exist
mkdir -p database backend

if [ ! -f database/.dev.env ]; then
    echo "Creating database/.dev.env"
    cat > database/.dev.env << EOF
POSTGRES_USER=postgres
POSTGRES_PASSWORD=840fb30f-e424-4a97-b58c-ef4433ebca85
POSTGRES_DB=todo-app
DATABASE_URL=postgresql://\${POSTGRES_USER}:\${POSTGRES_PASSWORD}@database:5432/\${POSTGRES_DB}
EOF
fi

if [ ! -f backend/.dev.env ]; then
    echo "Creating backend/.dev.env"
    cat > backend/.dev.env << EOF
SECRET_KEY=test-secret-key-for-local-testing
TOKEN_ENCRYPTION_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_TOKEN_EXPIRE_DAYS=30
EOF
fi

echo "📦 Starting services with Docker Compose..."
docker compose -f compose.dev.yml up -d

echo "⏳ Waiting for services to start..."
sleep 30

echo "🔍 Checking service status..."
docker compose -f compose.dev.yml ps

echo "🌐 Waiting for API to be ready..."
for i in {1..30}; do
    if curl -f http://localhost:4322/api/todo-lists/roles 2>/dev/null; then
        echo "✅ API is ready!"
        break
    fi
    echo "Attempt $i: API not ready, waiting 5 seconds..."
    sleep 5
done

echo "🧪 Testing API endpoints..."

# Test the roles endpoint
echo "Testing GET /api/todo-lists/roles"
curl -X GET "http://localhost:4322/api/todo-lists/roles" -H "accept: application/json"
echo ""

# Test user registration
echo "Testing POST /api/users/ (user registration)"
curl -X POST "http://localhost:4322/api/users/" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'
echo ""

echo "🎯 API testing complete!"
echo ""
echo "To run Robot Framework API tests:"
echo "cd backend/api-tests"
echo "robot --include smoke tests/"
echo ""
echo "To stop the application:"
echo "docker compose -f compose.dev.yml down"