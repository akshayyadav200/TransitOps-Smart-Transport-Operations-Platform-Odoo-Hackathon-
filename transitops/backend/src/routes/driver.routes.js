import { Router } from "express";
import {
  createDriver,
  deleteDriver,
  getAvailableDrivers,
  getDriverById,
  getDrivers,
  updateDriver
} from "../controllers/driverController.js";
import { ROLES } from "../constants/enums.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

export const driverRouter = Router();

driverRouter.use(authenticate);

driverRouter.get("/", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER), getDrivers);
driverRouter.get("/available", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.DISPATCHER), getAvailableDrivers);
driverRouter.get("/:id", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER), getDriverById);
driverRouter.post("/", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER), createDriver);
driverRouter.put("/:id", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER), updateDriver);
driverRouter.delete("/:id", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER), deleteDriver);
