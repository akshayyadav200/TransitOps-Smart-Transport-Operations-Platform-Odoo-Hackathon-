# TransitOps Deployment Notes

## Recommended Hackathon Deployment

Use Render for the backend API and Vercel for the frontend.

1. Push the `develop` branch to GitHub.
2. In Render, create a Blueprint from this repository. Render reads `render.yaml` from the repository root.
3. Set the Render secrets prompted by the Blueprint:
   - `DATABASE_URL`
   - `FRONTEND_URL`
   - `DEMO_USER_PASSWORD`
4. Deploy the Render service and verify:

```text
https://<render-service>.onrender.com/api/health
```

5. In Vercel, import the same GitHub repository from the `develop` branch. The root `vercel.json` builds only the Vite frontend and publishes `frontend/dist`.
6. Set the Vercel environment variable:

```text
VITE_API_BASE_URL=https://<render-service>.onrender.com/api
```

7. After Vercel gives the production URL, update Render:

```text
FRONTEND_URL=https://<vercel-project>.vercel.app
```

8. Redeploy the Render backend after changing `FRONTEND_URL`.
9. Seed demo data from the Render shell or a local terminal pointed at the production database:

```bash
npm run seed:demo
```

Use the demo password stored in `DEMO_USER_PASSWORD`.

## Backend

Required environment variables:

- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `AUTH_COOKIE_NAME`
- `FRONTEND_URL`
- `DEMO_USER_PASSWORD`
- `DNS_RESOLVERS` only when the hosting DNS resolver needs explicit servers

Production commands:

```bash
npm install
npm --workspace backend run build
npm --workspace backend run start
```

Health check:

```text
GET /api/health
```

Expected response includes service name, environment, database state, and timestamp.

## Frontend

Required public frontend variable:

- `VITE_API_BASE_URL`, for example `https://api.example.com/api`

Build command:

```bash
npm --workspace frontend run build
```

Local production preview:

```bash
npm run preview:frontend
```

Output folder:

```text
transitops/frontend/dist
```

SPA fallback:

- Configure the static host to serve `index.html` for unknown frontend routes such as `/dashboard`, `/trips`, `/reports`, and `/fuel`.
- API traffic must be sent to the backend API origin and must not be handled by the SPA fallback.

## CORS

Set `FRONTEND_URL` on the backend to the exact production frontend origin. Multiple origins can be comma-separated.

Example placeholder:

```text
FRONTEND_URL=https://transitops-frontend.example.com
VITE_API_BASE_URL=https://transitops-api.example.com/api
```

## Demo Data

Seed command:

```bash
npm run seed:demo
```

The seed is idempotent and refreshes deterministic demo users, vehicles, drivers, trips, maintenance, fuel, and expense records.

Do not commit `.env` or real secrets. Demo passwords come from `DEMO_USER_PASSWORD`; use a local default only for hackathon demo environments.
