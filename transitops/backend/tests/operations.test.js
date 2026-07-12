import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DRIVER_STATUSES, MAINTENANCE_STATUSES, TRIP_STATUSES, VEHICLE_STATUSES } from "../src/constants/enums.js";
import { dispatchTrip, completeTrip, openMaintenance, closeMaintenance } from "../src/services/operationsService.js";

function makeRecord(fields) {
  return {
    saveCount: 0,
    async save() {
      this.saveCount += 1;
      return this;
    },
    ...fields
  };
}

describe("operations automation rules", () => {
  it("dispatches a draft trip and marks vehicle and driver on trip", async () => {
    const trip = makeRecord({
      status: TRIP_STATUSES.DRAFT,
      cargoWeight: 5000,
      timeline: []
    });
    const vehicle = makeRecord({
      status: VEHICLE_STATUSES.AVAILABLE,
      maximumLoadCapacity: 12000
    });
    const driver = makeRecord({
      status: DRIVER_STATUSES.AVAILABLE,
      licenseExpiryDate: new Date("2030-01-01T00:00:00.000Z")
    });

    await dispatchTrip({ trip, vehicle, driver, userId: "507f1f77bcf86cd799439011" });

    assert.equal(trip.status, TRIP_STATUSES.DISPATCHED);
    assert.equal(vehicle.status, VEHICLE_STATUSES.ON_TRIP);
    assert.equal(driver.status, DRIVER_STATUSES.ON_TRIP);
    assert.equal(trip.timeline.at(-1).status, TRIP_STATUSES.DISPATCHED);
  });

  it("rejects dispatch when cargo exceeds vehicle capacity", async () => {
    const trip = makeRecord({
      status: TRIP_STATUSES.DRAFT,
      cargoWeight: 15000,
      timeline: []
    });
    const vehicle = makeRecord({
      status: VEHICLE_STATUSES.AVAILABLE,
      maximumLoadCapacity: 12000
    });
    const driver = makeRecord({
      status: DRIVER_STATUSES.AVAILABLE,
      licenseExpiryDate: new Date("2030-01-01T00:00:00.000Z")
    });

    await assert.rejects(
      () => dispatchTrip({ trip, vehicle, driver, userId: "507f1f77bcf86cd799439011" }),
      /Cargo weight exceeds vehicle capacity/
    );
  });

  it("completes a dispatched trip and updates vehicle odometer", async () => {
    const trip = makeRecord({
      status: TRIP_STATUSES.DISPATCHED,
      distance: 240,
      timeline: []
    });
    const vehicle = makeRecord({
      status: VEHICLE_STATUSES.ON_TRIP,
      odometer: 1000
    });
    const driver = makeRecord({
      status: DRIVER_STATUSES.ON_TRIP
    });

    await completeTrip({ trip, vehicle, driver, userId: "507f1f77bcf86cd799439011" });

    assert.equal(trip.status, TRIP_STATUSES.COMPLETED);
    assert.equal(vehicle.status, VEHICLE_STATUSES.AVAILABLE);
    assert.equal(vehicle.odometer, 1240);
    assert.equal(driver.status, DRIVER_STATUSES.AVAILABLE);
  });

  it("keeps retired vehicles from becoming available after maintenance closure", async () => {
    const activeVehicle = makeRecord({
      status: VEHICLE_STATUSES.AVAILABLE
    });
    const maintenance = makeRecord({
      status: MAINTENANCE_STATUSES.ACTIVE,
      history: []
    });

    await openMaintenance({ maintenance, vehicle: activeVehicle, userId: "507f1f77bcf86cd799439011" });
    assert.equal(activeVehicle.status, VEHICLE_STATUSES.IN_SHOP);

    activeVehicle.status = VEHICLE_STATUSES.RETIRED;
    await closeMaintenance({ maintenance, vehicle: activeVehicle, userId: "507f1f77bcf86cd799439011" });

    assert.equal(maintenance.status, MAINTENANCE_STATUSES.COMPLETED);
    assert.equal(activeVehicle.status, VEHICLE_STATUSES.RETIRED);
  });
});
