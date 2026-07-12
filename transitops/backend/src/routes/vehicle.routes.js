import { Router } from "express";
import {
  createVehicle,
  deleteVehicle,
  getAvailableVehicles,
  getVehicleById,
  getVehicles,
  patchRetireVehicle,
  updateVehicle
} from "../controllers/vehicleController.js";
import { ROLES } from "../constants/enums.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

export const vehicleRouter = Router();

vehicleRouter.use(authenticate);

vehicleRouter.get("/", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER), getVehicles);
vehicleRouter.get("/available", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.DISPATCHER), getAvailableVehicles);
vehicleRouter.get("/:id", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER), getVehicleById);
vehicleRouter.post("/", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER), createVehicle);
vehicleRouter.put("/:id", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER), updateVehicle);
vehicleRouter.patch("/:id/retire", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER), patchRetireVehicle);
vehicleRouter.delete("/:id", authorizeRoles(ROLES.ADMIN, ROLES.FLEET_MANAGER), deleteVehicle);
