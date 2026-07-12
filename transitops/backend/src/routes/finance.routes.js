import { Router } from "express";
import {
  exportReportCsv,
  getDashboard,
  getExpenses,
  getFuelLogs,
  getReportData,
  postExpense,
  postFuelLog,
  putExpense,
  putFuelLog,
  removeExpense,
  removeFuelLog
} from "../controllers/finance.controller.js";
import { ROLES } from "../constants/enums.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

export const financeRouter = Router();

financeRouter.use(authenticate);

const financeRoles = [ROLES.ADMIN, ROLES.FINANCIAL_ANALYST];
const reportRoles = [ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST];

financeRouter.get("/fuel", authorizeRoles(...financeRoles), getFuelLogs);
financeRouter.post("/fuel", authorizeRoles(...financeRoles), postFuelLog);
financeRouter.put("/fuel/:id", authorizeRoles(...financeRoles), putFuelLog);
financeRouter.delete("/fuel/:id", authorizeRoles(...financeRoles), removeFuelLog);

financeRouter.get("/expenses", authorizeRoles(...financeRoles), getExpenses);
financeRouter.post("/expenses", authorizeRoles(...financeRoles), postExpense);
financeRouter.put("/expenses/:id", authorizeRoles(...financeRoles), putExpense);
financeRouter.delete("/expenses/:id", authorizeRoles(...financeRoles), removeExpense);

financeRouter.get("/dashboard", authorizeRoles(...reportRoles), getDashboard);
financeRouter.get("/reports", authorizeRoles(...reportRoles), getReportData);
financeRouter.get("/reports/export", authorizeRoles(...reportRoles), exportReportCsv);
