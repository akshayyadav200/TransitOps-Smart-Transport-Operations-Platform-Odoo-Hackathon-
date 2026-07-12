import { Router } from "express";
import { getSummary } from "../controllers/analyticsController.js";

export const analyticsRouter = Router();

analyticsRouter.get("/summary", getSummary);
