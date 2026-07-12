import assert from "node:assert/strict";
import { afterEach, before, describe, it, mock } from "node:test";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "test-secret-for-auth-suite";
process.env.JWT_EXPIRES_IN = "1h";
process.env.AUTH_COOKIE_NAME = "transitops_test_session";
process.env.NODE_ENV = "test";

let createApp;
let User;
let ROLES;
let authorizeRoles;
let signAuthToken;

before(async () => {
  ({ createApp } = await import("../src/app.js"));
  ({ User } = await import("../src/models/User.js"));
  ({ ROLES } = await import("../src/constants/enums.js"));
  ({ authorizeRoles } = await import("../src/middleware/authMiddleware.js"));
  ({ signAuthToken } = await import("../src/utils/auth.js"));
});

afterEach(() => {
  mock.restoreAll();
});

function makeUser(overrides = {}) {
  const password = overrides.password ?? "Password@123";
  const user = {
    _id: {
      toString: () => overrides.id ?? "507f1f77bcf86cd799439011"
    },
    name: overrides.name ?? "Admin Demo",
    email: overrides.email ?? "admin@transitops.demo",
    passwordHash: bcrypt.hashSync(password, 8),
    role: overrides.role ?? "Admin",
    region: overrides.region ?? null,
    isActive: overrides.isActive ?? true,
    createdAt: new Date("2026-07-12T00:00:00.000Z"),
    updatedAt: new Date("2026-07-12T00:00:00.000Z"),
    comparePassword(candidatePassword) {
      return bcrypt.compare(candidatePassword, this.passwordHash);
    },
    toSafeUser() {
      return {
        id: this._id.toString(),
        name: this.name,
        email: this.email,
        role: this.role,
        region: this.region,
        isActive: this.isActive,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      };
    }
  };

  return { ...user, ...overrides };
}

function mockFindOne(user) {
  mock.method(User, "findOne", () => ({
    select: async () => user
  }));
}

function mockFindById(user) {
  mock.method(User, "findById", async () => user);
}

async function withServer(testFn) {
  const app = createApp();
  const server = app.listen(0);
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    await testFn(baseUrl);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function postJson(baseUrl, path, body, headers = {}) {
  return fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    body: JSON.stringify(body)
  });
}

