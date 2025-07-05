*** Variables ***
# API Configuration
${API_BASE_URL}           http://localhost:4322
${API_USERS_URL}          ${API_BASE_URL}/api/users
${API_TODOLISTS_URL}      ${API_BASE_URL}/api/todo-lists
${API_DOCS_URL}           ${API_BASE_URL}/docs

# Request Headers
${CONTENT_TYPE_JSON}      application/json
${ACCEPT_JSON}            application/json

# HTTP Status Codes
${HTTP_OK}                200
${HTTP_CREATED}           201
${HTTP_NO_CONTENT}        204
${HTTP_BAD_REQUEST}       400
${HTTP_UNAUTHORIZED}      401
${HTTP_FORBIDDEN}         403
${HTTP_NOT_FOUND}         404
${HTTP_CONFLICT}          409
${HTTP_UNPROCESSABLE}     422
${HTTP_SERVER_ERROR}      500

# Timeouts
${REQUEST_TIMEOUT}        30
${CONNECTION_TIMEOUT}     10

# Test Session
${TEST_SESSION}           api_test_session