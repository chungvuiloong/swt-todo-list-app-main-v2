# WebSocket Authentication Uses Invalid Dependency Injection Pattern

## Title
WebSocket endpoint uses FastAPI Depends() which is incompatible with WebSocket connections

## Summary
The WebSocket endpoint for real-time todo list collaboration uses FastAPI's `Depends()` dependency injection pattern, which is designed for HTTP requests and is incompatible with WebSocket connections, causing the real-time features to fail.

## Steps to Reproduce
1. Examine the WebSocket controller code in `/backend/src/controller/ws_controller.py`
2. Note the WebSocket endpoint at line 53-58 using `user: Annotated[UserDto, Depends(authenticate)]`
3. Attempt to establish a WebSocket connection to `/ws/todo-list/{todo_list_id}`

## Expected Behavior
WebSocket connections should authenticate properly using WebSocket-compatible authentication methods (e.g., query parameters, headers, or manual token validation within the endpoint).

## Actual Behavior
The WebSocket endpoint uses `Depends(authenticate)` which is designed for HTTP requests, not WebSocket connections. This will cause the WebSocket connection to fail or behave unexpectedly because FastAPI's dependency injection system works differently for WebSockets.

## Environment
- **File**: `/backend/src/controller/ws_controller.py`
- **Line**: 57
- **WebSocket Endpoint**: `/ws/todo-list/{todo_list_id}`

## Root Cause
The `authenticate` function expects WebSocket and access_token parameters but is used as a dependency. FastAPI WebSocket endpoints cannot use `Depends()` in the same way as HTTP endpoints.

## Suggested Fix
Modify the WebSocket endpoint in `/backend/src/controller/ws_controller.py` to handle authentication manually within the endpoint:

```python
@ws_router.websocket("/todo-list/{todo_list_id}")
async def todo_list_websocket_endpoint(
    websocket: WebSocket,
    todo_list_id: int,
):
    # Accept the connection first
    await websocket.accept()
    
    try:
        # Wait for authentication message
        auth_data = await websocket.receive_text()
        auth_message = json.loads(auth_data)
        access_token = auth_message.get("access_token")
        
        # Authenticate manually
        user = authenticate(websocket, access_token)
        
        # Authorize access to the todo list
        todo_list = await todo_list_service.find_todo_list(id=todo_list_id, user_id=user.id)
        if todo_list is None:
            await websocket.send_text(json.dumps({"error": "Todo list not found or access denied"}))
            await websocket.close(code=1008)
            return
            
        # Continue with existing WebSocket logic...
        await manager.connect(websocket)
        # ... rest of the implementation
        
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        await websocket.send_text(json.dumps({"error": "Authentication failed"}))
        await websocket.close(code=1008)
```

Alternative approach using query parameters:
```python
@ws_router.websocket("/todo-list/{todo_list_id}")
async def todo_list_websocket_endpoint(
    websocket: WebSocket,
    todo_list_id: int,
    token: str = Query(None)
):
    try:
        # Authenticate using query parameter
        user = authenticate(websocket, token)
        
        await websocket.accept()
        
        # Continue with existing logic...
        
    except AuthenticationError:
        await websocket.close(code=1008)
        return
```

Also update the frontend WebSocket connection to include authentication:
```javascript
const ws = new WebSocket(`ws://localhost:4322/ws/todo-list/${todoListId}?token=${accessToken}`);
```

## Impact
- **Severity**: High
- **Affected Users**: All users attempting to use real-time collaboration features
- **Functionality**: Real-time collaboration features for shared todo lists will not work properly
- **User Experience**: Prevents users from seeing live updates when collaborating on shared lists