import {
  addExpense,
  editExpense,
  getExpense,
  listExpenseCategories,
  listExpenses,
  listVehicleWiseExpenses,
  removeExpense
} from "../services/expenseService.js";
import { successResponse } from "../utils/apiResponse.js";

export async function getExpenses(req, res, next) {
  try {
    const data = await listExpenses(req.query);
    return successResponse(res, { message: "Expenses fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function getExpenseById(req, res, next) {
  try {
    const data = await getExpense(req.params.id);
    return successResponse(res, { message: "Expense fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function createExpenseRecord(req, res, next) {
  try {
    const data = await addExpense(req.body);
    return successResponse(res, { message: "Expense created successfully", data, statusCode: 201 });
  } catch (error) {
    return next(error);
  }
}

export async function updateExpenseRecord(req, res, next) {
  try {
    const data = await editExpense(req.params.id, req.body);
    return successResponse(res, { message: "Expense updated successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function deleteExpenseRecord(req, res, next) {
  try {
    const data = await removeExpense(req.params.id);
    return successResponse(res, { message: "Expense deleted successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function getExpenseCategories(req, res, next) {
  try {
    const data = await listExpenseCategories(req.query);
    return successResponse(res, { message: "Expense categories fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}

export async function getVehicleWiseExpenses(req, res, next) {
  try {
    const data = await listVehicleWiseExpenses(req.query);
    return successResponse(res, { message: "Vehicle-wise expenses fetched successfully", data });
  } catch (error) {
    return next(error);
  }
}
