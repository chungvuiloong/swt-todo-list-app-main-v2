# API Accepts Empty Description for Todo Items

## Title
API allows creation of todo items with empty descriptions

## Summary
The API endpoint for creating todo items accepts requests with empty description fields, allowing users to create meaningless todo items that provide no useful information and clutter the interface.

## Steps to Reproduce
1. Start the application using `docker compose -f compose.dev.yml up`
2. Register a new user via POST request to `/api/users/` with valid credentials
3. Create a todo list via POST request to `/api/todo-lists/` with a valid name
4. Attempt to create a todo item via POST request to `/api/todo-lists/{id}/todos` with an empty description: `{"description": ""}`

## Expected Behavior
The API should reject the request with a validation error indicating that description cannot be empty, as todo items without descriptions provide no useful information to users.

## Actual Behavior
The API accepts the request and creates a todo item with an empty description, returning status 200 and a valid todo item object with `"description": ""`.

## Environment
- **API Endpoint**: `/api/todo-lists/{id}/todos`
- **HTTP Method**: POST
- **Expected Status**: 400/422
- **Actual Status**: 200

## Root Cause
The `CreateTodoItemRequest` model in `/backend/src/dto/request_dtos.py` does not include validation constraints to ensure the description field is not empty.

## Suggested Fix
Modify the `CreateTodoItemRequest` model in `/backend/src/dto/request_dtos.py` to add validation constraints:

```python
from pydantic import BaseModel, Field
from typing import Optional

class CreateTodoItemRequest(BaseModel):
    description: str = Field(..., min_length=1, description="Description cannot be empty")
    due_date: Optional[str] = None
```

Alternatively, use a custom validator:
```python
from pydantic import BaseModel, validator
from typing import Optional

class CreateTodoItemRequest(BaseModel):
    description: str
    due_date: Optional[str] = None
    
    @validator('description')
    def description_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Description cannot be empty')
        return v.strip()
```

## Impact
- **Severity**: Medium
- **Affected Users**: All users creating todo items
- **User Experience**: Users can create meaningless todo items that clutter the interface and reduce productivity