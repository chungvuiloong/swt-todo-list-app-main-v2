*** Settings ***
Resource    api_common.robot

*** Keywords ***
Create Todo List Via API
    [Arguments]    ${name}    ${description}    ${token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Creates a todo list via API
    ${headers}=    Create Auth Headers    ${token}
    ${json_data}=    Set Variable    {"name": "${name}", "description": "${description}"}
    ${response}=    Make POST Request    /api/todo-lists/    ${json_data}    ${headers}    ${expected_status}
    [Return]    ${response}

Get Todo Lists Via API
    [Arguments]    ${token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Gets user's todo lists via API
    ${headers}=    Create Auth Headers    ${token}
    ${response}=    Make GET Request    /api/todo-lists/    ${headers}    ${expected_status}
    [Return]    ${response}

Get Todo List By ID Via API
    [Arguments]    ${list_id}    ${token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Gets a specific todo list by ID via API
    ${headers}=    Create Auth Headers    ${token}
    ${response}=    Make GET Request    /api/todo-lists/${list_id}    ${headers}    ${expected_status}
    [Return]    ${response}

Update Todo List Via API
    [Arguments]    ${list_id}    ${name}    ${description}    ${token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Updates a todo list via API
    ${headers}=    Create Auth Headers    ${token}
    ${json_data}=    Set Variable    {"name": "${name}", "description": "${description}"}
    ${response}=    Make PUT Request    /api/todo-lists/${list_id}    ${json_data}    ${headers}    ${expected_status}
    [Return]    ${response}

Delete Todo List Via API
    [Arguments]    ${list_id}    ${token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Deletes a todo list via API
    ${headers}=    Create Auth Headers    ${token}
    ${response}=    Make DELETE Request    /api/todo-lists/${list_id}    ${headers}    ${expected_status}
    [Return]    ${response}

Clone Todo List Via API
    [Arguments]    ${list_id}    ${new_name}    ${token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Clones a todo list via API
    ${headers}=    Create Auth Headers    ${token}
    ${json_data}=    Set Variable    {"name": "${new_name}"}
    ${response}=    Make POST Request    /api/todo-lists/${list_id}/clone    ${json_data}    ${headers}    ${expected_status}
    [Return]    ${response}

Share Todo List Via API
    [Arguments]    ${list_id}    ${user_ids}    ${role_id}    ${token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Shares a todo list via API
    ${headers}=    Create Auth Headers    ${token}
    ${json_data}=    Set Variable    {"user_ids": [${user_ids}], "role_id": ${role_id}}
    ${response}=    Make POST Request    /api/todo-lists/${list_id}/share    ${json_data}    ${headers}    ${expected_status}
    [Return]    ${response}

Get Todo List Roles Via API
    [Arguments]    ${expected_status}=${HTTP_OK}
    [Documentation]    Gets available todo list roles via API
    ${headers}=    Create Default Headers
    ${response}=    Make GET Request    /api/todo-lists/roles    ${headers}    ${expected_status}
    [Return]    ${response}

Create Test Todo List And Get ID
    [Arguments]    ${token}    ${name}=${EMPTY}
    [Documentation]    Creates a test todo list and returns its ID
    ${list_name}=    Set Variable If    '${name}' == '${EMPTY}'    ${Generate Unique List Name}    ${name}
    ${unique_name}=    Run Keyword If    '${name}' == '${EMPTY}'    Generate Unique List Name
    ${final_name}=    Set Variable If    '${name}' == '${EMPTY}'    ${unique_name}    ${name}
    ${response}=    Create Todo List Via API    ${final_name}    ${TEST_LIST_DESCRIPTION}    ${token}
    Should Be Equal As Integers    ${response.status_code}    ${HTTP_OK}
    ${json_data}=    Validate JSON Response    ${response}    ${LIST_ID_FIELD}    ${LIST_NAME_FIELD}
    ${list_id}=    Get From Dictionary    ${json_data}    ${LIST_ID_FIELD}
    [Return]    ${list_id}    ${final_name}

Validate Todo List Response
    [Arguments]    ${response}    ${expected_name}=${EMPTY}
    [Documentation]    Validates todo list response structure
    Should Be Equal As Integers    ${response.status_code}    ${HTTP_OK}
    ${json_data}=    Validate JSON Response    ${response}    ${LIST_ID_FIELD}    ${LIST_NAME_FIELD}    description    author    role    created    updated
    Run Keyword If    '${expected_name}' != '${EMPTY}'    Should Be Equal As Strings    ${json_data['${LIST_NAME_FIELD}']}    ${expected_name}
    [Return]    ${json_data}

Validate Todo Lists Response
    [Arguments]    ${response}    ${expected_count}=None
    [Documentation]    Validates todo lists collection response
    Should Be Equal As Integers    ${response.status_code}    ${HTTP_OK}
    ${lists}=    Set Variable    ${response.json()}
    Should Be List    ${lists}
    Run Keyword If    ${expected_count} is not None    Length Should Be    ${lists}    ${expected_count}
    [Return]    ${lists}

Validate Todo List Roles Response
    [Arguments]    ${response}
    [Documentation]    Validates todo list roles response
    Should Be Equal As Integers    ${response.status_code}    ${HTTP_OK}
    ${roles}=    Set Variable    ${response.json()}
    Should Be List    ${roles}
    Length Should Be    ${roles}    3    # Expecting owner, editor, viewer roles
    [Return]    ${roles}