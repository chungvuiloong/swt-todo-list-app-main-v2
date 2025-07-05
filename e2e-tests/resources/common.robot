*** Settings ***
Library           SeleniumLibrary
Library           Collections
Library           String
Library           Process
Resource          ../variables/config.robot
Resource          ../variables/test_data.robot

*** Keywords ***
Open Browser To Application
    [Documentation]    Opens browser and navigates to the application
    ${chrome_options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
    Run Keyword If    ${HEADLESS}    Call Method    ${chrome_options}    add_argument    --headless
    Call Method    ${chrome_options}    add_argument    --no-sandbox
    Call Method    ${chrome_options}    add_argument    --disable-dev-shm-usage
    Call Method    ${chrome_options}    add_argument    --disable-gpu
    Open Browser    ${BASE_URL}    ${BROWSER}    options=${chrome_options}
    Set Selenium Implicit Wait    ${IMPLICIT_WAIT}
    Maximize Browser Window

Close Browser Session
    [Documentation]    Closes the browser session
    Close All Browsers

Wait For Element And Click
    [Arguments]    ${locator}    ${timeout}=${EXPLICIT_WAIT}
    [Documentation]    Waits for element to be visible and clickable, then clicks it
    Wait Until Element Is Visible    ${locator}    ${timeout}
    Wait Until Element Is Enabled    ${locator}    ${timeout}
    Click Element    ${locator}

Wait For Element And Input Text
    [Arguments]    ${locator}    ${text}    ${timeout}=${EXPLICIT_WAIT}
    [Documentation]    Waits for element to be visible and inputs text
    Wait Until Element Is Visible    ${locator}    ${timeout}
    Clear Element Text    ${locator}
    Input Text    ${locator}    ${text}

Wait For Page To Load
    [Documentation]    Waits for page to fully load
    Wait Until Page Contains Element    tag:body    ${EXPLICIT_WAIT}
    Sleep    1s    # Additional buffer for dynamic content

Clear Application Data
    [Documentation]    Clears application data by restarting containers
    [Tags]    setup
    Run Process    docker    compose    -f    compose.dev.yml    down    shell=True    cwd=${EXECDIR}/..
    Run Process    docker    compose    -f    compose.dev.yml    up    -d    shell=True    cwd=${EXECDIR}/..
    Sleep    15s    # Wait for services to start

Wait For Application To Start
    [Documentation]    Waits for the application to be ready
    Wait Until Keyword Succeeds    60s    5s    Check Application Health

Check Application Health
    [Documentation]    Checks if application is responding
    Create Session    healthcheck    ${BASE_URL}
    ${response}=    Get Request    healthcheck    /
    Should Be Equal As Integers    ${response.status_code}    200

Generate Unique Username
    [Documentation]    Generates a unique username for testing
    ${timestamp}=    Get Time    epoch
    ${unique_username}=    Set Variable    testuser${timestamp}
    RETURN    ${unique_username}

Generate Unique List Name
    [Documentation]    Generates a unique list name for testing
    ${timestamp}=    Get Time    epoch
    ${unique_name}=    Set Variable    Test List ${timestamp}
    RETURN    ${unique_name}

Verify Element Contains Text
    [Arguments]    ${locator}    ${expected_text}    ${timeout}=${EXPLICIT_WAIT}
    [Documentation]    Verifies that an element contains expected text
    Wait Until Element Is Visible    ${locator}    ${timeout}
    ${actual_text}=    Get Text    ${locator}
    Should Contain    ${actual_text}    ${expected_text}

Verify Element Text Equals
    [Arguments]    ${locator}    ${expected_text}    ${timeout}=${EXPLICIT_WAIT}
    [Documentation]    Verifies that an element text equals expected text
    Wait Until Element Is Visible    ${locator}    ${timeout}
    ${actual_text}=    Get Text    ${locator}
    Should Be Equal    ${actual_text}    ${expected_text}

Take Screenshot On Failure
    [Documentation]    Takes a screenshot when test fails
    Run Keyword If Test Failed    Capture Page Screenshot

Scroll To Element
    [Arguments]    ${locator}
    [Documentation]    Scrolls to make element visible
    Scroll Element Into View    ${locator}