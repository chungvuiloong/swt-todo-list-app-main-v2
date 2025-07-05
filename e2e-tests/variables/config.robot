*** Variables ***
# Application URLs
${BASE_URL}                 http://localhost:4321
${API_BASE_URL}            http://localhost:4322
${LOGIN_URL}               ${BASE_URL}/login
${REGISTER_URL}            ${BASE_URL}/register
${TODOS_URL}               ${BASE_URL}/todos
${TODO_LISTS_URL}          ${BASE_URL}/todo-lists

# Browser Configuration
${BROWSER}                 Chrome
${HEADLESS}               True
${IMPLICIT_WAIT}          10
${EXPLICIT_WAIT}          30

# Test Data
${VALID_USERNAME}         testuser
${VALID_PASSWORD}         testpass123
${VALID_USERNAME_2}       testuser2
${VALID_PASSWORD_2}       testpass456

# Timeouts
${SHORT_TIMEOUT}          5s
${MEDIUM_TIMEOUT}         15s
${LONG_TIMEOUT}           30s