describe("authentication routes", () => {
  it("logs in with valid credentials and returns safe user fields", async () => {
    const user = makeUser();
    mockFindOne(user);

    await withServer(async (baseUrl) => {
      const response = await postJson(baseUrl, "/api/auth/login", {
        email: " ADMIN@TransitOps.Demo ",
        password: "Password@123"
      });
      const payload = await response.json();

      assert.equal(response.status, 200);
      assert.equal(payload.success, true);
      assert.equal(payload.data.user.email, "admin@transitops.demo");
      assert.equal(payload.data.user.password, undefined);
      assert.match(response.headers.get("set-cookie"), /HttpOnly/);
    });
  });

  it("rejects an invalid password", async () => {
    mockFindOne(makeUser());

    await withServer(async (baseUrl) => {
      const response = await postJson(baseUrl, "/api/auth/login", {
        email: "admin@transitops.demo",
        password: "WrongPass123"
      });
      const payload = await response.json();

      assert.equal(response.status, 401);
      assert.equal(payload.message, "Invalid email or password");
    });
  });

  it("rejects an unknown account without exposing account existence", async () => {
    mockFindOne(null);

    await withServer(async (baseUrl) => {
      const response = await postJson(baseUrl, "/api/auth/login", {
        email: "unknown@transitops.demo",
        password: "Password@123"
      });
      const payload = await response.json();

      assert.equal(response.status, 401);
      assert.equal(payload.message, "Invalid email or password");
    });
  });

  it("rejects inactive accounts", async () => {
    mockFindOne(makeUser({ isActive: false }));

    await withServer(async (baseUrl) => {
      const response = await postJson(baseUrl, "/api/auth/login", {
        email: "admin@transitops.demo",
        password: "Password@123"
      });

      assert.equal(response.status, 401);
    });
  });

  it("rejects missing tokens", async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/auth/me`);
      const payload = await response.json();

      assert.equal(response.status, 401);
      assert.equal(payload.message, "Authentication required");
    });
  });

  it("rejects expired tokens", async () => {
    const expiredToken = jwt.sign({}, process.env.JWT_SECRET, {
      subject: "507f1f77bcf86cd799439011",
      expiresIn: "-1s"
    });

    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/auth/me`, {
        headers: {
          Cookie: `${process.env.AUTH_COOKIE_NAME}=${expiredToken}`
        }
      });

      assert.equal(response.status, 401);
    });
  });

  it("returns the current user for a valid session", async () => {
    const user = makeUser();
    mockFindById(user);
    const token = signAuthToken(user);

    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/auth/me`, {
        headers: {
          Cookie: `${process.env.AUTH_COOKIE_NAME}=${token}`
        }
      });
      const payload = await response.json();

      assert.equal(response.status, 200);
      assert.equal(payload.data.user.email, "admin@transitops.demo");
      assert.equal(payload.data.user.password, undefined);
    });
  });

  it("clears the auth cookie on logout", async () => {
    const user = makeUser();
    mockFindById(user);
    const token = signAuthToken(user);

    await withServer(async (baseUrl) => {
      const response = await postJson(
        baseUrl,
        "/api/auth/logout",
        {},
        {
          Cookie: `${process.env.AUTH_COOKIE_NAME}=${token}`
        }
      );
      const payload = await response.json();

      assert.equal(response.status, 200);
      assert.equal(payload.message, "Logout successful");
      assert.match(response.headers.get("set-cookie"), /transitops_test_session=/);
    });
  });

  it("rejects logout without a valid session", async () => {
    await withServer(async (baseUrl) => {
      const response = await postJson(baseUrl, "/api/auth/logout", {});
      const payload = await response.json();

      assert.equal(response.status, 401);
      assert.equal(payload.message, "Authentication required");
    });
  });
});

describe("API hardening", () => {
  it("handles malformed JSON consistently", async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: "{"
      });
      const payload = await response.json();

      assert.equal(response.status, 400);
      assert.equal(payload.success, false);
      assert.equal(payload.message, "Malformed JSON request body");
    });
  });

  it("rejects oversized request bodies", async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: "admin@transitops.demo", password: "Password@123", padding: "x".repeat(110_000) })
      });
      const payload = await response.json();

      assert.equal(response.status, 413);
      assert.equal(payload.success, false);
      assert.equal(payload.message, "Request body is too large");
    });
  });

  it("returns a consistent route-not-found error", async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/missing-route`);
      const payload = await response.json();

      assert.equal(response.status, 404);
      assert.equal(payload.success, false);
      assert.equal(payload.message, "Route not found: /api/missing-route");
    });
  });

  it("adds general rate limit headers", async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/health`);

      assert.equal(response.status, 200);
      assert.equal(response.headers.has("ratelimit-limit"), true);
    });
  });
});

describe("RBAC middleware", () => {
  function mockResponse() {
    return {
      statusCode: 200,
      payload: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.payload = payload;
        return this;
      }
    };
  }

  it("allows an authorized role", () => {
    const req = { user: { role: ROLES.FLEET_MANAGER } };
    const res = mockResponse();
    let nextCalled = false;

    authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER)(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.equal(res.payload, null);
  });

  it("forbids an unauthorized role", () => {
    const req = { user: { role: ROLES.DISPATCHER } };
    const res = mockResponse();

    authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER)(req, res, () => {});

    assert.equal(res.statusCode, 403);
    assert.equal(res.payload.success, false);
  });
});

describe("operations route security", () => {
  it("rejects unauthenticated trip access", async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/trips`);
      const payload = await response.json();

      assert.equal(response.status, 401);
      assert.equal(payload.message, "Authentication required");
    });
  });

  it("forbids fleet managers from dispatch routes", async () => {
    const user = makeUser({ role: ROLES.FLEET_MANAGER });
    mockFindById(user);
    const token = signAuthToken(user);

    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/trips`, {
        headers: {
          Cookie: `${process.env.AUTH_COOKIE_NAME}=${token}`
        }
      });

      assert.equal(response.status, 403);
    });
  });

  it("forbids dispatchers from maintenance routes", async () => {
    const user = makeUser({ role: ROLES.DISPATCHER });
    mockFindById(user);
    const token = signAuthToken(user);

    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/maintenance`, {
        headers: {
          Cookie: `${process.env.AUTH_COOKIE_NAME}=${token}`
        }
      });

      assert.equal(response.status, 403);
    });
  });
});

describe("fleet route security", () => {
  it("rejects unauthenticated vehicle access", async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/vehicles`);
      const payload = await response.json();

      assert.equal(response.status, 401);
      assert.equal(payload.message, "Authentication required");
    });
  });

  it("forbids dispatchers from vehicle management routes", async () => {
    const user = makeUser({ role: ROLES.DISPATCHER });
    mockFindById(user);
    const token = signAuthToken(user);

    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/vehicles`, {
        headers: {
          Cookie: `${process.env.AUTH_COOKIE_NAME}=${token}`
        }
      });

      assert.equal(response.status, 403);
    });
  });

  it("forbids dispatchers from compliance dashboard", async () => {
    const user = makeUser({ role: ROLES.DISPATCHER });
    mockFindById(user);
    const token = signAuthToken(user);

    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/api/compliance/drivers`, {
        headers: {
          Cookie: `${process.env.AUTH_COOKIE_NAME}=${token}`
        }
      });

      assert.equal(response.status, 403);
    });
  });
});
