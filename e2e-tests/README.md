# E2E Tests with Playwright

Comprehensive end-to-end tests for the Todo List application.

## Quick Start

1. **Install dependencies:**
   ```bash
   cd e2e-tests
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

3. **Start the application:**
   ```bash
   # From project root
   docker compose -f compose.dev.yml up -d
   ```

4. **Wait for services to be ready:**
   ```bash
   # Check frontend
   curl http://localhost:4321

   # Check backend
   curl http://localhost:4322/health
   ```

5. **Run tests:**
   ```bash
   npm test
   ```

## Test Coverage

The E2E tests cover all required user stories:

### ✅ Authentication
- User registration with validation
- User login/logout functionality  
- Authentication error handling
- Protected route access control

### ✅ Todo List Management
- Create todo lists with name and description
- Edit todo list details
- Delete todo lists (with confirmation for non-empty lists)
- View personal and shared todo lists

### ✅ Todo Item Management
- Create todo items with descriptions
- Edit todo item descriptions
- Toggle completion status
- Delete todo items
- Handle multiple items per list

### ✅ Sharing & Collaboration
- Share todo lists with other users
- Assign different roles (owner, editor, viewer)
- View shared todo lists in separate section
- Collaborate on shared lists with appropriate permissions

### ✅ Negative Scenarios
- Form validation errors
- Invalid login attempts
- Unauthorized access attempts
- Edge cases and error handling

## Available Commands

```bash
# Test execution
npm test                    # Run all tests
npm run test:headed         # Run with visible browser
npm run test:ui            # Run with Playwright UI
npx playwright test --grep "@smoke"  # Run only smoke tests

# Test reporting
npm run report             # View HTML test report
npx playwright show-report # Show last test report

# Debugging
npx playwright test --debug    # Debug mode
npx playwright test --trace on # Enable tracing
```

## Test Organization

```
e2e-tests/
├── tests/
│   ├── smoke.spec.js           # Basic functionality (@smoke tagged)
│   ├── authentication.spec.js  # User auth flows
│   ├── todo-lists.spec.js      # Todo list management
│   ├── todo-items.spec.js      # Todo item operations
│   └── sharing.spec.js         # Collaboration features
├── utils/
│   └── test-helpers.js         # Reusable test utilities
└── playwright.config.js       # Test configuration
```

## Test Tags

- `@smoke` - Critical tests for CI/CD smoke testing
- All tests include both happy path and negative scenarios

## CI/CD Integration

Tests are integrated with GitHub Actions:

- **Smoke tests** run on every push to `another-e2e` branch
- **Full test suite** runs on pull requests and nightly
- **Cross-browser testing** with Chromium, Firefox, and WebKit
- **Artifact collection** for failed test screenshots and reports

## Configuration

Tests are configured for:
- **Base URL**: `http://localhost:4321` (frontend)
- **Backends**: `http://localhost:4322` (API)
- **Browsers**: Chromium, Firefox, WebKit
- **Timeouts**: 30s test timeout, 5s action timeout
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: On failure only
- **Traces**: On first retry

## Test Data

- **Usernames**: `test_<timestamp>_<random>`
- **Passwords**: `TestPassword123!` (meets validation requirements)
- **Test isolation**: Each test uses unique data to avoid conflicts

## Troubleshooting

### Common Issues

1. **Services not running:**
   ```bash
   docker compose -f compose.dev.yml up -d
   ```

2. **Service health check:**
   ```bash
   docker compose -f compose.dev.yml ps
   curl http://localhost:4321/
   curl http://localhost:4322/health
   ```

3. **Port conflicts:**
   - Frontend: port 4321
   - Backend: port 4322  
   - Database: port 5431

4. **Test timeouts:**
   ```bash
   # Check Docker logs
   docker compose -f compose.dev.yml logs
   
   # Reset environment
   docker compose -f compose.dev.yml down
   docker compose -f compose.dev.yml up -d
   ```

5. **Database state issues:**
   ```bash
   # Complete reset
   docker compose -f compose.dev.yml down -v
   docker compose -f compose.dev.yml up -d
   ```

### Debug Commands

```bash
# Run specific test file
npx playwright test tests/authentication.spec.js

# Run with browser visible
npx playwright test --headed

# Debug specific test
npx playwright test --debug --grep "should register"

# Generate trace files
npx playwright test --trace on

# View traces
npx playwright show-trace trace.zip
```

### Performance Tips

- Use `--workers=1` for debugging
- Use `--project=chromium` for faster single-browser testing
- Use `--grep @smoke` for quick verification

## Browser Support

Tests run on multiple browsers:
- **Chromium** (Chrome/Edge equivalent)
- **Firefox** 
- **WebKit** (Safari equivalent)

Specify browser: `npx playwright test --project=firefox`

## Requirements Met

This test suite fulfills all E2E testing requirements:

✅ **Framework**: Playwright for reliable cross-browser automation  
✅ **Coverage**: All 10 user stories with happy and negative paths  
✅ **Structure**: Organized in `e2e-tests/` with `.spec.js` files  
✅ **Documentation**: Complete setup and execution instructions  
✅ **Reliability**: Tests indicate application faults, not test issues  
✅ **Quality**: Well-named, organized, readable test code  
✅ **CI/CD**: GitHub Actions integration with smoke and full test suites