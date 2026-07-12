import dotenv from "dotenv";

dotenv.config();

const allowedNodeEnvironments = new Set(["development", "test", "production"]);
const frontendUrls = (process.env.FRONTEND_URL ?? "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

export const env = {
  port: Number(process.env.PORT ?? 5000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: process.env.DATABASE_URL ?? "mongodb://localhost:27017/transitops",
  frontendUrl: frontendUrls[0],
  frontendUrls,
  jwtSecret: process.env.JWT_SECRET ?? "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  authCookieName: process.env.AUTH_COOKIE_NAME ?? "transitops_session",
  demoUserPassword: process.env.DEMO_USER_PASSWORD ?? "TransitOpsDemo@123",
  dnsResolvers: (process.env.DNS_RESOLVERS ?? "")
    .split(",")
    .map((resolver) => resolver.trim())
    .filter(Boolean)
};

export const isProduction = env.nodeEnv === "production";

export function validateEnvironment() {
  const errors = [];

  if (!Number.isInteger(env.port) || env.port <= 0 || env.port > 65535) {
    errors.push("PORT must be a valid TCP port");
  }

  if (!allowedNodeEnvironments.has(env.nodeEnv)) {
    errors.push("NODE_ENV must be development, test, or production");
  }

  if (!env.databaseUrl) {
    errors.push("DATABASE_URL is required");
  }

  if (!env.jwtSecret || env.jwtSecret.length < 32) {
    errors.push("JWT_SECRET must be at least 32 characters");
  }

  if (env.frontendUrls.length === 0) {
    errors.push("FRONTEND_URL must include at least one allowed origin");
  }

  for (const frontendUrl of env.frontendUrls) {
    try {
      new URL(frontendUrl);
    } catch {
      errors.push("FRONTEND_URL contains an invalid origin");
      break;
    }
  }

  if (errors.length > 0) {
    const error = new Error(`Environment validation failed: ${errors.join("; ")}`);
    error.statusCode = 500;
    throw error;
  }
}
