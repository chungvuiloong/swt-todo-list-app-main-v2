*** Variables ***
# User Test Data
${TEST_USER_USERNAME}     apitestuser
${TEST_USER_PASSWORD}     ApiTest123!
${TEST_USER_2_USERNAME}   apitestuser2
${TEST_USER_2_PASSWORD}   ApiTest456!

# Invalid User Data
${INVALID_USERNAME}       nonexistentuser
${INVALID_PASSWORD}       wrongpassword
${EMPTY_STRING}           ${EMPTY}
${SHORT_PASSWORD}         123

# Todo List Test Data
${TEST_LIST_NAME}         API Test Todo List
${TEST_LIST_DESCRIPTION}  Test description for API testing
${UPDATED_LIST_NAME}      Updated API Test List
${UPDATED_LIST_DESCRIPTION}  Updated description for API testing

# Todo Item Test Data
${TEST_ITEM_DESCRIPTION}  API test todo item
${TEST_ITEM_DUE_DATE}     2024-12-31
${UPDATED_ITEM_DESCRIPTION}  Updated API test todo item
${INVALID_DUE_DATE}       invalid-date-format

# JSON Templates
${VALID_USER_JSON}        {"username": "${TEST_USER_USERNAME}", "password": "${TEST_USER_PASSWORD}"}
${VALID_USER_2_JSON}      {"username": "${TEST_USER_2_USERNAME}", "password": "${TEST_USER_2_PASSWORD}"}
${EMPTY_USERNAME_JSON}    {"username": "", "password": "${TEST_USER_PASSWORD}"}
${EMPTY_PASSWORD_JSON}    {"username": "${TEST_USER_USERNAME}", "password": ""}

${VALID_LIST_JSON}        {"name": "${TEST_LIST_NAME}", "description": "${TEST_LIST_DESCRIPTION}"}
${EMPTY_NAME_LIST_JSON}   {"name": "", "description": "${TEST_LIST_DESCRIPTION}"}
${UPDATE_LIST_JSON}       {"name": "${UPDATED_LIST_NAME}", "description": "${UPDATED_LIST_DESCRIPTION}"}

${VALID_ITEM_JSON}        {"description": "${TEST_ITEM_DESCRIPTION}"}
${VALID_ITEM_WITH_DATE_JSON}  {"description": "${TEST_ITEM_DESCRIPTION}", "due_date": "${TEST_ITEM_DUE_DATE}"}
${EMPTY_DESCRIPTION_JSON}  {"description": ""}
${INVALID_DATE_JSON}      {"description": "${TEST_ITEM_DESCRIPTION}", "due_date": "${INVALID_DUE_DATE}"}
${UPDATE_ITEM_JSON}       {"description": "${UPDATED_ITEM_DESCRIPTION}", "completed": true}

# Response Field Names
${USER_ID_FIELD}          userId
${USERNAME_FIELD}         username
${ACCESS_TOKEN_FIELD}     accessToken
${REFRESH_TOKEN_FIELD}    refreshToken
${LIST_ID_FIELD}          id
${LIST_NAME_FIELD}        name
${ITEM_ID_FIELD}          id
${ITEM_DESCRIPTION_FIELD}  description
${ITEM_COMPLETED_FIELD}   completed