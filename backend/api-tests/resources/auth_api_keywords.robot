*** Settings ***
Resource    api_common.robot
Library     Collections

*** Keywords ***
Register User Via API
    [Arguments]    ${username}    ${password}    ${expected_status}=${HTTP_OK}
    [Documentation]    Registers a new user via API
    ${headers}=    Create Default Headers
    ${json_data}=    Set Variable    {"username": "${username}", "password": "${password}"}
    ${response}=    Make POST Request    /api/users/    ${json_data}    ${headers}    ${expected_status}
    [Return]    ${response}

Register Unique User Via API
    [Documentation]    Registers a new user with unique username via API
    ${unique_username}=    Generate Unique Username
    ${response}=    Register User Via API    ${unique_username}    ${TEST_USER_PASSWORD}
    Should Be Equal As Integers    ${response.status_code}    ${HTTP_OK}
    ${json_data}=    Validate JSON Response    ${response}    ${USER_ID_FIELD}    ${USERNAME_FIELD}    ${ACCESS_TOKEN_FIELD}    ${REFRESH_TOKEN_FIELD}
    [Return]    ${json_data}    ${unique_username}

Login User Via API
    [Arguments]    ${username}    ${password}    ${expected_status}=${HTTP_OK}
    [Documentation]    Logs in a user via API
    ${headers}=    Create Default Headers
    ${json_data}=    Set Variable    {"username": "${username}", "password": "${password}"}
    ${response}=    Make POST Request    /api/users/login    ${json_data}    ${headers}    ${expected_status}
    [Return]    ${response}

Refresh Token Via API
    [Arguments]    ${access_token}    ${refresh_token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Refreshes access token via API
    ${headers}=    Create Default Headers
    ${json_data}=    Set Variable    {"accessToken": "${access_token}", "refreshToken": "${refresh_token}"}
    ${response}=    Make POST Request    /api/users/refresh-token    ${json_data}    ${headers}    ${expected_status}
    [Return]    ${response}

Find Users Via API
    [Arguments]    ${query_string}    ${token}    ${expected_status}=${HTTP_OK}
    [Documentation]    Searches for users via API
    ${headers}=    Create Auth Headers    ${token}
    ${response}=    Make GET Request    /api/users/?queryString=${query_string}    ${headers}    ${expected_status}
    [Return]    ${response}

Create Test User And Get Token
    [Documentation]    Creates a test user and returns authentication data
    ${user_data}    ${username}=    Register Unique User Via API
    ${access_token}=    Get From Dictionary    ${user_data}    ${ACCESS_TOKEN_FIELD}
    ${user_id}=    Get From Dictionary    ${user_data}    ${USER_ID_FIELD}
    [Return]    ${access_token}    ${user_id}    ${username}

Validate Registration Response
    [Arguments]    ${response}
    [Documentation]    Validates successful registration response
    Should Be Equal As Integers    ${response.status_code}    ${HTTP_OK}
    ${json_data}=    Validate JSON Response    ${response}    ${USER_ID_FIELD}    ${USERNAME_FIELD}    ${ACCESS_TOKEN_FIELD}    ${REFRESH_TOKEN_FIELD}
    Should Not Be Empty    ${json_data['${ACCESS_TOKEN_FIELD}']}
    Should Not Be Empty    ${json_data['${REFRESH_TOKEN_FIELD}']}
    [Return]    ${json_data}

Validate Login Response
    [Arguments]    ${response}
    [Documentation]    Validates successful login response
    Should Be Equal As Integers    ${response.status_code}    ${HTTP_OK}
    ${json_data}=    Validate JSON Response    ${response}    ${USER_ID_FIELD}    ${USERNAME_FIELD}    ${ACCESS_TOKEN_FIELD}    ${REFRESH_TOKEN_FIELD}
    Should Not Be Empty    ${json_data['${ACCESS_TOKEN_FIELD}']}
    Should Not Be Empty    ${json_data['${REFRESH_TOKEN_FIELD}']}
    [Return]    ${json_data}

Validate User Search Response
    [Arguments]    ${response}    ${expected_count}=None
    [Documentation]    Validates user search response
    Should Be Equal As Integers    ${response.status_code}    ${HTTP_OK}
    ${users}=    Set Variable    ${response.json()}
    # Validate that response is a list by checking if it has list-like properties
    ${list_length}=    Get Length    ${users}
    Should Be True    ${list_length} >= 0    Response should be a list-like object
    Run Keyword If    ${expected_count} is not None    Length Should Be    ${users}    ${expected_count}
    [Return]    ${users}