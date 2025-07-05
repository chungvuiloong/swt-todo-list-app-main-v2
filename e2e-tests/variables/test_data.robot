*** Variables ***
# User Test Data
${TEST_USER_1}            robotuser1
${TEST_PASSWORD_1}        RobotPass123!
${TEST_USER_2}            robotuser2  
${TEST_PASSWORD_2}        RobotPass456!
${TEST_USER_3}            robotuser3
${TEST_PASSWORD_3}        RobotPass789!

# Invalid User Data
${INVALID_USERNAME}       invaliduser
${INVALID_PASSWORD}       wrongpass
${EMPTY_USERNAME}         ${EMPTY}
${EMPTY_PASSWORD}         ${EMPTY}
${SHORT_PASSWORD}         123

# Todo List Test Data
${TEST_LIST_NAME}         Robot Test List
${TEST_LIST_DESCRIPTION}  A test todo list created by Robot Framework
${UPDATED_LIST_NAME}      Updated Robot Test List
${UPDATED_LIST_DESCRIPTION}  Updated description for the test list
${EMPTY_LIST_NAME}        ${EMPTY}

# Todo Item Test Data
${TEST_ITEM_DESCRIPTION}  Robot test todo item
${UPDATED_ITEM_DESCRIPTION}  Updated robot test todo item
${TEST_ITEM_DESCRIPTION_2}  Second robot test item
${EMPTY_ITEM_DESCRIPTION}  ${EMPTY}

# Sharing Test Data
${SHARE_USER_ROLE}        editor
${VIEW_USER_ROLE}         viewer

# Common UI Elements
${LOADING_INDICATOR}      css:.loading
${ERROR_MESSAGE}          css:.error
${SUCCESS_MESSAGE}        css:.success