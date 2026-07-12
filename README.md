# TransitOps

Smart Transport Operations Platform for logistics companies.

## Module Ownership

This workspace contains the foundation for the Fleet & Driver Management module.

Person 2 owns:

- Vehicle Management
- Driver Management
- Compliance Dashboard

## Project Structure

```text
backend/   Spring Boot API
frontend/  React application
docs/      Architecture and team integration notes
```

## Team Architecture

The codebase is organized as a modular monorepo for four hackathon contributors.

```text
Person 1: Auth, RBAC, dashboard, integration
Person 2: Fleet, drivers, compliance
Person 3: Trips, maintenance
Person 4: Fuel logs, expenses, reports, analytics
```

See:

```text
docs/team-integration-plan.md
```

## Backend

```bash
cd backend
mvn spring-boot:run
```

Default API prefix:

```text
/api/v1
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Task Commit Strategy

Commit after every approved task:

```bash
git add .
git commit -m "chore: initialize TransitOps project foundation"
git push
```
