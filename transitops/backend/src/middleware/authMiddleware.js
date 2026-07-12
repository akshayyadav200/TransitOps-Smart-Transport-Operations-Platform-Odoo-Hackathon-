import { User } from "../models/User.js";
import { getTokenFromRequest, verifyAuthToken } from "../utils/auth.js";
import { errorResponse } from "../utils/apiResponse.js";

const AUTH_REQUIRED = "Authentication required";
const ACCESS_DENIED = "You do not have permission to perform this action";

export async function authenticate(req, res, next) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return errorResponse(res, {
        statusCode: 401,
        message: AUTH_REQUIRED
      });
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub);

    if (!user || !user.isActive) {
      return errorResponse(res, {
        statusCode: 401,
        message: AUTH_REQUIRED
      });
    }

    req.user = user;
    req.auth = {
      userId: user._id.toString(),
      role: user.role
    };

    return next();
  } catch {
    return errorResponse(res, {
      statusCode: 401,
      message: AUTH_REQUIRED
    });
  }
}

export function authorizeRoles(...allowedRoles) {
  return function authorize(req, res, next) {
    if (!req.user) {
      return errorResponse(res, {
        statusCode: 401,
        message: AUTH_REQUIRED
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, {
        statusCode: 403,
        message: ACCESS_DENIED
      });
    }

    return next();
  };
}
