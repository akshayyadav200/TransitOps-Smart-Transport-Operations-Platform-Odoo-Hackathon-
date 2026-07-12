import jwt from "jsonwebtoken";
import { env, isProduction } from "../config/env.js";

const DEFAULT_COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

export function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  if (typeof user.toSafeUser === "function") {
    return user.toSafeUser();
  }

  return {
    id: user._id?.toString?.() ?? user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    region: user.region ?? null,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export function signAuthToken(user) {
  if (!env.jwtSecret) {
    const error = new Error("JWT_SECRET is required");
    error.statusCode = 500;
    throw error;
  }

  return jwt.sign(
    {
      role: user.role,
      email: user.email
    },
    env.jwtSecret,
    {
      subject: user._id.toString(),
      expiresIn: env.jwtExpiresIn
    }
  );
}

export function verifyAuthToken(token) {
  return jwt.verify(token, env.jwtSecret);
}

export function getTokenFromRequest(req) {
  const cookieToken = req.cookies?.[env.authCookieName];
  if (cookieToken) {
    return cookieToken;
  }

  const authorization = req.get("authorization") ?? "";
  const [scheme, token] = authorization.split(" ");

  if (scheme?.toLowerCase() === "bearer" && token) {
    return token;
  }

  return null;
}

function getCookieMaxAge() {
  const match = String(env.jwtExpiresIn).match(/^(\d+)([smhd])$/);
  if (!match) {
    return DEFAULT_COOKIE_MAX_AGE_MS;
  }

  const value = Number(match[1]);
  const unit = match[2];
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return value * multipliers[unit];
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: getCookieMaxAge()
  };
}

export function setAuthCookie(res, token) {
  res.cookie(env.authCookieName, token, authCookieOptions());
}

export function clearAuthCookie(res) {
  res.clearCookie(env.authCookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction
  });
}
