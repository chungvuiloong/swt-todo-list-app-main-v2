*** Settings ***
Documentation     Todo list sharing and collaboration test cases
Resource          ../resources/common.robot
Resource          ../resources/auth_keywords.robot
Resource          ../resources/todolist_keywords.robot
Resource          ../resources/todoitem_keywords.robot
Suite Setup       Clear Application Data
Test Setup        Setup Two Test Users
Test Teardown     Close Browser Session
Test Tags         sharing

*** Keywords ***
Setup Two Test Users
    [Documentation]    Sets up two test users for sharing tests
    Open Browser To Application
    ${unique_username_1}=    Generate Unique Username
    ${unique_username_2}=    Set Variable    ${unique_username_1}share
    ${unique_list_name}=    Generate Unique List Name
    Set Test Variable    ${TEST_USERNAME_1}    ${unique_username_1}
    Set Test Variable    ${TEST_USERNAME_2}    ${unique_username_2}
    Set Test Variable    ${TEST_LIST_NAME}    ${unique_list_name}
    
    # Register first user and create a list
    Register New User    ${TEST_USERNAME_1}    ${TEST_PASSWORD_1}
    Navigate To Todo Lists Page
    Create New Todo List    ${TEST_LIST_NAME}    ${TEST_LIST_DESCRIPTION}
    Logout User
    
    # Register second user
    Register New User    ${TEST_USERNAME_2}    ${TEST_PASSWORD_2}
    Logout User
    
    # Login as first user for sharing
    Login With Valid Credentials    ${TEST_USERNAME_1}    ${TEST_PASSWORD_1}
    Navigate To Todo Lists Page

*** Test Cases ***
User Can Share Todo List With Another User
    [Documentation]    Test that a user can share a todo list with another user
    [Tags]    smoke    happy_path    share
    Share Todo List With User    ${TEST_LIST_NAME}    ${TEST_USERNAME_2}    editor
    # Note: This test verifies the sharing action completes without errors
    # Actual sharing verification would require checking the shared user's view

Shared User Can View Shared Todo List
    [Documentation]    Test that a shared user can view a todo list shared with them
    [Tags]    smoke    happy_path    view_shared
    # First share the list
    Share Todo List With User    ${TEST_LIST_NAME}    ${TEST_USERNAME_2}    viewer
    
    # Switch to second user
    Logout User
    Login With Valid Credentials    ${TEST_USERNAME_2}    ${TEST_PASSWORD_2}
    Navigate To Todo Lists Page
    
    # Verify shared list is visible
    Verify Todo List Exists    ${TEST_LIST_NAME}

Shared User With Editor Role Can Add Items
    [Documentation]    Test that a shared user with editor role can add items to shared list
    [Tags]    happy_path    editor_permissions
    # Add an item as owner first
    Open Todo List    ${TEST_LIST_NAME}
    Create New Todo Item    ${TEST_ITEM_DESCRIPTION}
    Navigate Back To Todo Lists
    
    # Share with editor permissions
    Share Todo List With User    ${TEST_LIST_NAME}    ${TEST_USERNAME_2}    editor
    
    # Switch to second user
    Logout User
    Login With Valid Credentials    ${TEST_USERNAME_2}    ${TEST_PASSWORD_2}
    Navigate To Todo Lists Page
    Open Todo List    ${TEST_LIST_NAME}
    
    # Editor should be able to add items
    Create New Todo Item    ${TEST_ITEM_DESCRIPTION_2}
    Verify Todo Item Exists    ${TEST_ITEM_DESCRIPTION}
    Verify Todo Item Exists    ${TEST_ITEM_DESCRIPTION_2}

Shared User With Editor Role Can Edit Items
    [Documentation]    Test that a shared user with editor role can edit items in shared list
    [Tags]    happy_path    editor_permissions
    # Add an item as owner
    Open Todo List    ${TEST_LIST_NAME}
    Create New Todo Item    ${TEST_ITEM_DESCRIPTION}
    Navigate Back To Todo Lists
    
    # Share with editor permissions
    Share Todo List With User    ${TEST_LIST_NAME}    ${TEST_USERNAME_2}    editor
    
    # Switch to second user
    Logout User
    Login With Valid Credentials    ${TEST_USERNAME_2}    ${TEST_PASSWORD_2}
    Navigate To Todo Lists Page
    Open Todo List    ${TEST_LIST_NAME}
    
    # Editor should be able to edit items
    Edit Todo Item    ${TEST_ITEM_DESCRIPTION}    ${UPDATED_ITEM_DESCRIPTION}
    Verify Todo Item Exists    ${UPDATED_ITEM_DESCRIPTION}
    Verify Todo Item Does Not Exist    ${TEST_ITEM_DESCRIPTION}

Shared User Can Toggle Item Completion
    [Documentation]    Test that a shared user can toggle item completion status
    [Tags]    happy_path    editor_permissions
    # Add an item as owner
    Open Todo List    ${TEST_LIST_NAME}
    Create New Todo Item    ${TEST_ITEM_DESCRIPTION}
    Navigate Back To Todo Lists
    
    # Share with editor permissions
    Share Todo List With User    ${TEST_LIST_NAME}    ${TEST_USERNAME_2}    editor
    
    # Switch to second user
    Logout User
    Login With Valid Credentials    ${TEST_USERNAME_2}    ${TEST_PASSWORD_2}
    Navigate To Todo Lists Page
    Open Todo List    ${TEST_LIST_NAME}
    
    # Editor should be able to toggle completion
    Verify Todo Item Is Not Completed    ${TEST_ITEM_DESCRIPTION}
    Toggle Todo Item Completion    ${TEST_ITEM_DESCRIPTION}
    Verify Todo Item Is Completed    ${TEST_ITEM_DESCRIPTION}

Owner Can View Shared List After Changes
    [Documentation]    Test that owner can see changes made by shared users
    [Tags]    happy_path    collaboration
    # Share the list first
    Share Todo List With User    ${TEST_LIST_NAME}    ${TEST_USERNAME_2}    editor
    
    # Switch to second user and make changes
    Logout User
    Login With Valid Credentials    ${TEST_USERNAME_2}    ${TEST_PASSWORD_2}
    Navigate To Todo Lists Page
    Open Todo List    ${TEST_LIST_NAME}
    Create New Todo Item    ${TEST_ITEM_DESCRIPTION}
    
    # Switch back to owner
    Logout User
    Login With Valid Credentials    ${TEST_USERNAME_1}    ${TEST_PASSWORD_1}
    Navigate To Todo Lists Page
    Open Todo List    ${TEST_LIST_NAME}
    
    # Owner should see the changes
    Verify Todo Item Exists    ${TEST_ITEM_DESCRIPTION}