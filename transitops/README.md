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
- `FRONTEND_URL`

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
