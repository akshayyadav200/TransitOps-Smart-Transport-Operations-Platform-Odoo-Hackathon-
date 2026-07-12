import { Router } from "express";
import {
  closeMaintenanceById,
  createMaintenance,
  deleteMaintenanceById,
  getMaintenanceById,
  getMaintenanceRecords,
  updateMaintenance
} from "../controllers/maintenance.controller.js";
import { ROLES } from "../constants/enums.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

export const maintenanceRouter = Router();

maintenanceRouter.use(authenticate);

maintenanceRouter.get("/", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER), getMaintenanceRecords);
maintenanceRouter.get("/:id", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER), getMaintenanceById);
maintenanceRouter.post("/", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER), createMaintenance);
maintenanceRouter.put("/:id", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER), updateMaintenance);
maintenanceRouter.patch("/:id/close", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER), closeMaintenanceById);
maintenanceRouter.delete("/:id", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER), deleteMaintenanceById);
