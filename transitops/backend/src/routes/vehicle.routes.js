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

export const vehicleRouter = Router();

vehicleRouter.get("/", getVehicles);
vehicleRouter.get("/available", getAvailableVehicles);
vehicleRouter.get("/:id", getVehicleById);
vehicleRouter.post("/", createVehicle);
vehicleRouter.put("/:id", updateVehicle);
vehicleRouter.patch("/:id/retire", patchRetireVehicle);
vehicleRouter.delete("/:id", deleteVehicle);

