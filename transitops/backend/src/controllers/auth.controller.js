import { User, MIN_PASSWORD_LENGTH } from "../models/User.js";
import { clearAuthCookie, normalizeEmail, sanitizeUser, setAuthCookie, signAuthToken } from "../utils/auth.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

const INVALID_CREDENTIALS = "Invalid email or password";

function validateLoginInput({ email, password }) {
  const errors = [];

  if (!email || !String(email).includes("@")) {
    errors.push({ field: "email", message: "A valid email is required" });
  }

  if (!password || String(password).length < MIN_PASSWORD_LENGTH) {
    errors.push({
      field: "password",
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
    });
  }

  return errors;
}

export async function login(req, res) {
  const errors = validateLoginInput(req.body ?? {});
  if (errors.length > 0) {
    return errorResponse(res, {
      statusCode: 400,
      message: "Invalid login input",
      errors
    });
  }

  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password);
  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.isActive) {
    return errorResponse(res, {
      statusCode: 401,
      message: INVALID_CREDENTIALS
    });
  }

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    return errorResponse(res, {
      statusCode: 401,
      message: INVALID_CREDENTIALS
    });
  }

  const token = signAuthToken(user);
  setAuthCookie(res, token);

  return successResponse(res, {
    message: "Login successful",
    data: {
      user: sanitizeUser(user)
    }
  });
}

export function me(req, res) {
  return successResponse(res, {
    message: "Current user retrieved",
    data: {
      user: sanitizeUser(req.user)
    }
  });
}

export function logout(_req, res) {
  clearAuthCookie(res);

  return successResponse(res, {
    message: "Logout successful",
    data: {}
  });
}
