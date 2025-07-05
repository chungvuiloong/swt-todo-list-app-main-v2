*** Settings ***
Resource    api_common.robot
Library     Collections

*** Keywords ***
Create Todo List Via API
    [Arguments]    ${name}    ${description}    ${token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Creates a todo list via API
    ${headers}=    Create Auth Headers    ${token}
    ${json_data}=    Set Variable    {"name": "${name}", "description": "${description}"}
    ${response}=    Make POST Request    /api/todo-lists/    ${json_data}    ${headers}    ${expected_status}
    RETURN    ${response}

Get Todo Lists Via API
    [Arguments]    ${token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Gets user's todo lists via API
    ${headers}=    Create Auth Headers    ${token}
    ${response}=    Make GET Request    /api/todo-lists/    ${headers}    ${expected_status}
    RETURN    ${response}

Get Todo List By ID Via API
    [Arguments]    ${list_id}    ${token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Gets a specific todo list by ID via API
    ${headers}=    Create Auth Headers    ${token}
    ${response}=    Make GET Request    /api/todo-lists/${list_id}    ${headers}    ${expected_status}
    RETURN    ${response}

Update Todo List Via API
    [Arguments]    ${list_id}    ${name}    ${description}    ${token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Updates a todo list via API
    ${headers}=    Create Auth Headers    ${token}
    ${json_data}=    Set Variable    {"name": "${name}", "description": "${description}"}
    ${response}=    Make PUT Request    /api/todo-lists/${list_id}    ${json_data}    ${headers}    ${expected_status}
    RETURN    ${response}

Delete Todo List Via API
    [Arguments]    ${list_id}    ${token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Deletes a todo list via API
    ${headers}=    Create Auth Headers    ${token}
    ${response}=    Make DELETE Request    /api/todo-lists/${list_id}    ${headers}    ${expected_status}
    RETURN    ${response}

Clone Todo List Via API
    [Arguments]    ${list_id}    ${new_name}    ${token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Clones a todo list via API
    ${headers}=    Create Auth Headers    ${token}
    ${json_data}=    Set Variable    {"name": "${new_name}"}
    ${response}=    Make POST Request    /api/todo-lists/${list_id}/clone    ${json_data}    ${headers}    ${expected_status}
    RETURN    ${response}

Share Todo List Via API
    [Arguments]    ${list_id}    ${user_ids}    ${role_id}    ${token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Shares a todo list via API
    ${headers}=    Create Auth Headers    ${token}
    ${json_data}=    Set Variable    {"user_ids": [${user_ids}], "role_id": ${role_id}}
    ${response}=    Make POST Request    /api/todo-lists/${list_id}/share    ${json_data}    ${headers}    ${expected_status}
    RETURN    ${response}

Get Todo List Roles Via API
    [Arguments]    ${expected_status}=${HTTP_OK}
    [Documentation]    Gets available todo list roles via API
    ${headers}=    Create Default Headers
    ${response}=    Make GET Request    /api/todo-lists/roles    ${headers}    ${expected_status}
    RETURN    ${response}

Create Test Todo List And Get ID
    [Arguments]    ${token}    ${name}=${EMPTY}
    [Documentation]    Creates a test todo list and returns its ID
    ${final_name}=    Run Keyword If    '${name}' == '${EMPTY}'    Generate Unique List Name
    ...    ELSE    Set Variable    ${name}
    ${response}=    Create Todo List Via API    ${final_name}    ${TEST_LIST_DESCRIPTION}    ${token}
    Should Be Equal As Integers    ${response.status_code}    ${HTTP_OK}
    ${json_data}=    Validate JSON Response    ${response}    ${LIST_ID_FIELD}    ${LIST_NAME_FIELD}
    ${list_id}=    Get From Dictionary    ${json_data}    ${LIST_ID_FIELD}
    RETURN    ${list_id}    ${final_name}

Validate Todo List Response
    [Arguments]    ${response}    ${expected_name}=${EMPTY}
    [Documentation]    Validates todo list response structure
    Should Be Equal As Integers    ${response.status_code}    ${HTTP_OK}
    ${json_data}=    Set Variable    ${response.json()}
    # Basic fields that should always be present
    Dictionary Should Contain Key    ${json_data}    ${LIST_ID_FIELD}
    Dictionary Should Contain Key    ${json_data}    ${LIST_NAME_FIELD}
    Dictionary Should Contain Key    ${json_data}    description
    Dictionary Should Contain Key    ${json_data}    created
    Dictionary Should Contain Key    ${json_data}    updated
    
    # Handle different response formats (create vs update)
    ${has_author}=    Run Keyword And Return Status    Dictionary Should Contain Key    ${json_data}    author
    ${has_author_id}=    Run Keyword And Return Status    Dictionary Should Contain Key    ${json_data}    author_id
    Run Keyword If    ${has_author} == ${True}    Validate Nested Author    ${json_data}
    Run Keyword If    ${has_author_id} == ${True}    Should Be True    ${json_data['author_id']} > 0
    
    Run Keyword If    '${expected_name}' != '${EMPTY}'    Should Be Equal As Strings    ${json_data['${LIST_NAME_FIELD}']}    ${expected_name}
    RETURN    ${json_data}

Validate Nested Author
    [Arguments]    ${json_data}
    [Documentation]    Validates nested author object structure
    Dictionary Should Contain Key    ${json_data['author']}    id
    Dictionary Should Contain Key    ${json_data['author']}    username

Validate Todo Lists Response
    [Arguments]    ${response}    ${expected_count}=None
    [Documentation]    Validates todo lists collection response
    Should Be Equal As Integers    ${response.status_code}    ${HTTP_OK}
    ${lists}=    Set Variable    ${response.json()}
    # Validate that response is a list by checking if it has list-like properties
    ${list_length}=    Get Length    ${lists}
    Should Be True    ${list_length} >= 0    Response should be a list-like object
    Run Keyword If    ${expected_count} is not None    Length Should Be    ${lists}    ${expected_count}
    RETURN    ${lists}

Validate Todo List Roles Response
    [Arguments]    ${response}
    [Documentation]    Validates todo list roles response
    Should Be Equal As Integers    ${response.status_code}    ${HTTP_OK}
    ${roles}=    Set Variable    ${response.json()}
    # Validate that response is a list by checking if it has list-like properties
    ${list_length}=    Get Length    ${roles}
    Should Be True    ${list_length} >= 0    Response should be a list-like object
    Length Should Be    ${roles}    3    # Expecting owner, editor, viewer roles
    RETURN    ${roles}