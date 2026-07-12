import { Router } from "express";
import {
  cancelTripById,
  completeTripById,
  createTrip,
  deleteTripById,
  dispatchTripById,
  getDispatchOptions,
  getTripById,
  getTrips,
  updateTrip
} from "../controllers/trip.controller.js";
import { ROLES } from "../constants/enums.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

export const tripRouter = Router();

tripRouter.use(authenticate);

tripRouter.get("/dispatch-options", authorizeRoles(ROLES.ADMIN, ROLES.DISPATCHER), getDispatchOptions);
tripRouter.get("/", authorizeRoles(ROLES.ADMIN, ROLES.DISPATCHER), getTrips);
tripRouter.get("/:id", authorizeRoles(ROLES.ADMIN, ROLES.DISPATCHER), getTripById);
tripRouter.post("/", authorizeRoles(ROLES.ADMIN, ROLES.DISPATCHER), createTrip);
tripRouter.put("/:id", authorizeRoles(ROLES.ADMIN, ROLES.DISPATCHER), updateTrip);
tripRouter.patch("/:id/dispatch", authorizeRoles(ROLES.ADMIN, ROLES.DISPATCHER), dispatchTripById);
tripRouter.patch("/:id/complete", authorizeRoles(ROLES.ADMIN, ROLES.DISPATCHER), completeTripById);
tripRouter.patch("/:id/cancel", authorizeRoles(ROLES.ADMIN, ROLES.DISPATCHER), cancelTripById);
tripRouter.delete("/:id", authorizeRoles(ROLES.ADMIN, ROLES.DISPATCHER), deleteTripById);
