import { Router } from "express";
import { env } from "../config/env.js";
import { getDatabaseState } from "../config/database.js";
import { successResponse } from "../utils/apiResponse.js";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  return successResponse(res, {
    message: "Service is healthy",
    data: {
      service: "TransitOps API",
      environment: env.nodeEnv,
      database: {
        state: getDatabaseState()
      },
      timestamp: new Date().toISOString()
    }
  });
});
