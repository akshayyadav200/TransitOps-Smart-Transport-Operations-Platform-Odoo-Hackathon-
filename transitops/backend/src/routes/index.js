import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { complianceRouter } from "./compliance.routes.js";
import { driverRouter } from "./driver.routes.js";
import { financeRouter } from "./finance.routes.js";
import { healthRouter } from "./health.routes.js";
import { maintenanceRouter } from "./maintenance.routes.js";
import { tripRouter } from "./trip.routes.js";
import { vehicleRouter } from "./vehicle.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/health", healthRouter);
apiRouter.use("/vehicles", vehicleRouter);
apiRouter.use("/drivers", driverRouter);
apiRouter.use("/compliance", complianceRouter);
apiRouter.use("/trips", tripRouter);
apiRouter.use("/maintenance", maintenanceRouter);
apiRouter.use("/finance", financeRouter);
