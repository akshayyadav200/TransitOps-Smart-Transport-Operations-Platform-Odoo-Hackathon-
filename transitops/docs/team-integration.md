# Team Integration

## Shared Backend Foundation

- API prefix: `/api`
- Health endpoint: `GET /api/health`
- Auth endpoints: `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`
- Response convention: `{ success, message, data }` or `{ success, message, errors }`
- Shared constants live in `backend/src/constants/enums.js`
- Use `authenticate` and `authorizeRoles(...)` for protected backend routes.

## Person 2: Fleet And Driver Modules

Use these shared fields.

Vehicle:

- `_id`
- `registrationNumber`
- `name`
- `model`
- `type`
- `maximumLoadCapacity`
- `odometer`
- `acquisitionCost`
- `region`
- `status`

Driver:

- `_id`
- `name`
- `licenseNumber`
- `licenseCategory`
- `licenseExpiryDate`
- `contactNumber`
- `safetyScore`
- `region`
- `status`

## Person 3: Dispatch And Maintenance Modules

Use these shared fields.

Trip:

- `_id`
- `tripNumber`
- `source`
- `destination`
- `vehicle`
- `driver`
- `cargoWeight`
- `distance`
- `revenue`
- `fuel`
- `status`
- `timeline`
- `dispatchedAt`
- `completedAt`
- `cancelledAt`

Maintenance:

- `_id`
- `vehicle`
- `title`
- `description`
- `cost`
- `status`
- `openedAt`
- `closedAt`
- `history`

## Person 4: Finance And Analytics Modules

Use these shared fields.

FuelLog:

- `_id`
- `vehicle`
- `trip`
- `liters`
- `cost`
- `odometer`
- `filledAt`
- `vendor`
- `region`

Expense:

- `_id`
- `vehicle`
- `trip`
- `category`
- `amount`
- `description`
- `expenseDate`
- `region`
