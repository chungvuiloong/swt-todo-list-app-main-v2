*** Settings ***
Documentation     Todo list API test cases
Resource          ../resources/api_common.robot
Resource          ../resources/auth_api_keywords.robot
Resource          ../resources/todolist_api_keywords.robot
Suite Setup       Setup API Test Suite
Suite Teardown    Teardown API Test Session
Test Tags         todolist    api

*** Keywords ***
Setup API Test Suite
    [Documentation]    Sets up API test suite
    Clear Test Data
    Setup API Test Session
    Wait For Service To Be Ready

*** Test Cases ***
Create Todo List Succeeds With Valid Data
    [Documentation]    Test that todo list creation works with valid data
    [Tags]    smoke    happy_path    create    crud
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${unique_name}=    Generate Unique List Name
    ${response}=    Create Todo List Via API    ${unique_name}    ${TEST_LIST_DESCRIPTION}    ${access_token}
    ${list_data}=    Validate Todo List Response    ${response}    ${unique_name}
    Should Be Equal As Strings    ${list_data['${LIST_NAME_FIELD}']}    ${unique_name}

Get Todo Lists Returns User Lists
    [Documentation]    Test that getting todo lists returns user's lists
    [Tags]    smoke    happy_path    read    crud
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${list_id}    ${list_name}=    Create Test Todo List And Get ID    ${access_token}
    ${response}=    Get Todo Lists Via API    ${access_token}
    ${lists}=    Validate Todo Lists Response    ${response}    1
    Should Be Equal As Strings    ${lists[0]['${LIST_NAME_FIELD}']}    ${list_name}

Get Todo List By ID Returns Specific List
    [Documentation]    Test that getting todo list by ID returns correct list
    [Tags]    smoke    happy_path    read    crud
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${list_id}    ${list_name}=    Create Test Todo List And Get ID    ${access_token}
    ${response}=    Get Todo List By ID Via API    ${list_id}    ${access_token}
    ${list_data}=    Validate Todo List Response    ${response}    ${list_name}
    Should Be Equal As Integers    ${list_data['${LIST_ID_FIELD}']}    ${list_id}

Update Todo List Succeeds With Valid Data
    [Documentation]    Test that todo list update works with valid data
    [Tags]    smoke    happy_path    update    crud
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${list_id}    ${list_name}=    Create Test Todo List And Get ID    ${access_token}
    ${response}=    Update Todo List Via API    ${list_id}    ${UPDATED_LIST_NAME}    ${UPDATED_LIST_DESCRIPTION}    ${access_token}
    ${list_data}=    Validate Todo List Response    ${response}    ${UPDATED_LIST_NAME}
    Should Be Equal As Strings    ${list_data['description']}    ${UPDATED_LIST_DESCRIPTION}

Delete Todo List Succeeds
    [Documentation]    Test that todo list deletion works
    [Tags]    smoke    happy_path    delete    crud
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${list_id}    ${list_name}=    Create Test Todo List And Get ID    ${access_token}
    ${response}=    Delete Todo List Via API    ${list_id}    ${access_token}
    Should Be Equal As Integers    ${response.status_code}    ${HTTP_OK}
    # Verify list is deleted
    ${response}=    Get Todo List By ID Via API    ${list_id}    ${access_token}    ${HTTP_NOT_FOUND}

Clone Todo List Creates Copy
    [Documentation]    Test that todo list cloning creates a copy
    [Tags]    happy_path    clone
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${list_id}    ${list_name}=    Create Test Todo List And Get ID    ${access_token}
    ${cloned_name}=    Set Variable    Cloned ${list_name}
    ${response}=    Clone Todo List Via API    ${list_id}    ${cloned_name}    ${access_token}
    ${cloned_data}=    Validate Todo List Response    ${response}    ${cloned_name}
    Should Not Be Equal As Integers    ${cloned_data['${LIST_ID_FIELD}']}    ${list_id}

Get Todo List Roles Returns Available Roles
    [Documentation]    Test that getting roles returns available roles
    [Tags]    happy_path    roles
    ${response}=    Get Todo List Roles Via API
    ${roles}=    Validate Todo List Roles Response    ${response}

Create Todo List Fails With Empty Name
    [Documentation]    Test that todo list creation fails with empty name
    [Tags]    negative    validation    create
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${response}=    Create Todo List Via API    ${EMPTY_STRING}    ${TEST_LIST_DESCRIPTION}    ${access_token}    ${HTTP_UNPROCESSABLE}
    Validate Error Response    ${response}

Create Todo List Fails Without Authentication
    [Documentation]    Test that todo list creation fails without auth token
    [Tags]    negative    validation    auth
    ${response}=    Create Todo List Via API    ${TEST_LIST_NAME}    ${TEST_LIST_DESCRIPTION}    invalid_token    ${HTTP_UNAUTHORIZED}
    Validate Error Response    ${response}

Get Todo List Fails For Non-Existent ID
    [Documentation]    Test that getting todo list fails for non-existent ID
    [Tags]    negative    validation    read
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${response}=    Get Todo List By ID Via API    999999    ${access_token}    ${HTTP_NOT_FOUND}
    Validate Error Response    ${response}    Todo list with id 999999 not found

Update Todo List Fails For Non-Existent ID
    [Documentation]    Test that updating todo list fails for non-existent ID
    [Tags]    negative    validation    update
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${response}=    Update Todo List Via API    999999    ${UPDATED_LIST_NAME}    ${UPDATED_LIST_DESCRIPTION}    ${access_token}    ${HTTP_NOT_FOUND}
    Validate Error Response    ${response}

Delete Todo List Fails For Non-Existent ID
    [Documentation]    Test that deleting todo list fails for non-existent ID
    [Tags]    negative    validation    delete
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${response}=    Delete Todo List Via API    999999    ${access_token}    ${HTTP_NOT_FOUND}
    Validate Error Response    ${response}