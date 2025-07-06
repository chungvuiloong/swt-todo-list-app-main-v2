*** Settings ***
Documentation     Debug login flow
Resource          resources/common.robot
Resource          resources/auth_keywords.robot
Suite Setup       Clear Application Data
Test Setup        Open Browser To Application And Navigate To Home
Test Teardown     Close Browser Session

*** Test Cases ***
Debug Login Flow
    [Documentation]    Debug the login flow step by step
    ${unique_username}=    Generate Unique Username
    ${current_url}=    Get Location
    Log To Console    Starting URL: ${current_url}
    
    # Register user first
    Navigate To Register Page
    Fill Register Form    ${unique_username}    ${TEST_PASSWORD_1}
    Submit Register Form
    Sleep    3s
    ${current_url}=    Get Location
    Log To Console    After registration URL: ${current_url}
    
    # Now test logout
    Logout User
    ${current_url}=    Get Location
    Log To Console    After logout URL: ${current_url}
    
    # Test login
    Navigate To Login Page
    Fill Login Form    ${unique_username}    ${TEST_PASSWORD_1}
    Submit Login Form
    Sleep    5s
    ${current_url}=    Get Location
    Log To Console    After login URL: ${current_url}
    
    # Check if we're on todos page
    ${contains_todos}=    Run Keyword And Return Status    Location Should Contain    /todos
    Log To Console    Location contains /todos: ${contains_todos}
    
    # Check if todos page elements exist
    ${todos_page_exists}=    Run Keyword And Return Status    Page Should Contain Element    css:[data-testid="todos-page"]
    Log To Console    Todos page element exists: ${todos_page_exists}