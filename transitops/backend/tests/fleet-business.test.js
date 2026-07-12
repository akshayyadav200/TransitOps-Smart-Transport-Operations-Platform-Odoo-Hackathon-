import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DRIVER_STATUSES, VEHICLE_STATUSES, VEHICLE_TYPES } from "../src/constants/enums.js";
import { Driver } from "../src/models/Driver.js";
import { Vehicle } from "../src/models/Vehicle.js";
import { buildPagination, buildSort, pageResponse } from "../src/repositories/queryUtils.js";

function futureDate() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date;
}

function pastDate() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date;
}

describe("fleet business rules", () => {
  it("marks only available vehicles as dispatch eligible", () => {
    const availableVehicle = new Vehicle({
      registrationNumber: "KA01AB1234",
      name: "Truck One",
      type: VEHICLE_TYPES.TRUCK,
      maximumLoadCapacity: 12000,
      odometer: 100,
      status: VEHICLE_STATUSES.AVAILABLE
    });

    const retiredVehicle = new Vehicle({
      registrationNumber: "KA01AB9999",
      name: "Truck Two",
      type: VEHICLE_TYPES.TRUCK,
      maximumLoadCapacity: 12000,
      odometer: 100,
      status: VEHICLE_STATUSES.RETIRED
    });

    assert.equal(availableVehicle.dispatchEligible, true);
    assert.equal(retiredVehicle.dispatchEligible, false);
  });

  it("blocks drivers with expired licenses from dispatch", () => {
    const availableDriver = new Driver({
      name: "Ravi Kumar",
      licenseNumber: "DL1001",
      licenseCategory: "Heavy",
      licenseExpiryDate: futureDate(),
      contactNumber: "+91 9876543210",
      safetyScore: 92,
      status: DRIVER_STATUSES.AVAILABLE
    });

    const expiredDriver = new Driver({
      name: "Asha Rao",
      licenseNumber: "DL1002",
      licenseCategory: "Heavy",
      licenseExpiryDate: pastDate(),
      contactNumber: "+91 9876543211",
      safetyScore: 92,
      status: DRIVER_STATUSES.AVAILABLE
    });

    assert.equal(availableDriver.licenseExpired, false);
    assert.equal(availableDriver.dispatchEligible, true);
    assert.equal(expiredDriver.licenseExpired, true);
    assert.equal(expiredDriver.dispatchEligible, false);
  });

  it("builds bounded pagination and safe sort values", () => {
    assert.deepEqual(buildPagination({ page: "2", limit: "500" }), {
      page: 2,
      limit: 100,
      skip: 100
    });

    assert.deepEqual(buildSort({ sort: "name,desc" }, ["name"], "createdAt"), { name: -1 });
    assert.deepEqual(buildSort({ sort: "unsafe,asc" }, ["name"], "createdAt"), { createdAt: -1 });
  });

  it("builds predictable page metadata", () => {
    assert.deepEqual(pageResponse({ items: [1, 2], total: 12, page: 2, limit: 5 }).pagination, {
      page: 2,
      limit: 5,
      total: 12,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: true
    });
  });
});
