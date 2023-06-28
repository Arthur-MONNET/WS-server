# Vulpo Server API Documentation

## WebSocket Endpoints

### Connection

**Event:** `'connection'`

Triggered when a client connects to the WebSocket server.

### Message

**Event:** `'message'`

Triggered when a message is received from a client.

**Payload:**

- `target`: Target of the message (`'app'` or `'beacon'`).
- `sender`: Sender of the message (`'app'` or `'beacon'`).
- `payload`: Data payload.
- `type`: Type of the message.

### Close

**Event:** `'close'`

Triggered when a client disconnects from the WebSocket server.

## Error Handling

The server returns appropriate HTTP status codes and error messages for different scenarios, such as invalid requests or authentication failures. The following table lists the HTTP status codes and error messages returned by the server.

| Status Code | Error Message | Description |
| ----------- | ------------- | ----------- |
| 400 | Bad Request | The request is invalid. |
| 401 | Unauthorized | The request requires authentication. |
| 403 | Forbidden | The request is not allowed. |
| 404 | Not Found | The requested resource is not found. |
| 409 | Conflict | The request could not be completed due to a conflict with the current state of the resource. |
| 500 | Internal Server Error | The server encountered an unexpected condition that prevented it from fulfilling the request. |
| 503 | Service Unavailable | The server is currently unavailable. |