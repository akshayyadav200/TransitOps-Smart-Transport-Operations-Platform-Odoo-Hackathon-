import { Expense } from "../models/Expense.js";
import { buildPagination, buildSort, pageResponse } from "./queryUtils.js";
import { dateRangeFilter, referenceFilter, searchFilter } from "./reportQueryUtils.js";

const EXPENSE_SORT_FIELDS = ["date", "category", "amount", "createdBy", "createdAt"];

export function buildExpenseFilter(query = {}) {
  return {
    ...referenceFilter(query, { driver: false }),
    ...dateRangeFilter(query),
    ...searchFilter(query, ["category", "description", "createdBy"]),
    ...(query.category ? { category: query.category } : {})
  };
}

function populateExpense(query) {
  return query.populate("vehicleId", "registrationNumber name type region status acquisitionCost")
    .populate("tripId", "tripCode origin destination status distanceKm revenue scheduledStart region");
}

export async function createExpense(data) {
  const expense = await Expense.create(data);
  return populateExpense(Expense.findById(expense._id));
}

export async function findExpenseById(id) {
  return populateExpense(Expense.findById(id));
}

export async function updateExpenseById(id, data) {
  return populateExpense(Expense.findByIdAndUpdate(id, data, { new: true, runValidators: true }));
}

export async function deleteExpenseById(id) {
  return populateExpense(Expense.findByIdAndDelete(id));
}

export async function searchExpenses(query) {
  const { page, limit, skip } = buildPagination(query);
  const filter = buildExpenseFilter(query);
  const sort = buildSort(query, EXPENSE_SORT_FIELDS, "date");

  const [items, total] = await Promise.all([
    populateExpense(Expense.find(filter)).sort(sort).skip(skip).limit(limit),
    Expense.countDocuments(filter)
  ]);

  return pageResponse({ items, total, page, limit });
}

export async function getExpenseTotals(query = {}) {
  const [summary] = await Expense.aggregate([
    { $match: buildExpenseFilter(query) },
    {
      $group: {
        _id: null,
        amount: { $sum: "$amount" },
        records: { $sum: 1 }
      }
    }
  ]);

  return {
    amount: summary?.amount ?? 0,
    records: summary?.records ?? 0
  };
}

export async function getExpenseCategoryBreakdown(query = {}) {
  return Expense.aggregate([
    { $match: buildExpenseFilter(query) },
    {
      $group: {
        _id: "$category",
        amount: { $sum: "$amount" },
        records: { $sum: 1 }
      }
    },
    { $sort: { amount: -1 } },
    { $project: { _id: 0, category: "$_id", amount: 1, records: 1 } }
  ]);
}

export async function getVehicleWiseExpenses(query = {}) {
  return Expense.aggregate([
    { $match: buildExpenseFilter(query) },
    {
      $group: {
        _id: "$vehicleId",
        amount: { $sum: "$amount" },
        records: { $sum: 1 },
        lastExpense: { $max: "$date" }
      }
    },
    {
      $lookup: {
        from: "vehicles",
        localField: "_id",
        foreignField: "_id",
        as: "vehicle"
      }
    },
    { $unwind: { path: "$vehicle", preserveNullAndEmptyArrays: true } },
    { $sort: { amount: -1 } }
  ]);
}
