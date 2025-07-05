# User Registration Allows Empty Username

## Title
User registration allows empty usernames

## Summary
The user registration API endpoint accepts requests with empty username fields, creating user accounts that cannot be properly identified, causing confusion in user lists and breaking sharing functionality.

## Steps to Reproduce
1. Start the application using `docker compose -f compose.dev.yml up`
2. Send a POST request to `/api/users/` with an empty username: `{"username": "", "password": "validpassword123"}`

## Expected Behavior
The API should reject the registration request with a validation error indicating that username cannot be empty, as usernames are essential for user identification and authentication.

## Actual Behavior
The API accepts the request and creates a user account with an empty username, returning status 200 with valid authentication tokens and a user object with `"username": ""`.

## Environment
- **API Endpoint**: `/api/users/`
- **HTTP Method**: POST
- **Expected Status**: 400/422
- **Actual Status**: 200

## Root Cause
The `CredentialsRequest` model in `/backend/src/controller/user_controller.py` does not include validation constraints to ensure the username field is not empty.

## Suggested Fix
Modify the `CredentialsRequest` model in `/backend/src/controller/user_controller.py` to add validation constraints:

```python
from pydantic import BaseModel, Field
import re

class CredentialsRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, pattern=r'^[a-zA-Z0-9_-]+$')
    password: str = Field(..., min_length=8)
```

Or for more comprehensive validation:
```python
from pydantic import BaseModel, validator

class CredentialsRequest(BaseModel):
    username: str
    password: str
    
    @validator('username')
    def username_must_be_valid(cls, v):
        if not v or not v.strip():
            raise ValueError('Username cannot be empty')
        v = v.strip()
        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters long')
        if len(v) > 50:
            raise ValueError('Username must be at most 50 characters long')
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Username can only contain letters, numbers, underscores, and hyphens')
        return v
```

Additionally, add a unique constraint check in the user service to prevent duplicate usernames (which already exists) and ensure database constraints are properly handled.

## Impact
- **Severity**: High
- **Affected Users**: All users attempting registration
- **Security**: Creates user accounts that cannot be properly identified
- **Functionality**: Breaks user search and sharing features that depend on meaningful usernames