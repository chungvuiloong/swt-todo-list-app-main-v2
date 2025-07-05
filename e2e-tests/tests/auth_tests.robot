*** Settings ***
Documentation     Authentication related test cases
Resource          ../resources/common.robot
Resource          ../resources/auth_keywords.robot
Suite Setup       Clear Application Data
Test Setup        Open Browser To Application And Navigate To Home
Test Teardown     Close Browser Session
Test Tags         auth

*** Test Cases ***
User Can Register Successfully
    [Documentation]    Test that a user can register with valid credentials
    [Tags]    smoke    happy_path    registration
    ${unique_username}=    Generate Unique Username
    Register New User    ${unique_username}    ${TEST_PASSWORD_1}
    Verify User Is Logged In

User Can Login Successfully
    [Documentation]    Test that a user can login with valid credentials
    [Tags]    smoke    happy_path    login
    ${unique_username}=    Generate Unique Username
    Register New User    ${unique_username}    ${TEST_PASSWORD_1}
    Logout User
    Login With Valid Credentials    ${unique_username}    ${TEST_PASSWORD_1}
    Verify User Is Logged In

User Can Logout Successfully
    [Documentation]    Test that a user can logout from the application
    [Tags]    smoke    happy_path    logout
    ${unique_username}=    Generate Unique Username
    Register New User    ${unique_username}    ${TEST_PASSWORD_1}
    Verify User Is Logged In
    Logout User
    Verify User Is Logged Out

Registration Fails With Empty Username
    [Documentation]    Test that registration fails when username is empty
    [Tags]    negative    registration
    Register With Invalid Data Should Fail    ${EMPTY_USERNAME}    ${TEST_PASSWORD_1}    Username cannot be empty

Registration Fails With Empty Password
    [Documentation]    Test that registration fails when password is empty
    [Tags]    negative    registration
    ${unique_username}=    Generate Unique Username
    Register With Invalid Data Should Fail    ${unique_username}    ${EMPTY_PASSWORD}    Password cannot be empty

Registration Fails With Short Password
    [Documentation]    Test that registration fails when password is too short
    [Tags]    negative    registration
    ${unique_username}=    Generate Unique Username
    Register With Invalid Data Should Fail    ${unique_username}    ${SHORT_PASSWORD}    Password must be at least 8 characters

Registration Fails With Duplicate Username
    [Documentation]    Test that registration fails when username already exists
    [Tags]    negative    registration
    ${unique_username}=    Generate Unique Username
    Register New User    ${unique_username}    ${TEST_PASSWORD_1}
    Logout User
    Register With Invalid Data Should Fail    ${unique_username}    ${TEST_PASSWORD_2}    User already exists

Login Fails With Invalid Username
    [Documentation]    Test that login fails with non-existent username
    [Tags]    negative    login
    Login With Invalid Credentials Should Fail    ${INVALID_USERNAME}    ${TEST_PASSWORD_1}    Invalid credentials

Login Fails With Invalid Password
    [Documentation]    Test that login fails with wrong password
    [Tags]    negative    login
    ${unique_username}=    Generate Unique Username
    Register New User    ${unique_username}    ${TEST_PASSWORD_1}
    Logout User
    Login With Invalid Credentials Should Fail    ${unique_username}    ${INVALID_PASSWORD}    Invalid credentials

Login Fails With Empty Username
    [Documentation]    Test that login fails when username is empty
    [Tags]    negative    login
    Login With Invalid Credentials Should Fail    ${EMPTY_USERNAME}    ${TEST_PASSWORD_1}    Username cannot be empty

Login Fails With Empty Password
    [Documentation]    Test that login fails when password is empty
    [Tags]    negative    login
    ${unique_username}=    Generate Unique Username
    Login With Invalid Credentials Should Fail    ${unique_username}    ${EMPTY_PASSWORD}    Password cannot be empty