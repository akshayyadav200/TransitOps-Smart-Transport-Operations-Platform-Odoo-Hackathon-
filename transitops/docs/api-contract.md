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

Fuel types:

- Diesel
- Petrol
- CNG
- Electric
- Hybrid
- Other

Expense categories:

- Fuel
- Maintenance
- Repair
- Insurance
- Parking
- Toll
- Miscellaneous

## Business Intelligence Endpoints

Fuel:

- `POST /api/fuel`
- `GET /api/fuel`
- `GET /api/fuel/:id`
- `PUT /api/fuel/:id`
- `DELETE /api/fuel/:id`
- `GET /api/fuel/history`
- `GET /api/fuel/vehicle-wise`
- `GET /api/fuel/trip-wise`

Expenses:

- `POST /api/expenses`
- `GET /api/expenses`
- `GET /api/expenses/:id`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`
- `GET /api/expenses/categories`
- `GET /api/expenses/vehicle-wise`

Analytics and reports:

- `GET /api/analytics/summary`
- `GET /api/reports/vehicles`
- `GET /api/reports/trips`
- `GET /api/reports/fuel`
- `GET /api/reports/expenses`
- `GET /api/reports/costs`
- `GET /api/reports/roi`
- `GET /api/reports/filters`

Supported shared query params:

- `page`
- `limit`
- `search`
- `sort`
- `vehicleId`
- `tripId`
- `driverId`
- `region`
- `status`
- `startDate`
- `endDate`
- `category`
- `fuelType`
