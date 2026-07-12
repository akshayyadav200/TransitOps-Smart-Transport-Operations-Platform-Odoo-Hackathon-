import dotenv from "dotenv";

dotenv.config();

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
