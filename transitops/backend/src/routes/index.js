import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { healthRouter } from "./health.routes.js";
import { maintenanceRouter } from "./maintenance.routes.js";
import { tripRouter } from "./trip.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/health", healthRouter);
apiRouter.use("/trips", tripRouter);
apiRouter.use("/maintenance", maintenanceRouter);
