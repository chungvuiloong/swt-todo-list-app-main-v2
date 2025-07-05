*** Settings ***
Resource    common.robot
Resource    auth_keywords.robot

*** Keywords ***
Navigate To Todo Lists Page
    [Documentation]    Navigates to the todo lists page
    Go To    ${TODOS_URL}
    Wait For Page To Load
    Page Should Contain Element    css:[data-testid="todos-page"]

Open Create Todo List Dialog
    [Documentation]    Opens the create todo list dialog
    Wait For Element And Click    css:[data-testid="create-list-button"]
    Wait Until Element Is Visible    css:[data-testid="create-list-dialog"]    ${MEDIUM_TIMEOUT}

Fill Create Todo List Form
    [Arguments]    ${name}    ${description}=${EMPTY}
    [Documentation]    Fills the create todo list form
    Wait For Element And Input Text    css:input[name="name"]    ${name}
    Run Keyword If    '${description}' != '${EMPTY}'    Wait For Element And Input Text    css:textarea[name="description"]    ${description}

Submit Create Todo List Form
    [Documentation]    Submits the create todo list form
    Wait For Element And Click    css:[data-testid="create-list-submit"]

Create New Todo List
    [Arguments]    ${name}    ${description}=${EMPTY}
    [Documentation]    Creates a new todo list with specified name and description
    Open Create Todo List Dialog
    Fill Create Todo List Form    ${name}    ${description}
    Submit Create Todo List Form
    Wait Until Element Is Not Visible    css:[data-testid="create-list-dialog"]    ${MEDIUM_TIMEOUT}
    Verify Todo List Exists    ${name}

Verify Todo List Exists
    [Arguments]    ${list_name}
    [Documentation]    Verifies that a todo list with given name exists
    Wait Until Element Is Visible    css:[data-testid="todo-list"][data-name="${list_name}"]    ${MEDIUM_TIMEOUT}

Verify Todo List Does Not Exist
    [Arguments]    ${list_name}
    [Documentation]    Verifies that a todo list with given name does not exist
    Page Should Not Contain Element    css:[data-testid="todo-list"][data-name="${list_name}"]

Open Todo List
    [Arguments]    ${list_name}
    [Documentation]    Opens a todo list by clicking on it
    Wait For Element And Click    css:[data-testid="todo-list"][data-name="${list_name}"]
    Wait Until Element Is Visible    css:[data-testid="todo-list-view"]    ${MEDIUM_TIMEOUT}

Open Todo List Edit Dialog
    [Arguments]    ${list_name}
    [Documentation]    Opens the edit dialog for a todo list
    Wait For Element And Click    css:[data-testid="todo-list"][data-name="${list_name}"] [data-testid="edit-list-button"]
    Wait Until Element Is Visible    css:[data-testid="edit-list-dialog"]    ${MEDIUM_TIMEOUT}

Fill Edit Todo List Form
    [Arguments]    ${name}    ${description}=${EMPTY}
    [Documentation]    Fills the edit todo list form
    Clear Element Text    css:input[name="name"]
    Wait For Element And Input Text    css:input[name="name"]    ${name}
    Run Keyword If    '${description}' != '${EMPTY}'    Clear Element Text    css:textarea[name="description"]
    Run Keyword If    '${description}' != '${EMPTY}'    Wait For Element And Input Text    css:textarea[name="description"]    ${description}

Submit Edit Todo List Form
    [Documentation]    Submits the edit todo list form
    Wait For Element And Click    css:[data-testid="edit-list-submit"]

Edit Todo List
    [Arguments]    ${old_name}    ${new_name}    ${new_description}=${EMPTY}
    [Documentation]    Edits a todo list with new name and description
    Open Todo List Edit Dialog    ${old_name}
    Fill Edit Todo List Form    ${new_name}    ${new_description}
    Submit Edit Todo List Form
    Wait Until Element Is Not Visible    css:[data-testid="edit-list-dialog"]    ${MEDIUM_TIMEOUT}
    Verify Todo List Exists    ${new_name}

Open Todo List Delete Dialog
    [Arguments]    ${list_name}
    [Documentation]    Opens the delete confirmation dialog for a todo list
    Wait For Element And Click    css:[data-testid="todo-list"][data-name="${list_name}"] [data-testid="delete-list-button"]
    Wait Until Element Is Visible    css:[data-testid="delete-confirmation-dialog"]    ${MEDIUM_TIMEOUT}

Confirm Delete Todo List
    [Documentation]    Confirms the deletion of a todo list
    Wait For Element And Click    css:[data-testid="confirm-delete-button"]

Delete Todo List
    [Arguments]    ${list_name}
    [Documentation]    Deletes a todo list
    Open Todo List Delete Dialog    ${list_name}
    Confirm Delete Todo List
    Wait Until Element Is Not Visible    css:[data-testid="delete-confirmation-dialog"]    ${MEDIUM_TIMEOUT}
    Verify Todo List Does Not Exist    ${list_name}

Verify Create Todo List Error
    [Arguments]    ${expected_error}
    [Documentation]    Verifies that create todo list shows expected error
    Wait Until Element Is Visible    css:[data-testid="form-error"]    ${MEDIUM_TIMEOUT}
    Verify Element Contains Text    css:[data-testid="form-error"]    ${expected_error}

Open Share Todo List Dialog
    [Arguments]    ${list_name}
    [Documentation]    Opens the share dialog for a todo list
    Wait For Element And Click    css:[data-testid="todo-list"][data-name="${list_name}"] [data-testid="share-list-button"]
    Wait Until Element Is Visible    css:[data-testid="share-list-dialog"]    ${MEDIUM_TIMEOUT}

Search And Add User To Share
    [Arguments]    ${username}    ${role}=editor
    [Documentation]    Searches for a user and adds them to share list
    Wait For Element And Input Text    css:[data-testid="user-search-input"]    ${username}
    Wait For Element And Click    css:[data-testid="search-user-button"]
    Wait Until Element Is Visible    css:[data-testid="user-result"][data-username="${username}"]    ${MEDIUM_TIMEOUT}
    Select From List By Value    css:select[name="role"]    ${role}
    Wait For Element And Click    css:[data-testid="add-user-button"]

Submit Share Todo List
    [Documentation]    Submits the share todo list form
    Wait For Element And Click    css:[data-testid="share-list-submit"]

Share Todo List With User
    [Arguments]    ${list_name}    ${username}    ${role}=editor
    [Documentation]    Shares a todo list with specified user
    Open Share Todo List Dialog    ${list_name}
    Search And Add User To Share    ${username}    ${role}
    Submit Share Todo List
    Wait Until Element Is Not Visible    css:[data-testid="share-list-dialog"]    ${MEDIUM_TIMEOUT}