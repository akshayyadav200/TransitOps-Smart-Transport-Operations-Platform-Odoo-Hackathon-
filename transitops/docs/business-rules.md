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
