import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DRIVER_STATUSES, VEHICLE_STATUSES, VEHICLE_TYPES } from "../src/constants/enums.js";
import { validateDriverCreate } from "../src/validators/driverValidator.js";
import { validateVehicleCreate } from "../src/validators/vehicleValidator.js";

describe("fleet validation", () => {
  it("normalizes valid vehicle payloads", () => {
    const vehicle = validateVehicleCreate({
      registrationNumber: " ka01ab1234 ",
      name: "City Truck",
      type: VEHICLE_TYPES.TRUCK,
      maximumLoadCapacity: 12000,
      odometer: 5000,
      acquisitionCost: 1000000,
      region: "South",
      status: VEHICLE_STATUSES.AVAILABLE
    });

    assert.equal(vehicle.registrationNumber, "KA01AB1234");
    assert.equal(vehicle.maximumLoadCapacity, 12000);
  });

  it("rejects invalid vehicle payloads", () => {
    assert.throws(
      () =>
        validateVehicleCreate({
          registrationNumber: "KA01AB1234",
          name: "City Truck",
          type: VEHICLE_TYPES.TRUCK,
          maximumLoadCapacity: 0,
          odometer: -1,
          status: VEHICLE_STATUSES.AVAILABLE
        }),
      /Validation failed/
    );
  });

  it("normalizes valid driver payloads", () => {
    const driver = validateDriverCreate({
      name: "Ravi Kumar",
      licenseNumber: " dl-7788 ",
      licenseCategory: "Heavy",
      licenseExpiryDate: "2030-01-01",
      contactNumber: "+91 9876543210",
      safetyScore: 95,
      region: "South",
      status: DRIVER_STATUSES.AVAILABLE
    });

    assert.equal(driver.licenseNumber, "DL-7788");
    assert.equal(driver.safetyScore, 95);
  });

  it("rejects invalid driver payloads", () => {
    assert.throws(
      () =>
        validateDriverCreate({
          name: "Ravi Kumar",
          licenseNumber: "DL-7788",
          licenseCategory: "Heavy",
          licenseExpiryDate: "bad-date",
          contactNumber: "x",
          safetyScore: 120,
          status: DRIVER_STATUSES.AVAILABLE
        }),
      /Validation failed/
    );
  });
});
