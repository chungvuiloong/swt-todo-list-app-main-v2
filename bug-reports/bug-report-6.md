# Internal Server Error Exposes Technical Details for Invalid Date Format

## Title
API exposes internal error details when invalid due_date format is provided

## Summary
The API returns internal server errors with technical implementation details when invalid date formats are provided for todo item due_date fields, exposing database query information and Python object details.

## Steps to Reproduce
1. Start the application using `docker compose -f compose.dev.yml up`
2. Register a user and create a todo list
3. Send a POST request to `/api/todo-lists/{id}/todos` with invalid date format: `{"description": "Test item", "due_date": "invalid-date"}`

## Expected Behavior
The API should return a user-friendly validation error message indicating the correct date format expected, without exposing internal implementation details.

## Actual Behavior
The API returns an internal server error with technical details: `"invalid input for query argument $3: 'invalid-date' ('str' object has no attribute 'toordinal')"` exposing database query information and Python object details.

## Environment
- **API Endpoint**: `/api/todo-lists/{id}/todos`
- **HTTP Method**: POST
- **Expected Status**: 400/422
- **Actual Status**: 500

## Root Cause
Date validation is handled at the database level rather than at the API request validation layer, causing internal errors to bubble up to the client.

## Suggested Fix
Modify the `CreateTodoItemRequest` model in `/backend/src/dto/request_dtos.py` to add proper date validation:

```python
from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime

class CreateTodoItemRequest(BaseModel):
    description: str
    due_date: Optional[str] = None
    
    @validator('due_date')
    def validate_due_date(cls, v):
        if v is None:
            return v
        try:
            # Accept common date formats
            for fmt in ('%Y-%m-%d', '%Y-%m-%d %H:%M:%S', '%Y-%m-%dT%H:%M:%S'):
                try:
                    datetime.strptime(v, fmt)
                    return v
                except ValueError:
                    continue
            raise ValueError('Invalid date format')
        except ValueError:
            raise ValueError(
                'Invalid date format. Please use YYYY-MM-DD, YYYY-MM-DD HH:MM:SS, or YYYY-MM-DDTHH:MM:SS format'
            )
```

Alternatively, use Pydantic's built-in datetime handling:
```python
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CreateTodoItemRequest(BaseModel):
    description: str
    due_date: Optional[datetime] = None
    
    class Config:
        json_encoders = {
            datetime: lambda dt: dt.isoformat()
        }
```

Additionally, add a global exception handler in `/backend/src/main.py` to catch and sanitize internal errors:
```python
from fastapi import HTTPException
from starlette.exceptions import HTTPException as StarletteHTTPException

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal error occurred. Please check your request format."}
    )
```

## Impact
- **Severity**: Medium
- **Affected Users**: Users providing invalid date formats
- **Security**: Information disclosure that could help attackers understand system architecture
- **User Experience**: Confusing technical error messages instead of helpful validation feedback