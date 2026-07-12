import { Router } from "express";
import {
  createDriver,
  deleteDriver,
  getAvailableDrivers,
  getDriverById,
  getDrivers,
  updateDriver
} from "../controllers/driverController.js";

export const driverRouter = Router();

driverRouter.get("/", getDrivers);
driverRouter.get("/available", getAvailableDrivers);
driverRouter.get("/:id", getDriverById);
driverRouter.post("/", createDriver);
driverRouter.put("/:id", updateDriver);
driverRouter.delete("/:id", deleteDriver);

