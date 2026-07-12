import { Router } from "express";
import {
  createFuelRecord,
  deleteFuelRecord,
  getFuelHistory,
  getFuelRecordById,
  getFuelRecords,
  getTripWiseFuel,
  getVehicleWiseFuel,
  updateFuelRecord
} from "../controllers/fuelController.js";

export const fuelRouter = Router();

fuelRouter.get("/", getFuelRecords);
fuelRouter.get("/history", getFuelHistory);
fuelRouter.get("/vehicle-wise", getVehicleWiseFuel);
fuelRouter.get("/trip-wise", getTripWiseFuel);
fuelRouter.get("/:id", getFuelRecordById);
fuelRouter.post("/", createFuelRecord);
fuelRouter.put("/:id", updateFuelRecord);
fuelRouter.delete("/:id", deleteFuelRecord);
