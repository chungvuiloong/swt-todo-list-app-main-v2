# E2E Tests with Playwright

Simple end-to-end tests for the Todo app.

## Quick Start

1. **Install dependencies:**
   ```bash
   cd e2e
   npm install
   ```

2. **Start the app:**
   ```bash
   # From project root
   docker compose -f compose.dev.yml up -d
   ```

3. **Run tests:**
   ```bash
   npm test
   ```

## Available Commands

```bash
npm test              # Run all tests
npm run test:headed   # Run with visible browser
npm run test:ui       # Run with Playwright UI
npm run report        # View test results
```

## What's Tested

- ✅ Basic page loading
- ✅ User registration
- ✅ User login/logout  
- ✅ Todo list creation
- ✅ Todo item management

## Troubleshooting

**Tests failing?**
1. Make sure Docker is running: `docker compose -f compose.dev.yml ps`
2. Check if services are healthy: `curl http://localhost:4321`
3. Reset if needed: `docker compose -f compose.dev.yml down && docker compose -f compose.dev.yml up -d`

**Need to debug?**
```bash
npx playwright test --debug
```

That's it! 🎉