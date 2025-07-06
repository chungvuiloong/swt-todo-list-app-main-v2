#!/bin/bash

# Wait for services to be fully ready for E2E testing
set -e

echo "🔍 Waiting for all services to be ready for E2E testing..."

# Wait for backend API
echo "⏳ Checking backend health..."
for i in {1..60}; do
  if curl -f http://localhost:4322/health >/dev/null 2>&1; then
    echo "✅ Backend health check passed"
    break
  fi
  echo "Attempt $i: Backend not ready, waiting 2 seconds..."
  sleep 2
  if [ $i -eq 60 ]; then
    echo "❌ Backend failed to become ready after 2 minutes"
    exit 1
  fi
done

# Wait for backend API with database
echo "⏳ Checking backend database connectivity..."
for i in {1..60}; do
  if curl -f http://localhost:4322/api/todo-lists/roles >/dev/null 2>&1; then
    echo "✅ Backend database connectivity verified"
    break
  fi
  echo "Attempt $i: Database API not ready, waiting 2 seconds..."
  sleep 2
  if [ $i -eq 60 ]; then
    echo "❌ Backend database connectivity failed after 2 minutes"
    exit 1
  fi
done

# Wait for frontend
echo "⏳ Checking frontend..."
for i in {1..60}; do
  if curl -f http://localhost:4321 >/dev/null 2>&1; then
    echo "✅ Frontend is accessible"
    break
  fi
  echo "Attempt $i: Frontend not ready, waiting 2 seconds..."
  sleep 2
  if [ $i -eq 60 ]; then
    echo "❌ Frontend failed to become ready after 2 minutes"
    exit 1
  fi
done

# Test actual user registration to verify full functionality
echo "⏳ Testing end-to-end connectivity with a test user registration..."
response=$(curl -s -X POST http://localhost:4322/api/users/ \
  -H "Content-Type: application/json" \
  -d '{"username": "healthcheck_user_'$(date +%s)'", "password": "testpass123"}' || echo "FAILED")

if [[ "$response" == *"accessToken"* ]]; then
  echo "✅ End-to-end registration test successful"
else
  echo "❌ End-to-end registration test failed: $response"
  exit 1
fi

echo "🎉 All services are ready for E2E testing!"