# User Registration Allows Empty Password

## Title
User registration allows empty passwords

## Summary
The user registration API endpoint accepts requests with empty password fields, creating user accounts with no password protection, representing a critical security vulnerability.

## Steps to Reproduce
1. Start the application using `docker compose -f compose.dev.yml up`
2. Send a POST request to `/api/users/` with an empty password: `{"username": "testuser", "password": ""}`

## Expected Behavior
The API should reject the registration request with a validation error indicating that password cannot be empty, as passwords are essential for account security.

## Actual Behavior
The API accepts the request and creates a user account with an empty password, returning status 200 with valid authentication tokens.

## Environment
- **API Endpoint**: `/api/users/`
- **HTTP Method**: POST
- **Expected Status**: 400/422
- **Actual Status**: 200

## Root Cause
The `CredentialsRequest` model in `/backend/src/controller/user_controller.py` does not include validation constraints to ensure the password field is not empty.

## Suggested Fix
Modify the `CredentialsRequest` model in `/backend/src/controller/user_controller.py` to add strong password validation:

```python
from pydantic import BaseModel, Field, validator
import re

class CredentialsRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=128)
    
    @validator('password')
    def password_must_be_strong(cls, v):
        if not v or not v.strip():
            raise ValueError('Password cannot be empty')
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v
```

For a minimal fix focusing only on empty passwords:
```python
from pydantic import BaseModel, Field

class CredentialsRequest(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1, description="Password cannot be empty")
```

Additionally, ensure proper password hashing is implemented in the authentication service before storing passwords in the database.

## Impact
- **Severity**: Critical
- **Affected Users**: All users attempting registration
- **Security**: Creates user accounts with no password protection, allowing unauthorized access
- **Compliance**: Violates basic security standards for user authentication systems