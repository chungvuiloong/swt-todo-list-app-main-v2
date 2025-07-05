*** Settings ***
Library           RequestsLibrary
Library           Collections
Library           String
Library           JSONLibrary
Library           Process
Resource          ../variables/api_config.robot
Resource          ../variables/api_test_data.robot

*** Keywords ***
Setup API Test Session
    [Documentation]    Creates a requests session for API testing
    Create Session    ${TEST_SESSION}    ${API_BASE_URL}
    ...               timeout=${REQUEST_TIMEOUT}
    ...               verify=False

Teardown API Test Session
    [Documentation]    Deletes the requests session
    Delete All Sessions

Generate Unique Username
    [Documentation]    Generates a unique username for testing
    ${timestamp}=    Get Time    epoch
    ${unique_username}=    Set Variable    apiuser${timestamp}
    [Return]    ${unique_username}

Generate Unique List Name
    [Documentation]    Generates a unique list name for testing
    ${timestamp}=    Get Time    epoch
    ${unique_name}=    Set Variable    API List ${timestamp}
    [Return]    ${unique_name}

Generate JSON With Unique Username
    [Documentation]    Generates JSON with unique username for registration
    ${unique_username}=    Generate Unique Username
    ${json_data}=    Set Variable    {"username": "${unique_username}", "password": "${TEST_USER_PASSWORD}"}
    [Return]    ${json_data}    ${unique_username}

Make GET Request
    [Arguments]    ${endpoint}    ${headers}=${EMPTY}    ${expected_status}=${HTTP_OK}
    [Documentation]    Makes a GET request and validates status code
    ${response}=    GET On Session    ${TEST_SESSION}    ${endpoint}    headers=${headers}    expected_status=any
    Should Be Equal As Integers    ${response.status_code}    ${expected_status}
    [Return]    ${response}

Make POST Request
    [Arguments]    ${endpoint}    ${data}    ${headers}=${EMPTY}    ${expected_status}=${HTTP_CREATED}
    [Documentation]    Makes a POST request and validates status code
    ${response}=    POST On Session    ${TEST_SESSION}    ${endpoint}    data=${data}    headers=${headers}    expected_status=any
    Should Be Equal As Integers    ${response.status_code}    ${expected_status}
    [Return]    ${response}

Make PUT Request
    [Arguments]    ${endpoint}    ${data}    ${headers}=${EMPTY}    ${expected_status}=${HTTP_OK}
    [Documentation]    Makes a PUT request and validates status code
    ${response}=    PUT On Session    ${TEST_SESSION}    ${endpoint}    data=${data}    headers=${headers}    expected_status=any
    Should Be Equal As Integers    ${response.status_code}    ${expected_status}
    [Return]    ${response}

Make DELETE Request
    [Arguments]    ${endpoint}    ${headers}=${EMPTY}    ${expected_status}=${HTTP_OK}
    [Documentation]    Makes a DELETE request and validates status code
    ${response}=    DELETE On Session    ${TEST_SESSION}    ${endpoint}    headers=${headers}    expected_status=any
    Should Be Equal As Integers    ${response.status_code}    ${expected_status}
    [Return]    ${response}

Create Default Headers
    [Documentation]    Creates default headers for JSON requests
    ${headers}=    Create Dictionary    Content-Type=${CONTENT_TYPE_JSON}    Accept=${ACCEPT_JSON}
    [Return]    ${headers}

Create Auth Headers
    [Arguments]    ${token}
    [Documentation]    Creates headers with authorization token
    ${headers}=    Create Default Headers
    Set To Dictionary    ${headers}    Authorization=Bearer ${token}
    [Return]    ${headers}

Validate JSON Response
    [Arguments]    ${response}    ${expected_fields}
    [Documentation]    Validates that response contains expected JSON fields
    Should Be Equal As Strings    ${response.headers['Content-Type']}    ${CONTENT_TYPE_JSON}
    ${json_data}=    Set Variable    ${response.json()}
    FOR    ${field}    IN    @{expected_fields}
        Dictionary Should Contain Key    ${json_data}    ${field}
    END
    [Return]    ${json_data}

Validate Error Response
    [Arguments]    ${response}    ${expected_message}=${EMPTY}
    [Documentation]    Validates error response structure
    ${json_data}=    Set Variable    ${response.json()}
    Dictionary Should Contain Key    ${json_data}    detail
    Run Keyword If    '${expected_message}' != '${EMPTY}'    Should Contain    ${json_data['detail']}    ${expected_message}
    [Return]    ${json_data}

Wait For Service To Be Ready
    [Documentation]    Waits for the API service to be ready
    Wait Until Keyword Succeeds    60s    5s    Check Service Health

Check Service Health
    [Documentation]    Checks if API service is responding
    ${response}=    GET On Session    ${TEST_SESSION}    /api/todo-lists/roles    expected_status=any
    Should Be Equal As Integers    ${response.status_code}    ${HTTP_OK}

Clear Test Data
    [Documentation]    Clears test data by restarting containers
    [Tags]    setup
    Run Process    docker    compose    -f    compose.dev.yml    down    shell=True    cwd=${EXECDIR}/../..
    Run Process    docker    compose    -f    compose.dev.yml    up    -d    shell=True    cwd=${EXECDIR}/../..
    Sleep    15s    # Wait for services to start