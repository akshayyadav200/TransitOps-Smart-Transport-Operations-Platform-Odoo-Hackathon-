import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildDateFilter } from "../src/services/financeService.js";
import { FuelLog } from "../src/models/FuelLog.js";
import { Expense } from "../src/models/Expense.js";

describe("finance validation and reporting helpers", () => {
  it("builds bounded date filters", () => {
    const filter = buildDateFilter({ startDate: "2026-07-01", endDate: "2026-07-12" }, "filledAt");

    assert.equal(filter.filledAt.$gte instanceof Date, true);
    assert.equal(filter.filledAt.$lte instanceof Date, true);
  });

  it("rejects malformed date filters", () => {
    assert.throws(() => buildDateFilter({ startDate: "not-a-date" }, "filledAt"), /Invalid date filter/);
  });

  it("enforces positive fuel and expense values in schemas", async () => {
    const fuelLog = new FuelLog({ vehicle: "507f1f77bcf86cd799439011", liters: -1, cost: -1 });
    const expense = new Expense({ amount: -1, description: "Bad expense" });

    await assert.rejects(() => fuelLog.validate(), /Fuel liters must be greater than zero/);
    await assert.rejects(() => expense.validate(), /Expense amount must be greater than zero/);
  });
});
