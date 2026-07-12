import { Router } from "express";
import { getDriverCompliance } from "../controllers/complianceController.js";

export const complianceRouter = Router();

complianceRouter.get("/drivers", getDriverCompliance);

