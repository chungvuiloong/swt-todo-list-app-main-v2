*** Settings ***
Resource    common.robot
Resource    todolist_keywords.robot

*** Keywords ***
Open Create Todo Item Dialog
    [Documentation]    Opens the create todo item dialog
    Wait For Element And Click    css:[data-testid="create-item-button"]
    Wait Until Element Is Visible    css:[data-testid="create-item-dialog"]    ${MEDIUM_TIMEOUT}

Fill Create Todo Item Form
    [Arguments]    ${description}    ${due_date}=${EMPTY}
    [Documentation]    Fills the create todo item form
    Wait For Element And Input Text    css:textarea[name="description"]    ${description}
    Run Keyword If    '${due_date}' != '${EMPTY}'    Wait For Element And Input Text    css:input[name="due_date"]    ${due_date}

Submit Create Todo Item Form
    [Documentation]    Submits the create todo item form
    Wait For Element And Click    css:[data-testid="create-item-submit"]

Create New Todo Item
    [Arguments]    ${description}    ${due_date}=${EMPTY}
    [Documentation]    Creates a new todo item with specified description
    Open Create Todo Item Dialog
    Fill Create Todo Item Form    ${description}    ${due_date}
    Submit Create Todo Item Form
    Wait Until Element Is Not Visible    css:[data-testid="create-item-dialog"]    ${MEDIUM_TIMEOUT}
    Verify Todo Item Exists    ${description}

Verify Todo Item Exists
    [Arguments]    ${description}
    [Documentation]    Verifies that a todo item with given description exists
    Wait Until Element Is Visible    css:[data-testid="todo-item"][data-description="${description}"]    ${MEDIUM_TIMEOUT}

Verify Todo Item Does Not Exist
    [Arguments]    ${description}
    [Documentation]    Verifies that a todo item with given description does not exist
    Page Should Not Contain Element    css:[data-testid="todo-item"][data-description="${description}"]

Open Todo Item Edit Dialog
    [Arguments]    ${description}
    [Documentation]    Opens the edit dialog for a todo item
    Wait For Element And Click    css:[data-testid="todo-item"][data-description="${description}"] [data-testid="edit-item-button"]
    Wait Until Element Is Visible    css:[data-testid="edit-item-dialog"]    ${MEDIUM_TIMEOUT}

Fill Edit Todo Item Form
    [Arguments]    ${new_description}    ${due_date}=${EMPTY}
    [Documentation]    Fills the edit todo item form
    Clear Element Text    css:textarea[name="description"]
    Wait For Element And Input Text    css:textarea[name="description"]    ${new_description}
    Run Keyword If    '${due_date}' != '${EMPTY}'    Clear Element Text    css:input[name="due_date"]
    Run Keyword If    '${due_date}' != '${EMPTY}'    Wait For Element And Input Text    css:input[name="due_date"]    ${due_date}

Submit Edit Todo Item Form
    [Documentation]    Submits the edit todo item form
    Wait For Element And Click    css:[data-testid="edit-item-submit"]

Edit Todo Item
    [Arguments]    ${old_description}    ${new_description}    ${due_date}=${EMPTY}
    [Documentation]    Edits a todo item with new description
    Open Todo Item Edit Dialog    ${old_description}
    Fill Edit Todo Item Form    ${new_description}    ${due_date}
    Submit Edit Todo Item Form
    Wait Until Element Is Not Visible    css:[data-testid="edit-item-dialog"]    ${MEDIUM_TIMEOUT}
    Verify Todo Item Exists    ${new_description}

Toggle Todo Item Completion
    [Arguments]    ${description}
    [Documentation]    Toggles the completion status of a todo item
    Wait For Element And Click    css:[data-testid="todo-item"][data-description="${description}"] [data-testid="completion-checkbox"]

Verify Todo Item Is Completed
    [Arguments]    ${description}
    [Documentation]    Verifies that a todo item is marked as completed
    Element Should Be Visible    css:[data-testid="todo-item"][data-description="${description}"][data-completed="true"]

Verify Todo Item Is Not Completed
    [Arguments]    ${description}
    [Documentation]    Verifies that a todo item is not marked as completed
    Element Should Be Visible    css:[data-testid="todo-item"][data-description="${description}"][data-completed="false"]

Open Todo Item Delete Dialog
    [Arguments]    ${description}
    [Documentation]    Opens the delete confirmation dialog for a todo item
    Wait For Element And Click    css:[data-testid="todo-item"][data-description="${description}"] [data-testid="delete-item-button"]
    Wait Until Element Is Visible    css:[data-testid="delete-item-confirmation-dialog"]    ${MEDIUM_TIMEOUT}

Confirm Delete Todo Item
    [Documentation]    Confirms the deletion of a todo item
    Wait For Element And Click    css:[data-testid="confirm-delete-item-button"]

Delete Todo Item
    [Arguments]    ${description}
    [Documentation]    Deletes a todo item
    Open Todo Item Delete Dialog    ${description}
    Confirm Delete Todo Item
    Wait Until Element Is Not Visible    css:[data-testid="delete-item-confirmation-dialog"]    ${MEDIUM_TIMEOUT}
    Verify Todo Item Does Not Exist    ${description}

Verify Create Todo Item Error
    [Arguments]    ${expected_error}
    [Documentation]    Verifies that create todo item shows expected error
    Wait Until Element Is Visible    css:[data-testid="item-form-error"]    ${MEDIUM_TIMEOUT}
    Verify Element Contains Text    css:[data-testid="item-form-error"]    ${expected_error}

Navigate Back To Todo Lists
    [Documentation]    Navigates back to the todo lists page from todo list view
    Wait For Element And Click    css:[data-testid="back-to-lists-button"]
    Wait Until Element Is Visible    css:[data-testid="todos-page"]    ${MEDIUM_TIMEOUT}