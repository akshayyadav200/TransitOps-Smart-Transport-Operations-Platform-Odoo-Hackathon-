import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EXPENSE_CATEGORIES, FUEL_TYPES, REPORT_TYPES } from "../src/features/bi/constants.js";
import { compactParams, formatCurrency, tripLabel, vehicleLabel } from "../src/features/bi/formatters.js";

describe("business intelligence frontend helpers", () => {
  it("keeps report and module option sets complete", () => {
    assert.equal(FUEL_TYPES.includes("Hybrid"), true);
    assert.equal(EXPENSE_CATEGORIES.includes("Miscellaneous"), true);
    assert.deepEqual(REPORT_TYPES.map((report) => report.key), ["vehicles", "trips", "fuel", "expenses", "costs", "roi"]);
  });

  it("formats exported and displayed labels", () => {
    assert.equal(formatCurrency(1200), "₹1,200");
    assert.equal(vehicleLabel({ registrationNumber: "KA01TA2045", name: "Bengaluru Freightliner" }), "KA01TA2045 · Bengaluru Freightliner");
    assert.equal(tripLabel({ tripCode: "TRIP-1", origin: "A", destination: "B" }), "TRIP-1 · A to B");
  });

  it("removes empty filter params", () => {
    assert.deepEqual(compactParams({ vehicleId: "", page: 1, status: null, search: "fuel" }), {
      page: 1,
      search: "fuel"
    });
  });
});
