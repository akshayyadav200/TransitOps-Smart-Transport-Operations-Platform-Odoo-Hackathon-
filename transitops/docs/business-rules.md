# Business Rules

## Access Roles

- Admin: full platform administration.
- Fleet Manager: vehicle, driver, and maintenance operations.
- Dispatcher: trip planning and dispatch coordination.
- Safety Officer: driver compliance and safety oversight.
- Financial Analyst: revenue, fuel, maintenance, and expense review.

## Foundation Rules

- All API responses follow the shared success/error convention.
- Backend routes live under `/api`.
- Health checks must never expose credentials or secret configuration.
- User email addresses are stored lowercase and trimmed.
- User email addresses must be unique.
- Production error responses must not include stack traces.

## Domain Status Rules

- Vehicle statuses: Available, On Trip, In Shop, Retired.
- Driver statuses: Available, On Trip, Off Duty, Suspended.
- Trip statuses: Draft, Dispatched, Completed, Cancelled.
- Maintenance statuses: Active, Completed, Cancelled.

## Dispatch Rules

- Only draft trips can be dispatched.
- Vehicle and driver must exist.
- Vehicle must be Available, not Retired, not In Shop, and not already On Trip.
- Driver must be Available, not Suspended, not Off Duty, not already On Trip, and must have a valid licence.
- Cargo weight must not exceed vehicle capacity.
- Dispatch changes trip to `Dispatched`, vehicle to `On Trip`, and driver to `On Trip`.
- Completion changes trip to `Completed`, restores vehicle and driver to `Available`, and updates trip timeline.
- Cancellation changes trip to `Cancelled` and restores vehicle and driver when applicable.

## Maintenance Rules

- Opening maintenance moves the vehicle to `In Shop`.
- In-shop vehicles are excluded from dispatch options.
- Closing maintenance restores the vehicle to `Available` unless the vehicle is Retired.

## Finance Rules

- Fuel liters must be greater than zero.
- Fuel cost, odometer, maintenance cost, and expense values cannot be negative.
- Expenses must have a valid category and positive amount.
- Reports and dashboard calculations use seeded and live vehicle, trip, fuel, maintenance, and expense data.
