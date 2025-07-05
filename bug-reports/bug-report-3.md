# API Accepts Empty Names for Todo Lists

## Title
API allows creation of todo lists with empty names

## Summary
The API endpoint for creating todo lists accepts requests with empty name fields, allowing users to create todo lists that cannot be properly identified or managed in the user interface.

## Steps to Reproduce
1. Start the application using `docker compose -f compose.dev.yml up`
2. Register a new user via POST request to `/api/users/` with valid credentials
3. Attempt to create a todo list via POST request to `/api/todo-lists/` with an empty name: `{"name": "", "description": "Test description"}`

## Expected Behavior
The API should reject the request with a validation error indicating that the name field is required and cannot be empty, as todo lists need identifiable names for user navigation.

## Actual Behavior
The API accepts the request and creates a todo list with an empty name, returning status 200 and a valid todo list object with `"name": ""`.

## Environment
- **API Endpoint**: `/api/todo-lists/`
- **HTTP Method**: POST
- **Expected Status**: 400/422
- **Actual Status**: 200

## Root Cause
The `CreateTodoListRequest` model in `/backend/src/dto/request_dtos.py` does not include validation constraints to ensure the name field is not empty.

## Suggested Fix
Modify the `CreateTodoListRequest` model in `/backend/src/dto/request_dtos.py` to add validation constraints:

```python
from pydantic import BaseModel, Field
from typing import Optional

class CreateTodoListRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Name cannot be empty")
    description: Optional[str] = None
```

Alternatively, use a custom validator with trimming:
```python
from pydantic import BaseModel, validator
from typing import Optional

class CreateTodoListRequest(BaseModel):
    name: str
    description: Optional[str] = None
    
    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Todo list name cannot be empty')
        return v.strip()
```

## Impact
- **Severity**: Medium
- **Affected Users**: All users creating todo lists
- **User Experience**: Users can create unnamed todo lists that are difficult to identify and manage in the interface