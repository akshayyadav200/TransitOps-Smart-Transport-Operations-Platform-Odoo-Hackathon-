import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EXPENSE_CATEGORIES, FUEL_TYPES, expenseCategoryValues, fuelTypeValues } from "../src/constants/enums.js";
import {
  calculateFleetUtilization,
  calculateFuelEfficiency,
  calculateOperationalCost,
  calculateRoi
} from "../src/utils/analyticsCalculations.js";
import { validateExpenseCreate } from "../src/validators/expenseValidator.js";
import { validateFuelCreate } from "../src/validators/fuelValidator.js";

const vehicleId = "64f1a4e2a5b7c8d9e0f12345";
const tripId = "64f1a4e2a5b7c8d9e0f12346";

describe("business intelligence rules", () => {
  it("exposes required fuel and expense categories", () => {
    assert.deepEqual(fuelTypeValues, ["Diesel", "Petrol", "CNG", "Electric", "Hybrid", "Other"]);
    assert.deepEqual(expenseCategoryValues, [
      "Fuel",
      "Maintenance",
      "Repair",
      "Insurance",
      "Parking",
      "Toll",
      "Miscellaneous"
    ]);
  });

  it("calculates core BI formulas safely", () => {
    assert.equal(calculateFuelEfficiency(575, 115), 5);
    assert.equal(calculateOperationalCost({ fuelCost: 100, maintenanceCost: 50, otherExpenses: 25 }), 175);
    assert.equal(calculateFleetUtilization(4, 10), 40);
    assert.equal(calculateRoi({ revenue: 300, fuelCost: 80, maintenanceCost: 20, otherExpenses: 0, acquisitionCost: 1000 }), 20);
    assert.equal(calculateRoi({ revenue: 300, acquisitionCost: 0 }), 0);
  });

  it("validates valid fuel payloads", () => {
    const fuel = validateFuelCreate({
      vehicleId,
      tripId,
      liters: 42,
      cost: 3900,
      fuelType: FUEL_TYPES.DIESEL,
      date: "2026-07-12",
      odometer: 12345,
      filledBy: "Ops Lead"
    });

    assert.equal(fuel.vehicleId, vehicleId);
    assert.equal(fuel.tripId, tripId);
    assert.equal(fuel.liters, 42);
  });

  it("rejects invalid expense payloads", () => {
    assert.throws(
      () =>
        validateExpenseCreate({
          vehicleId: "bad",
          category: EXPENSE_CATEGORIES.MAINTENANCE,
          amount: 0,
          date: "bad-date",
          createdBy: ""
        }),
      /Validation failed/
    );
  });
});
