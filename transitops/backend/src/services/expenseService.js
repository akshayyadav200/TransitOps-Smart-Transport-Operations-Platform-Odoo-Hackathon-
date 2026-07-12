import {
  createExpense,
  deleteExpenseById,
  findExpenseById,
  getExpenseCategoryBreakdown,
  getVehicleWiseExpenses,
  searchExpenses,
  updateExpenseById
} from "../repositories/expenseRepository.js";
import { validateExpenseCreate, validateExpenseUpdate } from "../validators/expenseValidator.js";
import { assertTripExists, assertValidObjectId, assertVehicleExists } from "./domainGuards.js";
import { notFound } from "./serviceErrors.js";
import { serializePage, toPlainObject } from "./serialization.js";

async function assertExpenseReferences(data) {
  if (data.vehicleId) {
    await assertVehicleExists(data.vehicleId);
  }

  if (data.tripId) {
    await assertTripExists(data.tripId);
  }
}

export async function listExpenses(query) {
  const result = await searchExpenses(query);
  return serializePage(result);
}

export async function getExpense(id) {
  assertValidObjectId(id);
  const expense = await findExpenseById(id);

  if (!expense) {
    throw notFound("Expense record not found");
  }

  return toPlainObject(expense);
}

export async function addExpense(payload) {
  const data = validateExpenseCreate(payload);
  await assertExpenseReferences(data);
  const expense = await createExpense(data);

  return toPlainObject(expense);
}

export async function editExpense(id, payload) {
  assertValidObjectId(id);
  const data = validateExpenseUpdate(payload);
  await assertExpenseReferences(data);
  const expense = await updateExpenseById(id, data);

  if (!expense) {
    throw notFound("Expense record not found");
  }

  return toPlainObject(expense);
}

export async function removeExpense(id) {
  assertValidObjectId(id);
  const expense = await deleteExpenseById(id);

  if (!expense) {
    throw notFound("Expense record not found");
  }

  return toPlainObject(expense);
}

export async function listExpenseCategories(query) {
  return getExpenseCategoryBreakdown(query);
}

export async function listVehicleWiseExpenses(query) {
  return getVehicleWiseExpenses(query);
}
