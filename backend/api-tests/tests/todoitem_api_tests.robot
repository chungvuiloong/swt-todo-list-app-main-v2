*** Settings ***
Documentation     Todo item API test cases
Resource          ../resources/api_common.robot
Resource          ../resources/auth_api_keywords.robot
Resource          ../resources/todolist_api_keywords.robot
Suite Setup       Setup API Test Suite
Suite Teardown    Teardown API Test Session
Test Tags         todoitem    api

*** Keywords ***
Setup API Test Suite
    [Documentation]    Sets up API test suite
    Clear Test Data
    Setup API Test Session
    Wait For Service To Be Ready

Create Todo Item Via API
    [Arguments]    ${list_id}    ${description}    ${token}    ${due_date}=${EMPTY}    ${expected_status}=${HTTP_OK}
    [Documentation]    Creates a todo item via API
    ${headers}=    Create Auth Headers    ${token}
    ${json_data}=    Run Keyword If    '${due_date}' == '${EMPTY}'    Set Variable    {"description": "${description}"}
    ...    ELSE    Set Variable    {"description": "${description}", "due_date": "${due_date}"}
    ${response}=    Make POST Request    /api/todo-lists/${list_id}/todos    ${json_data}    ${headers}    ${expected_status}
    RETURN    ${response}

