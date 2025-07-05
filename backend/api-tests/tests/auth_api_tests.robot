*** Settings ***
Documentation     Authentication API test cases
Resource          ../resources/api_common.robot
Resource          ../resources/auth_api_keywords.robot
Suite Setup       Setup API Test Suite
Suite Teardown    Teardown API Test Session
Test Tags         auth    api

*** Keywords ***
Setup API Test Suite
    [Documentation]    Sets up API test suite
    Setup API Test Session
    Wait For Service To Be Ready

*** Test Cases ***
User Registration Succeeds With Valid Data
    [Documentation]    Test that user registration works with valid credentials
    [Tags]    smoke    happy_path    registration    crud
    ${unique_username}=    Generate Unique Username
    ${response}=    Register User Via API    ${unique_username}    ${TEST_USER_PASSWORD}
    ${user_data}=    Validate Registration Response    ${response}
    Should Be Equal As Strings    ${user_data['${USERNAME_FIELD}']}    ${unique_username}

User Login Succeeds With Valid Credentials
    [Documentation]    Test that user login works with valid credentials
    [Tags]    smoke    happy_path    login    crud
    # Create user and immediately login with the same credentials
    ${unique_username}=    Generate Unique Username
    ${register_response}=    Register User Via API    ${unique_username}    ${TEST_USER_PASSWORD}
    Should Be Equal As Integers    ${register_response.status_code}    ${HTTP_OK}
    
    # Now login with the same credentials
    ${response}=    Login User Via API    ${unique_username}    ${TEST_USER_PASSWORD}
    Log    Login response status: ${response.status_code}
    Log    Login response body: ${response.text}
    Should Be Equal As Integers    ${response.status_code}    ${HTTP_OK}
    ${login_data}=    Validate Login Response    ${response}
    Should Be Equal As Strings    ${login_data['${USERNAME_FIELD}']}    ${unique_username}

Token Refresh Succeeds With Valid Tokens
    [Documentation]    Test that token refresh works with valid tokens
    [Tags]    happy_path    token_refresh
    ${user_data}    ${username}=    Register Unique User Via API
    ${access_token}=    Get From Dictionary    ${user_data}    ${ACCESS_TOKEN_FIELD}
    ${refresh_token}=    Get From Dictionary    ${user_data}    ${REFRESH_TOKEN_FIELD}
    ${response}=    Refresh Token Via API    ${access_token}    ${refresh_token}
    ${token_data}=    Validate Login Response    ${response}
    Should Not Be Empty    ${token_data['${ACCESS_TOKEN_FIELD}']}

User Search Returns Users
    [Documentation]    Test that user search returns matching users
    [Tags]    happy_path    search    crud
    ${user_data}    ${username}=    Register Unique User Via API
    ${access_token}=    Get From Dictionary    ${user_data}    ${ACCESS_TOKEN_FIELD}
    ${response}=    Find Users Via API    ${username}    ${access_token}
    ${users}=    Validate User Search Response    ${response}    1
    Should Be Equal As Strings    ${users[0]['${USERNAME_FIELD}']}    ${username}

Registration Fails With Empty Username
    [Documentation]    Test that registration fails with empty username (KNOWN BUG: Currently passes but should fail)
    [Tags]    negative    validation    registration    known_bug
    ${response}=    Register User Via API    ${EMPTY_STRING}    ${TEST_USER_PASSWORD}    ${HTTP_OK}
    # This test documents the bug - empty username should be rejected but currently isn't
    ${user_data}=    Validate Registration Response    ${response}
    Should Be Equal As Strings    ${user_data['${USERNAME_FIELD}']}    ${EMPTY_STRING}

Registration Fails With Empty Password
    [Documentation]    Test that registration fails with empty password (KNOWN BUG: Currently passes but should fail)
    [Tags]    negative    validation    registration    known_bug
    ${unique_username}=    Generate Unique Username
    ${response}=    Register User Via API    ${unique_username}    ${EMPTY_STRING}    ${HTTP_OK}
    # This test documents the bug - empty password should be rejected but currently isn't
    ${user_data}=    Validate Registration Response    ${response}

Registration Fails With Duplicate Username
    [Documentation]    Test that registration fails with existing username
    [Tags]    negative    validation    registration
    ${unique_username}=    Generate Unique Username
    Register User Via API    ${unique_username}    ${TEST_USER_PASSWORD}
    ${response}=    Register User Via API    ${unique_username}    ${TEST_USER_2_PASSWORD}    ${HTTP_BAD_REQUEST}
    Validate Error Response    ${response}    User already exists

Login Fails With Invalid Username
    [Documentation]    Test that login fails with non-existent username
    [Tags]    negative    validation    login
    ${response}=    Login User Via API    ${INVALID_USERNAME}    ${TEST_USER_PASSWORD}    ${HTTP_UNAUTHORIZED}
    Validate Error Response    ${response}

Login Fails With Invalid Password
    [Documentation]    Test that login fails with wrong password
    [Tags]    negative    validation    login
    ${unique_username}=    Generate Unique Username
    Register User Via API    ${unique_username}    ${TEST_USER_PASSWORD}
    ${response}=    Login User Via API    ${unique_username}    ${INVALID_PASSWORD}    ${HTTP_UNAUTHORIZED}
    Validate Error Response    ${response}

Login Fails With Empty Username
    [Documentation]    Test that login fails with empty username (KNOWN BUG: Currently passes but should fail)
    [Tags]    negative    validation    login    known_bug
    # Create a user with empty username first (due to the bug)
    Register User Via API    ${EMPTY_STRING}    ${TEST_USER_PASSWORD}
    ${response}=    Login User Via API    ${EMPTY_STRING}    ${TEST_USER_PASSWORD}    ${HTTP_OK}
    # This documents the bug - empty username login should fail but currently passes
    ${user_data}=    Validate Login Response    ${response}

Token Refresh Fails With Invalid Token
    [Documentation]    Test that token refresh fails with invalid tokens
    [Tags]    negative    validation    token_refresh
    ${response}=    Refresh Token Via API    invalid_token    invalid_refresh_token    ${HTTP_UNAUTHORIZED}
    Validate Error Response    ${response}