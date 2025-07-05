*** Settings ***
Resource    common.robot

*** Keywords ***
Navigate To Login Page
    [Documentation]    Navigates to the login page
    Go To    ${LOGIN_URL}
    Wait For Page To Load
    Page Should Contain Element    css:form[data-testid="login-form"]

Navigate To Register Page
    [Documentation]    Navigates to the registration page
    Log    Navigating to registration URL: ${REGISTER_URL}
    Go To    ${REGISTER_URL}
    Wait For Page To Load
    ${current_url}=    Get Location
    Log    Current URL after navigation: ${current_url}
    Log Source
    Page Should Contain Element    css:form[data-testid="register-form"]

Fill Login Form
    [Arguments]    ${username}    ${password}
    [Documentation]    Fills the login form with provided credentials
    Wait For Element And Input Text    css:input[name="username"]    ${username}
    Wait For Element And Input Text    css:input[name="password"]    ${password}

Fill Register Form
    [Arguments]    ${username}    ${password}
    [Documentation]    Fills the registration form with provided credentials
    Wait For Element And Input Text    css:input[name="username"]    ${username}
    Wait For Element And Input Text    css:input[name="password"]    ${password}

Submit Login Form
    [Documentation]    Submits the login form
    Wait For Element And Click    css:button[type="submit"]

Submit Register Form
    [Documentation]    Submits the registration form
    Wait For Element And Click    css:button[type="submit"]

Login With Valid Credentials
    [Arguments]    ${username}=${TEST_USER_1}    ${password}=${TEST_PASSWORD_1}
    [Documentation]    Performs login with valid credentials
    Navigate To Login Page
    Fill Login Form    ${username}    ${password}
    Submit Login Form
    Wait Until Location Contains    /todos    ${EXPLICIT_WAIT}
    Page Should Contain Element    css:[data-testid="todos-page"]

Register New User
    [Arguments]    ${username}=${TEST_USER_1}    ${password}=${TEST_PASSWORD_1}
    [Documentation]    Registers a new user account
    Navigate To Register Page
    Fill Register Form    ${username}    ${password}
    Submit Register Form
    Wait Until Location Contains    /todos    ${EXPLICIT_WAIT}
    Page Should Contain Element    css:[data-testid="todos-page"]

Logout User
    [Documentation]    Logs out the current user
    Wait For Element And Click    css:[data-testid="logout-button"]
    Wait Until Location Contains    /login    ${EXPLICIT_WAIT}
    Page Should Contain Element    css:form[data-testid="login-form"]

Verify Login Error Message
    [Arguments]    ${expected_message}
    [Documentation]    Verifies that login error message is displayed
    Wait Until Element Is Visible    css:[data-testid="error-message"]    ${MEDIUM_TIMEOUT}
    Verify Element Contains Text    css:[data-testid="error-message"]    ${expected_message}

Verify Registration Error Message
    [Arguments]    ${expected_message}
    [Documentation]    Verifies that registration error message is displayed
    Wait Until Element Is Visible    css:[data-testid="error-message"]    ${MEDIUM_TIMEOUT}
    Verify Element Contains Text    css:[data-testid="error-message"]    ${expected_message}

Verify User Is Logged In
    [Documentation]    Verifies that user is successfully logged in
    Location Should Contain    /todos
    Page Should Contain Element    css:[data-testid="todos-page"]
    Page Should Contain Element    css:[data-testid="logout-button"]

Verify User Is Logged Out
    [Documentation]    Verifies that user is successfully logged out
    Location Should Contain    /login
    Page Should Contain Element    css:form[data-testid="login-form"]
    Page Should Not Contain Element    css:[data-testid="logout-button"]

Login With Invalid Credentials Should Fail
    [Arguments]    ${username}    ${password}    ${expected_error}
    [Documentation]    Attempts login with invalid credentials and verifies failure
    Navigate To Login Page
    Fill Login Form    ${username}    ${password}
    Submit Login Form
    Verify Login Error Message    ${expected_error}
    Location Should Contain    /login

Register With Invalid Data Should Fail
    [Arguments]    ${username}    ${password}    ${expected_error}
    [Documentation]    Attempts registration with invalid data and verifies failure
    Navigate To Register Page
    Fill Register Form    ${username}    ${password}
    Submit Register Form
    Verify Registration Error Message    ${expected_error}
    Location Should Contain    /register