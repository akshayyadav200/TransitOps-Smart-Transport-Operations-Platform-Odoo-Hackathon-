import { Router } from "express";
import { getTripById, getTrips } from "../controllers/tripController.js";

export const tripRouter = Router();

tripRouter.get("/", getTrips);
tripRouter.get("/:id", getTripById);
