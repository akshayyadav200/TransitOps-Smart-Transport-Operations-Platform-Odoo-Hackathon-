# API Contract

## Base URL

Backend routes are prefixed with `/api`.

## Response Convention

Success responses:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "Clear error message",
  "errors": []
}
```

Production responses must not expose stack traces, secrets, database URLs, or internal credentials.

## Health

`GET /api/health`

Returns:

- `success`
- `service`
- `environment`
- `database.state`
- `timestamp`

## Authentication

`POST /api/auth/login`

Request:

```json
{
  "email": "admin@transitops.demo",
  "password": "TransitOpsDemo@123"
}
```

Success response sets an HttpOnly auth cookie and returns safe user fields only:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-id",
      "name": "Admin Demo",
      "email": "admin@transitops.demo",
      "role": "Admin",
      "region": null,
      "isActive": true
    }
  }
}
```

Invalid login responses use a generic message:

```json
{
  "success": false,
  "message": "Invalid email or password",
  "errors": []
}
```

`GET /api/auth/me`

Requires the auth cookie or a bearer token. Returns the current active user.

`POST /api/auth/logout`

Clears the auth cookie.

## Authorization

Backend modules must enforce access with `authenticate` and `authorizeRoles(...)`.

Role access:

- Admin: full access
- Fleet Manager: vehicles, drivers, maintenance, compliance, dashboard, reports
- Dispatcher: trip creation and dispatch-related operations
- Safety Officer: driver compliance and safety information
- Financial Analyst: fuel, expenses, reports and analytics

## Shared Status Values

Roles:

- Admin
- Fleet Manager
- Dispatcher
- Safety Officer
- Financial Analyst

Vehicle statuses:

- Available
- On Trip
- In Shop
- Retired

Driver statuses:

- Available
- On Trip
- Off Duty
- Suspended

Trip statuses:

- Draft
- Dispatched
- Completed
- Cancelled

Maintenance statuses:

- Active
- Completed
- Cancelled