Get Todo Items Via API
    [Arguments]    ${list_id}    ${token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Gets todo items for a list via API
    ${headers}=    Create Auth Headers    ${token}
    ${response}=    Make GET Request    /api/todo-lists/${list_id}/todos    ${headers}    ${expected_status}
    RETURN    ${response}

Get Todo Item By ID Via API
    [Arguments]    ${list_id}    ${item_id}    ${token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Gets a specific todo item by ID via API
    ${headers}=    Create Auth Headers    ${token}
    ${response}=    Make GET Request    /api/todo-lists/${list_id}/todos/${item_id}    ${headers}    ${expected_status}
    RETURN    ${response}

Update Todo Item Via API
    [Arguments]    ${list_id}    ${item_id}    ${description}    ${completed}    ${token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Updates a todo item via API
    ${headers}=    Create Auth Headers    ${token}
    ${json_data}=    Set Variable    {"description": "${description}", "completed": ${completed}}
    ${response}=    Make PUT Request    /api/todo-lists/${list_id}/todos/${item_id}    ${json_data}    ${headers}    ${expected_status}
    RETURN    ${response}

Delete Todo Item Via API
    [Arguments]    ${list_id}    ${item_id}    ${token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Deletes a todo item via API
    ${headers}=    Create Auth Headers    ${token}
    ${response}=    Make DELETE Request    /api/todo-lists/${list_id}/todos/${item_id}    ${headers}    ${expected_status}
    RETURN    ${response}

Validate Todo Item Response
    [Arguments]    ${response}    ${expected_description}=${EMPTY}
    [Documentation]    Validates todo item response structure
    Should Be Equal As Integers    ${response.status_code}    ${HTTP_OK}
    ${json_data}=    Validate JSON Response    ${response}    ${ITEM_ID_FIELD}    ${ITEM_DESCRIPTION_FIELD}    ${ITEM_COMPLETED_FIELD}    author_id    todo_list_id    created    updated
    Run Keyword If    '${expected_description}' != '${EMPTY}'    Should Be Equal As Strings    ${json_data['${ITEM_DESCRIPTION_FIELD}']}    ${expected_description}
    RETURN    ${json_data}

*** Test Cases ***
Create Todo Item Succeeds With Valid Data
    [Documentation]    Test that todo item creation works with valid data
    [Tags]    smoke    happy_path    create    crud
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${list_id}    ${list_name}=    Create Test Todo List And Get ID    ${access_token}
    ${response}=    Create Todo Item Via API    ${list_id}    ${TEST_ITEM_DESCRIPTION}    ${access_token}
    ${item_data}=    Validate Todo Item Response    ${response}    ${TEST_ITEM_DESCRIPTION}
    Should Be Equal As Strings    ${item_data['${ITEM_COMPLETED_FIELD}']}    False

Create Todo Item With Due Date Succeeds
    [Documentation]    Test that todo item creation works with due date
    [Tags]    happy_path    create    crud
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${list_id}    ${list_name}=    Create Test Todo List And Get ID    ${access_token}
    ${response}=    Create Todo Item Via API    ${list_id}    ${TEST_ITEM_DESCRIPTION}    ${access_token}    ${TEST_ITEM_DUE_DATE}
    ${item_data}=    Validate Todo Item Response    ${response}    ${TEST_ITEM_DESCRIPTION}
    Should Be Equal As Strings    ${item_data['due_date']}    ${TEST_ITEM_DUE_DATE}

Get Todo Items Returns List Items
    [Documentation]    Test that getting todo items returns items for the list
    [Tags]    smoke    happy_path    read    crud
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${list_id}    ${list_name}=    Create Test Todo List And Get ID    ${access_token}
    ${create_response}=    Create Todo Item Via API    ${list_id}    ${TEST_ITEM_DESCRIPTION}    ${access_token}
    ${response}=    Get Todo Items Via API    ${list_id}    ${access_token}
    Should Be Equal As Integers    ${response.status_code}    ${HTTP_OK}
    ${items}=    Set Variable    ${response.json()}
    Length Should Be    ${items}    1
    Should Be Equal As Strings    ${items[0]['${ITEM_DESCRIPTION_FIELD}']}    ${TEST_ITEM_DESCRIPTION}

Get Todo Item By ID Returns Specific Item
    [Documentation]    Test that getting todo item by ID returns correct item
    [Tags]    smoke    happy_path    read    crud
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${list_id}    ${list_name}=    Create Test Todo List And Get ID    ${access_token}
    ${create_response}=    Create Todo Item Via API    ${list_id}    ${TEST_ITEM_DESCRIPTION}    ${access_token}
    ${item_data}=    Validate Todo Item Response    ${create_response}
    ${item_id}=    Get From Dictionary    ${item_data}    ${ITEM_ID_FIELD}
    ${response}=    Get Todo Item By ID Via API    ${list_id}    ${item_id}    ${access_token}
    ${retrieved_item}=    Validate Todo Item Response    ${response}    ${TEST_ITEM_DESCRIPTION}

Update Todo Item Succeeds With Valid Data
    [Documentation]    Test that todo item update works with valid data
    [Tags]    smoke    happy_path    update    crud
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${list_id}    ${list_name}=    Create Test Todo List And Get ID    ${access_token}
    ${create_response}=    Create Todo Item Via API    ${list_id}    ${TEST_ITEM_DESCRIPTION}    ${access_token}
    ${item_data}=    Validate Todo Item Response    ${create_response}
    ${item_id}=    Get From Dictionary    ${item_data}    ${ITEM_ID_FIELD}
    ${response}=    Update Todo Item Via API    ${list_id}    ${item_id}    ${UPDATED_ITEM_DESCRIPTION}    true    ${access_token}
    ${updated_item}=    Validate Todo Item Response    ${response}    ${UPDATED_ITEM_DESCRIPTION}
    Should Be Equal As Strings    ${updated_item['${ITEM_COMPLETED_FIELD}']}    True

Delete Todo Item Succeeds
    [Documentation]    Test that todo item deletion works
    [Tags]    smoke    happy_path    delete    crud
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${list_id}    ${list_name}=    Create Test Todo List And Get ID    ${access_token}
    ${create_response}=    Create Todo Item Via API    ${list_id}    ${TEST_ITEM_DESCRIPTION}    ${access_token}
    ${item_data}=    Validate Todo Item Response    ${create_response}
    ${item_id}=    Get From Dictionary    ${item_data}    ${ITEM_ID_FIELD}
    ${response}=    Delete Todo Item Via API    ${list_id}    ${item_id}    ${access_token}
    Should Be Equal As Integers    ${response.status_code}    ${HTTP_OK}
    # Verify item is deleted
    ${get_response}=    Get Todo Items Via API    ${list_id}    ${access_token}
    ${items}=    Set Variable    ${get_response.json()}
    Length Should Be    ${items}    0

Create Todo Item Fails With Empty Description
    [Documentation]    Test that todo item creation fails with empty description
    [Tags]    negative    validation    create
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${list_id}    ${list_name}=    Create Test Todo List And Get ID    ${access_token}
    ${response}=    Create Todo Item Via API    ${list_id}    ${EMPTY_STRING}    ${access_token}    ${EMPTY}    ${HTTP_UNPROCESSABLE}
    Validate Error Response    ${response}

Create Todo Item Fails With Invalid Date
    [Documentation]    Test that todo item creation fails with invalid due date
    [Tags]    negative    validation    create
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${list_id}    ${list_name}=    Create Test Todo List And Get ID    ${access_token}
    ${response}=    Create Todo Item Via API    ${list_id}    ${TEST_ITEM_DESCRIPTION}    ${access_token}    ${INVALID_DUE_DATE}    ${HTTP_SERVER_ERROR}
    Validate Error Response    ${response}

Create Todo Item Fails For Non-Existent List
    [Documentation]    Test that todo item creation fails for non-existent list
    [Tags]    negative    validation    create
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${response}=    Create Todo Item Via API    999999    ${TEST_ITEM_DESCRIPTION}    ${access_token}    ${EMPTY}    ${HTTP_NOT_FOUND}
    Validate Error Response    ${response}

Get Todo Items Fails For Non-Existent List
    [Documentation]    Test that getting todo items fails for non-existent list
    [Tags]    negative    validation    read
    ${access_token}    ${user_id}    ${username}=    Create Test User And Get Token
    ${response}=    Get Todo Items Via API    999999    ${access_token}    ${HTTP_NOT_FOUND}
    Validate Error Response    ${response}