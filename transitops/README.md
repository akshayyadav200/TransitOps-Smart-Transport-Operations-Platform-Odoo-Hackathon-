# TransitOps

TransitOps is a Smart Transport Operations Platform for a 6-hour hackathon build.

## Stack

- Frontend: Vite + React
- Backend: Node.js + Express
- Database: MongoDB via Mongoose
- Package manager: npm workspaces

## Project Structure

```text
transitops/
  backend/
  frontend/
  docs/
  README.md
  .gitignore
  .env.example
```

## Environment

Copy `.env.example` into environment-specific `.env` files as needed. Do not commit real secrets.

Required variables:

- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `AUTH_COOKIE_NAME`
- `FRONTEND_URL`
- `DEMO_USER_PASSWORD`

Frontend variables:

- `VITE_API_BASE_URL`

## Commands

Install dependencies:

```bash
npm install
```

Run backend:

```bash
npm run dev:backend
```

Run frontend:

```bash
npm run dev:frontend
```

Run quality checks:

```bash
npm run lint
npm run build
npm test
```

Seed demo users:

```bash
npm run seed:demo
```

Default local demo password: `TransitOpsDemo@123`. Override it with `DEMO_USER_PASSWORD`.

## Authentication

Auth routes:

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

The backend stores the signed JWT in an HttpOnly cookie named by `AUTH_COOKIE_NAME`. Frontend requests use `credentials: "include"` through the shared API client.

Demo users:

- `admin@transitops.demo` - Admin
- `fleet@transitops.demo` - Fleet Manager
- `dispatcher@transitops.demo` - Dispatcher
- `safety@transitops.demo` - Safety Officer
- `finance@transitops.demo` - Financial Analyst

Backend routes that need protection should use `authenticate` and `authorizeRoles(...)`.

## API Health Check

```http
GET /api/health
```

Response shape:

```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "service": "TransitOps API",
    "environment": "development",
    "database": {
      "state": "connected"
    },
    "timestamp": "2026-07-12T00:00:00.000Z"
  }
}
```
