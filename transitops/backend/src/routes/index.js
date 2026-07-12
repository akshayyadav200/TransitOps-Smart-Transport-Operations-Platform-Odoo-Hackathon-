import { Router } from "express";
import { complianceRouter } from "./compliance.routes.js";
import { driverRouter } from "./driver.routes.js";
import { healthRouter } from "./health.routes.js";
import { vehicleRouter } from "./vehicle.routes.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/vehicles", vehicleRouter);
apiRouter.use("/drivers", driverRouter);
apiRouter.use("/compliance", complianceRouter);
