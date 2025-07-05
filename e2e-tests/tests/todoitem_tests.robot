*** Settings ***
Documentation     Todo item management test cases
Resource          ../resources/common.robot
Resource          ../resources/auth_keywords.robot
Resource          ../resources/todolist_keywords.robot
Resource          ../resources/todoitem_keywords.robot
Suite Setup       Clear Application Data
Test Setup        Setup Test User With Todo List
Test Teardown     Close Browser Session
Test Tags         todoitem

*** Keywords ***
Setup Test User With Todo List
    [Documentation]    Sets up a test user with a todo list for item testing
    Open Browser To Application
    ${unique_username}=    Generate Unique Username
    ${unique_list_name}=    Generate Unique List Name
    Set Test Variable    ${TEST_USERNAME}    ${unique_username}
    Set Test Variable    ${TEST_LIST_NAME}    ${unique_list_name}
    Register New User    ${TEST_USERNAME}    ${TEST_PASSWORD_1}
    Navigate To Todo Lists Page
    Create New Todo List    ${TEST_LIST_NAME}    ${TEST_LIST_DESCRIPTION}
    Open Todo List    ${TEST_LIST_NAME}

*** Test Cases ***
User Can Create Todo Item
    [Documentation]    Test that a user can create a new todo item
    [Tags]    smoke    happy_path    create
    Create New Todo Item    ${TEST_ITEM_DESCRIPTION}
    Verify Todo Item Exists    ${TEST_ITEM_DESCRIPTION}

User Can Create Todo Item With Due Date
    [Documentation]    Test that a user can create a todo item with due date
    [Tags]    happy_path    create
    Create New Todo Item    ${TEST_ITEM_DESCRIPTION}    2024-12-31
    Verify Todo Item Exists    ${TEST_ITEM_DESCRIPTION}

User Can Edit Todo Item Description
    [Documentation]    Test that a user can edit todo item description
    [Tags]    smoke    happy_path    edit
    Create New Todo Item    ${TEST_ITEM_DESCRIPTION}
    Edit Todo Item    ${TEST_ITEM_DESCRIPTION}    ${UPDATED_ITEM_DESCRIPTION}
    Verify Todo Item Exists    ${UPDATED_ITEM_DESCRIPTION}
    Verify Todo Item Does Not Exist    ${TEST_ITEM_DESCRIPTION}

User Can Toggle Todo Item Completion Status
    [Documentation]    Test that a user can toggle todo item completion
    [Tags]    smoke    happy_path    completion
    Create New Todo Item    ${TEST_ITEM_DESCRIPTION}
    Verify Todo Item Is Not Completed    ${TEST_ITEM_DESCRIPTION}
    Toggle Todo Item Completion    ${TEST_ITEM_DESCRIPTION}
    Verify Todo Item Is Completed    ${TEST_ITEM_DESCRIPTION}
    Toggle Todo Item Completion    ${TEST_ITEM_DESCRIPTION}
    Verify Todo Item Is Not Completed    ${TEST_ITEM_DESCRIPTION}

User Can Delete Todo Item
    [Documentation]    Test that a user can delete a todo item
    [Tags]    smoke    happy_path    delete
    Create New Todo Item    ${TEST_ITEM_DESCRIPTION}
    Verify Todo Item Exists    ${TEST_ITEM_DESCRIPTION}
    Delete Todo Item    ${TEST_ITEM_DESCRIPTION}
    Verify Todo Item Does Not Exist    ${TEST_ITEM_DESCRIPTION}

Create Todo Item Fails With Empty Description
    [Documentation]    Test that creating todo item fails with empty description
    [Tags]    negative    create
    Open Create Todo Item Dialog
    Fill Create Todo Item Form    ${EMPTY_ITEM_DESCRIPTION}
    Submit Create Todo Item Form
    Verify Create Todo Item Error    Description cannot be empty

User Can Create Multiple Todo Items
    [Documentation]    Test that a user can create multiple todo items in a list
    [Tags]    happy_path    create
    Create New Todo Item    ${TEST_ITEM_DESCRIPTION}
    Create New Todo Item    ${TEST_ITEM_DESCRIPTION_2}
    Verify Todo Item Exists    ${TEST_ITEM_DESCRIPTION}
    Verify Todo Item Exists    ${TEST_ITEM_DESCRIPTION_2}

User Can Complete Multiple Todo Items
    [Documentation]    Test that a user can complete multiple todo items
    [Tags]    happy_path    completion
    Create New Todo Item    ${TEST_ITEM_DESCRIPTION}
    Create New Todo Item    ${TEST_ITEM_DESCRIPTION_2}
    Toggle Todo Item Completion    ${TEST_ITEM_DESCRIPTION}
    Toggle Todo Item Completion    ${TEST_ITEM_DESCRIPTION_2}
    Verify Todo Item Is Completed    ${TEST_ITEM_DESCRIPTION}
    Verify Todo Item Is Completed    ${TEST_ITEM_DESCRIPTION_2}

User Can Navigate Back To Todo Lists
    [Documentation]    Test that a user can navigate back to todo lists from item view
    [Tags]    happy_path    navigation
    Navigate Back To Todo Lists
    Page Should Contain Element    css:[data-testid="todos-page"]
    Verify Todo List Exists    ${TEST_LIST_NAME}