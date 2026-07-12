import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  driverStatusValues,
  maintenanceStatusValues,
  roleValues,
  tripStatusValues,
  vehicleStatusValues
} from "../src/constants/enums.js";

describe("foundation constants", () => {
  it("exposes agreed role values", () => {
    assert.deepEqual(roleValues, [
      "Admin",
      "Fleet Manager",
      "Dispatcher",
      "Safety Officer",
      "Financial Analyst"
    ]);
  });

  it("exposes agreed status values", () => {
    assert.deepEqual(vehicleStatusValues, ["Available", "On Trip", "In Shop", "Retired"]);
    assert.deepEqual(driverStatusValues, ["Available", "On Trip", "Off Duty", "Suspended"]);
    assert.deepEqual(tripStatusValues, ["Draft", "Dispatched", "Completed", "Cancelled"]);
    assert.deepEqual(maintenanceStatusValues, ["Active", "Completed", "Cancelled"]);
  });
});
