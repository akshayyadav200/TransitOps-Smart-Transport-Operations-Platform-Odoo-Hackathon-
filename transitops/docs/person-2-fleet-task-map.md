# Person 2 Fleet And Driver Task Map

This task map follows the existing Person 1 project foundation.

## Existing Stack In GitHub Repo

- Backend: Express, Mongoose, Node.js
- Frontend: React, Vite
- API prefix: `/api`
- Shared constants: `backend/src/constants/enums.js`
- Response convention: `{ success, message, data }`

## Person 2 Backend Files

Vehicle module:

```text
backend/src/models/Vehicle.js
backend/src/validators/vehicleValidator.js
backend/src/repositories/vehicleRepository.js
backend/src/services/vehicleService.js
backend/src/controllers/vehicleController.js
backend/src/routes/vehicle.routes.js
```

Driver module:

```text
backend/src/models/Driver.js
backend/src/validators/driverValidator.js
backend/src/repositories/driverRepository.js
backend/src/services/driverService.js
backend/src/controllers/driverController.js
backend/src/routes/driver.routes.js
```

Compliance module:

```text
backend/src/services/complianceService.js
backend/src/controllers/complianceController.js
backend/src/routes/compliance.routes.js
```

## Person 2 Frontend Files

```text
frontend/src/features/fleet/vehicles
frontend/src/features/fleet/drivers
frontend/src/features/fleet/compliance
frontend/src/components/common
```

## Required API Contracts

```text
GET    /api/vehicles
POST   /api/vehicles
PUT    /api/vehicles/:id
DELETE /api/vehicles/:id
GET    /api/vehicles/available

GET    /api/drivers
POST   /api/drivers
PUT    /api/drivers/:id
DELETE /api/drivers/:id
GET    /api/drivers/available

GET    /api/compliance/drivers
```

## Revised Development Order

1. Add Person 2 folders according to Person 1 foundation.
2. Add vehicle and driver Mongoose models.
3. Add validation helpers.
4. Add repositories for database access.
5. Add services for business rules.
6. Add controllers.
7. Add routes and mount them in `backend/src/routes/index.js`.
8. Add backend tests.
9. Add frontend API functions.
10. Add shared frontend components.
11. Add vehicle pages.
12. Add driver pages.
13. Add compliance dashboard.

