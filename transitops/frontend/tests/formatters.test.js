import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatIndianCurrency,
  formatKilometers,
  formatLiters,
  formatPercentage,
  safeValue
} from "../src/lib/formatters.js";

describe("formatters", () => {
  it("formats Indian operational values", () => {
    assert.equal(formatIndianCurrency(125000), "₹1,25,000");
    assert.equal(formatLiters(1200), "1,200 L");
    assert.equal(formatKilometers(4500), "4,500 km");
    assert.equal(formatPercentage(98.25), "98.3%");
  });

  it("uses N/A for unsafe empty values", () => {
    assert.equal(safeValue(null), "N/A");
    assert.equal(formatIndianCurrency(undefined), "N/A");
  });
});
