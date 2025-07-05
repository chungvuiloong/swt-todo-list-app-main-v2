*** Settings ***
Documentation     Todo list management test cases
Resource          ../resources/common.robot
Resource          ../resources/auth_keywords.robot
Resource          ../resources/todolist_keywords.robot
Suite Setup       Clear Application Data
Test Setup        Setup Test User And Navigate To Todos
Test Teardown     Close Browser Session
Test Tags         todolist

*** Keywords ***
Setup Test User And Navigate To Todos
    [Documentation]    Sets up a test user and navigates to todos page
    Open Browser To Application
    ${unique_username}=    Generate Unique Username
    Set Test Variable    ${TEST_USERNAME}    ${unique_username}
    Register New User    ${TEST_USERNAME}    ${TEST_PASSWORD_1}
    Navigate To Todo Lists Page

*** Test Cases ***
User Can Create Todo List
    [Documentation]    Test that a user can create a new todo list
    [Tags]    smoke    happy_path    create
    ${unique_list_name}=    Generate Unique List Name
    Create New Todo List    ${unique_list_name}    ${TEST_LIST_DESCRIPTION}
    Verify Todo List Exists    ${unique_list_name}

User Can Create Todo List Without Description
    [Documentation]    Test that a user can create a todo list without description
    [Tags]    happy_path    create
    ${unique_list_name}=    Generate Unique List Name
    Create New Todo List    ${unique_list_name}
    Verify Todo List Exists    ${unique_list_name}

User Can Edit Todo List Name
    [Documentation]    Test that a user can edit todo list name
    [Tags]    smoke    happy_path    edit
    ${unique_list_name}=    Generate Unique List Name
    ${updated_list_name}=    Set Variable    ${unique_list_name} Updated
    Create New Todo List    ${unique_list_name}    ${TEST_LIST_DESCRIPTION}
    Edit Todo List    ${unique_list_name}    ${updated_list_name}    ${UPDATED_LIST_DESCRIPTION}
    Verify Todo List Exists    ${updated_list_name}
    Verify Todo List Does Not Exist    ${unique_list_name}

User Can Edit Todo List Description
    [Documentation]    Test that a user can edit todo list description
    [Tags]    happy_path    edit
    ${unique_list_name}=    Generate Unique List Name
    Create New Todo List    ${unique_list_name}    ${TEST_LIST_DESCRIPTION}
    Edit Todo List    ${unique_list_name}    ${unique_list_name}    ${UPDATED_LIST_DESCRIPTION}
    Verify Todo List Exists    ${unique_list_name}

User Can Delete Todo List
    [Documentation]    Test that a user can delete a todo list
    [Tags]    smoke    happy_path    delete
    ${unique_list_name}=    Generate Unique List Name
    Create New Todo List    ${unique_list_name}    ${TEST_LIST_DESCRIPTION}
    Verify Todo List Exists    ${unique_list_name}
    Delete Todo List    ${unique_list_name}
    Verify Todo List Does Not Exist    ${unique_list_name}

User Can Open Todo List
    [Documentation]    Test that a user can open a todo list to view items
    [Tags]    happy_path    view
    ${unique_list_name}=    Generate Unique List Name
    Create New Todo List    ${unique_list_name}    ${TEST_LIST_DESCRIPTION}
    Open Todo List    ${unique_list_name}
    Page Should Contain Element    css:[data-testid="todo-list-view"]

Create Todo List Fails With Empty Name
    [Documentation]    Test that creating todo list fails with empty name
    [Tags]    negative    create
    Open Create Todo List Dialog
    Fill Create Todo List Form    ${EMPTY_LIST_NAME}    ${TEST_LIST_DESCRIPTION}
    Submit Create Todo List Form
    Verify Create Todo List Error    Name cannot be empty

User Can Create Multiple Todo Lists
    [Documentation]    Test that a user can create multiple todo lists
    [Tags]    happy_path    create
    ${unique_list_name_1}=    Generate Unique List Name
    ${unique_list_name_2}=    Set Variable    ${unique_list_name_1} Second
    Create New Todo List    ${unique_list_name_1}    ${TEST_LIST_DESCRIPTION}
    Create New Todo List    ${unique_list_name_2}    ${TEST_LIST_DESCRIPTION}
    Verify Todo List Exists    ${unique_list_name_1}
    Verify Todo List Exists    ${unique_list_name_2}