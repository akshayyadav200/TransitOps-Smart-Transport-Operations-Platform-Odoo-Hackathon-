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
