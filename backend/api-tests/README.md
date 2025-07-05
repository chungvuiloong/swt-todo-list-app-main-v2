# API Tests

This directory contains automated API tests for the Todo List application backend using Robot Framework with RequestsLibrary.

## Prerequisites

- Python 3.8 or higher
- Docker and Docker Compose (for running the application)

## Installation

1. Install Python dependencies:
```bash
pip install robotframework
pip install robotframework-requests
pip install robotframework-jsonlibrary
pip install requests
```

2. Start the application backend:
```bash
# From the project root directory
docker compose -f compose.dev.yml up -d
```

3. Wait for all services to be ready (check with `docker compose -f compose.dev.yml ps`)

## Running Tests

### Run All Tests
```bash
# From the backend/api-tests directory
robot tests/
```

### Run Specific Test Suite
```bash
robot tests/auth_api_tests.robot
robot tests/todolist_api_tests.robot
robot tests/todoitem_api_tests.robot
```

### Run Tests with Tags
```bash
# Run only smoke tests
robot --include smoke tests/

# Run happy path tests
robot --include happy_path tests/

# Run negative tests
robot --include negative tests/

# Run CRUD operation tests
robot --include crud tests/
```

### Generate Reports with Custom Output
```bash
# Run tests with custom output directory
robot --outputdir results tests/

# Run tests with detailed logging
robot --loglevel DEBUG tests/
```

## Test Structure

- `tests/` - Test case files
  - `auth_api_tests.robot` - Authentication API tests
  - `user_api_tests.robot` - User management API tests
  - `todolist_api_tests.robot` - Todo list API tests
  - `todoitem_api_tests.robot` - Todo item API tests
  - `sharing_api_tests.robot` - List sharing API tests
- `resources/` - Shared resources and keywords
  - `api_common.robot` - Common API keywords and setup
  - `auth_api_keywords.robot` - Authentication related API keywords
  - `todolist_api_keywords.robot` - Todo list API keywords
- `variables/` - Test data and configuration
  - `api_config.robot` - API configuration variables
  - `api_test_data.robot` - API test data variables

## API Endpoints Tested

### Authentication & Users (`/api/users/`)
- `POST /api/users/` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/refresh-token` - Token refresh
- `GET /api/users/` - Find users (with query)

### Todo Lists (`/api/todo-lists/`)
- `GET /api/todo-lists/` - Get user's todo lists
- `POST /api/todo-lists/` - Create todo list
- `GET /api/todo-lists/{id}` - Get specific todo list
- `PUT /api/todo-lists/{id}` - Update todo list
- `DELETE /api/todo-lists/{id}` - Delete todo list
- `POST /api/todo-lists/{id}/clone` - Clone todo list
- `POST /api/todo-lists/{id}/share` - Share todo list

### Todo Items (`/api/todo-lists/{list_id}/todos/`)
- `GET /api/todo-lists/{list_id}/todos` - Get todo items
- `POST /api/todo-lists/{list_id}/todos` - Create todo item
- `GET /api/todo-lists/{list_id}/todos/{item_id}` - Get specific todo item
- `PUT /api/todo-lists/{list_id}/todos/{item_id}` - Update todo item
- `DELETE /api/todo-lists/{list_id}/todos/{item_id}` - Delete todo item

## Authentication

Tests use JWT tokens for authentication. The auth keywords handle:
- User registration and login
- Token extraction and storage
- Adding Authorization headers to requests
- Token refresh when needed

## Test Coverage

The tests cover:
- **Happy Path**: Successful API operations with valid data
- **Negative Cases**: Error handling with invalid data, unauthorized access
- **CRUD Operations**: Create, Read, Update, Delete for all resources
- **Authentication**: Registration, login, token management
- **Authorization**: Access control for owned vs shared resources
- **Data Validation**: Input validation and error responses

## Configuration

Tests are configured to run against:
- Backend API: `http://localhost:4322`
- Database resets between test suites for data isolation

## Troubleshooting

### Common Issues

1. **Connection refused**: Ensure the backend is running on port 4322
   ```bash
   docker compose -f compose.dev.yml ps
   curl http://localhost:4322/docs
   ```

2. **Database conflicts**: If tests fail due to data conflicts, restart the application:
   ```bash
   docker compose -f ../../compose.dev.yml down
   docker compose -f ../../compose.dev.yml up -d
   ```

3. **Authentication errors**: Check that test users are created successfully and tokens are valid

4. **Environment files missing**: Ensure .dev.env files exist:
   ```bash
   # Check if environment files exist
   ls -la ../../database/.dev.env ../../backend/.dev.env
   
   # Use the test script to set up environment
   ../../test-api-locally.sh
   ```

5. **GitHub Actions failures**: The workflow now uses Docker Compose instead of manual service startup
   - Environment files are created automatically in CI
   - Services use proper Docker networking
   - Health checks wait for services to be fully ready

### Debug Mode
```bash
robot --loglevel DEBUG --include debug tests/
```

### Verify API Availability
```bash
# Check API health
curl -I http://localhost:4322/docs

# Check specific endpoint
curl -X GET http://localhost:4322/api/todo-lists/roles
```

## Tags Reference

- `smoke` - Critical API tests that should run on every commit
- `happy_path` - Positive flow API tests
- `negative` - Error condition and validation tests
- `crud` - Create, Read, Update, Delete operation tests
- `auth` - Authentication and authorization tests
- `validation` - Input validation and error handling tests
- `performance` - Basic performance and response time tests