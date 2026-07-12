import { Router } from "express";
import { analyticsRouter } from "./analytics.routes.js";
import { complianceRouter } from "./compliance.routes.js";
import { driverRouter } from "./driver.routes.js";
import { expenseRouter } from "./expense.routes.js";
import { fuelRouter } from "./fuel.routes.js";
import { healthRouter } from "./health.routes.js";
import { reportRouter } from "./report.routes.js";
import { tripRouter } from "./trip.routes.js";
import { vehicleRouter } from "./vehicle.routes.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/vehicles", vehicleRouter);
apiRouter.use("/drivers", driverRouter);
apiRouter.use("/trips", tripRouter);
apiRouter.use("/fuel", fuelRouter);
apiRouter.use("/expenses", expenseRouter);
apiRouter.use("/analytics", analyticsRouter);
apiRouter.use("/reports", reportRouter);
apiRouter.use("/compliance", complianceRouter);
