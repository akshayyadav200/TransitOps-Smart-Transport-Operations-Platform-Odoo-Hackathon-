import { Router } from "express";
import { getDriverCompliance } from "../controllers/complianceController.js";
import { ROLES } from "../constants/enums.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

export const complianceRouter = Router();

complianceRouter.use(authenticate);

complianceRouter.get("/drivers", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER), getDriverCompliance);
