import { Router } from "express";
import { getFilters, reportHandler } from "../controllers/reportController.js";

export const reportRouter = Router();

reportRouter.get("/filters", getFilters);
reportRouter.get("/vehicles", reportHandler("vehicles"));
reportRouter.get("/trips", reportHandler("trips"));
reportRouter.get("/fuel", reportHandler("fuel"));
reportRouter.get("/expenses", reportHandler("expenses"));
reportRouter.get("/costs", reportHandler("costs"));
reportRouter.get("/roi", reportHandler("roi"));
