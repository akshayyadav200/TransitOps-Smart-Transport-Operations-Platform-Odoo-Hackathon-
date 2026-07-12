import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DRIVER_STATUSES,
  LICENSE_CATEGORIES,
  VEHICLE_STATUSES,
  VEHICLE_TYPES
} from "../src/features/fleet/constants.js";
import { fieldErrors, formatDate, formatNumber } from "../src/features/fleet/formatters.js";

describe("fleet frontend helpers", () => {
  it("keeps frontend enum options aligned with fleet domain", () => {
    assert.deepEqual(VEHICLE_STATUSES, ["Available", "On Trip", "In Shop", "Retired"]);
    assert.deepEqual(DRIVER_STATUSES, ["Available", "On Trip", "Off Duty", "Suspended"]);
    assert.equal(VEHICLE_TYPES.includes("Tanker"), true);
    assert.equal(LICENSE_CATEGORIES.includes("Commercial"), true);
  });

  it("formats core display values", () => {
    assert.equal(formatNumber(123456), "1,23,456");
    assert.equal(formatDate(null), "-");
  });

  it("converts API validation errors into field maps", () => {
    const error = {
      errors: [
        { field: "registrationNumber", message: "Registration number already exists" },
        { field: "odometer", message: "Odometer cannot be negative" }
      ]
    };

    assert.deepEqual(fieldErrors(error), {
      registrationNumber: "Registration number already exists",
      odometer: "Odometer cannot be negative"
    });
  });
});
