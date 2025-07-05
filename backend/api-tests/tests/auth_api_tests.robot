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
    Clear Test Data
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
    ${user_data}    ${username}=    Register Unique User Via API
    ${response}=    Login User Via API    ${username}    ${TEST_USER_PASSWORD}
    ${login_data}=    Validate Login Response    ${response}
    Should Be Equal As Strings    ${login_data['${USERNAME_FIELD}']}    ${username}

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
    [Documentation]    Test that registration fails with empty username
    [Tags]    negative    validation    registration
    ${response}=    Register User Via API    ${EMPTY_STRING}    ${TEST_USER_PASSWORD}    ${HTTP_UNPROCESSABLE}
    Validate Error Response    ${response}

Registration Fails With Empty Password
    [Documentation]    Test that registration fails with empty password
    [Tags]    negative    validation    registration
    ${unique_username}=    Generate Unique Username
    ${response}=    Register User Via API    ${unique_username}    ${EMPTY_STRING}    ${HTTP_UNPROCESSABLE}
    Validate Error Response    ${response}

Registration Fails With Duplicate Username
    [Documentation]    Test that registration fails with existing username
    [Tags]    negative    validation    registration
    ${unique_username}=    Generate Unique Username
    Register User Via API    ${unique_username}    ${TEST_USER_PASSWORD}
    ${response}=    Register User Via API    ${unique_username}    ${TEST_USER_2_PASSWORD}    ${HTTP_UNPROCESSABLE}
    Validate Error Response    ${response}    User already exists

Login Fails With Invalid Username
    [Documentation]    Test that login fails with non-existent username
    [Tags]    negative    validation    login
    ${response}=    Login User Via API    ${INVALID_USERNAME}    ${TEST_USER_PASSWORD}    ${HTTP_UNPROCESSABLE}
    Validate Error Response    ${response}

Login Fails With Invalid Password
    [Documentation]    Test that login fails with wrong password
    [Tags]    negative    validation    login
    ${user_data}    ${username}=    Register Unique User Via API
    ${response}=    Login User Via API    ${username}    ${INVALID_PASSWORD}    ${HTTP_UNPROCESSABLE}
    Validate Error Response    ${response}

Login Fails With Empty Username
    [Documentation]    Test that login fails with empty username
    [Tags]    negative    validation    login
    ${response}=    Login User Via API    ${EMPTY_STRING}    ${TEST_USER_PASSWORD}    ${HTTP_UNPROCESSABLE}
    Validate Error Response    ${response}

Token Refresh Fails With Invalid Token
    [Documentation]    Test that token refresh fails with invalid tokens
    [Tags]    negative    validation    token_refresh
    ${response}=    Refresh Token Via API    invalid_token    invalid_refresh_token    ${HTTP_UNPROCESSABLE}
    Validate Error Response    ${response}