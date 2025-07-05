# End-to-End Tests

This directory contains automated end-to-end tests for the Todo List application using Robot Framework with SeleniumLibrary.

## Prerequisites

- Python 3.8 or higher
- Node.js and npm (for the application)
- Docker and Docker Compose (for running the application)
- Chrome or Chromium browser

## Installation

1. Install Python dependencies:
```bash
pip install robotframework
pip install robotframework-seleniumlibrary
pip install robotframework-requests
pip install webdriver-manager
```

2. Install Chrome WebDriver (automatically managed by webdriver-manager)

3. Start the application:
```bash
# From the project root directory
docker compose -f compose.dev.yml up -d
```

4. Wait for all services to be ready (check with `docker compose -f compose.dev.yml ps`)

## Running Tests

### Run All Tests
```bash
# From the e2e-tests directory
robot tests/
```

### Run Specific Test Suite
```bash
robot tests/auth_tests.robot
robot tests/todolist_tests.robot
robot tests/todoitem_tests.robot
robot tests/sharing_tests.robot
```

### Run Tests with Tags
```bash
# Run only smoke tests
robot --include smoke tests/

# Run happy path tests
robot --include happy_path tests/

# Run negative tests
robot --include negative tests/
```

### Generate Reports
```bash
# Run tests with custom output directory
robot --outputdir results tests/

# Run tests with custom report names
robot --output custom_output.xml --log custom_log.html --report custom_report.html tests/
```

## Test Structure

- `tests/` - Test case files
  - `auth_tests.robot` - Authentication related tests
  - `todolist_tests.robot` - Todo list management tests
  - `todoitem_tests.robot` - Todo item management tests
  - `sharing_tests.robot` - List sharing and collaboration tests
- `resources/` - Shared resources and keywords
  - `common.robot` - Common keywords and setup
  - `auth_keywords.robot` - Authentication related keywords
  - `todolist_keywords.robot` - Todo list related keywords
- `variables/` - Test data and configuration
  - `test_data.robot` - Test data variables
  - `config.robot` - Configuration variables

## Test Coverage

The tests cover the following user stories:
1. User registration
2. User login/logout
3. Todo list creation and deletion
4. Todo list modification
5. Todo item creation and deletion
6. Todo item editing
7. Todo item completion status
8. Todo list sharing
9. Viewing shared todo lists

## Browser Configuration

Tests are configured to run in headless Chrome by default. To run with visible browser:
```bash
robot --variable HEADLESS:False tests/
```

## Troubleshooting

### Common Issues

1. **WebDriver not found**: The webdriver-manager should automatically download the correct ChromeDriver version.

2. **Application not running**: Ensure the application is running on localhost:4321 (frontend) and localhost:4322 (backend).

3. **Database issues**: If tests fail due to data conflicts, restart the application to reset the database:
   ```bash
   docker compose -f compose.dev.yml down
   docker compose -f compose.dev.yml up -d
   ```

4. **Port conflicts**: Ensure ports 4321 and 4322 are not used by other applications.

### Debug Mode
```bash
robot --loglevel DEBUG tests/
```

## Tags Reference

- `smoke` - Critical tests that should run on every commit
- `happy_path` - Positive flow tests
- `negative` - Error condition and edge case tests
- `auth` - Authentication related tests
- `todolist` - Todo list management tests
- `todoitem` - Todo item management tests
- `sharing` - Sharing and collaboration tests