import { Router } from "express";
import {
  createExpenseRecord,
  deleteExpenseRecord,
  getExpenseById,
  getExpenseCategories,
  getExpenses,
  getVehicleWiseExpenses,
  updateExpenseRecord
} from "../controllers/expenseController.js";

export const expenseRouter = Router();

expenseRouter.get("/", getExpenses);
expenseRouter.get("/categories", getExpenseCategories);
expenseRouter.get("/vehicle-wise", getVehicleWiseExpenses);
expenseRouter.get("/:id", getExpenseById);
expenseRouter.post("/", createExpenseRecord);
expenseRouter.put("/:id", updateExpenseRecord);
expenseRouter.delete("/:id", deleteExpenseRecord);
