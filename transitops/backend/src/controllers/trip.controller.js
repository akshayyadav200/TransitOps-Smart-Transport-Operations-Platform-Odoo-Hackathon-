import { Driver } from "../models/Driver.js";
import { Trip } from "../models/Trip.js";
import { Vehicle } from "../models/Vehicle.js";
import { cancelTrip, completeTrip, dispatchTrip, assertValidObjectId } from "../services/operationsService.js";
import { successResponse } from "../utils/apiResponse.js";

const tripPopulate = [
  { path: "vehicle", select: "registrationNumber name status maximumLoadCapacity odometer" },
  { path: "driver", select: "name licenseNumber licenseExpiryDate status" }
];

function pickTripPayload(body) {
  return {
    tripNumber: body.tripNumber,
    source: body.source,
    destination: body.destination,
    vehicle: body.vehicle,
    driver: body.driver,
    cargoWeight: body.cargoWeight,
    distance: body.distance,
    revenue: body.revenue,
    fuel: body.fuel
  };
}

async function loadTripAssets(trip) {
  const [vehicle, driver] = await Promise.all([Vehicle.findById(trip.vehicle), Driver.findById(trip.driver)]);
  return { vehicle, driver };
}

export async function getTrips(req, res, next) {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const trips = await Trip.find(filter).populate(tripPopulate).sort({ createdAt: -1 });

    return successResponse(res, {
      message: "Trips retrieved",
      data: { trips }
    });
  } catch (error) {
    return next(error);
  }
}

export async function getTripById(req, res, next) {
  try {
    assertValidObjectId(req.params.id);
    const trip = await Trip.findById(req.params.id).populate(tripPopulate);

    if (!trip) {
      const error = new Error("Trip not found");
      error.statusCode = 404;
      throw error;
    }

    return successResponse(res, {
      message: "Trip retrieved",
      data: { trip }
    });
  } catch (error) {
    return next(error);
  }
}

export async function createTrip(req, res, next) {
  try {
    const trip = new Trip({
      ...pickTripPayload(req.body),
      createdBy: req.auth.userId,
      updatedBy: req.auth.userId,
      timeline: [
        {
          status: "Draft",
          note: "Trip created",
          changedBy: req.auth.userId
        }
      ]
    });

    await trip.save();
    await trip.populate(tripPopulate);

    return successResponse(res, {
      statusCode: 201,
      message: "Trip created",
      data: { trip }
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateTrip(req, res, next) {
  try {
    assertValidObjectId(req.params.id);
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      const error = new Error("Trip not found");
      error.statusCode = 404;
      throw error;
    }

    if (trip.status !== "Draft") {
      const error = new Error("Only draft trips can be edited");
      error.statusCode = 400;
      throw error;
    }

    Object.assign(trip, pickTripPayload(req.body), { updatedBy: req.auth.userId });
    await trip.save();
    await trip.populate(tripPopulate);

    return successResponse(res, {
      message: "Trip updated",
      data: { trip }
    });
  } catch (error) {
    return next(error);
  }
}

export async function dispatchTripById(req, res, next) {
  try {
    assertValidObjectId(req.params.id);
    const trip = await Trip.findById(req.params.id);
    const { vehicle, driver } = trip ? await loadTripAssets(trip) : { vehicle: null, driver: null };
    const updatedTrip = await dispatchTrip({ trip, vehicle, driver, userId: req.auth.userId });
    await updatedTrip.populate(tripPopulate);

    return successResponse(res, {
      message: "Trip dispatched",
      data: { trip: updatedTrip }
    });
  } catch (error) {
    return next(error);
  }
}

export async function completeTripById(req, res, next) {
  try {
    assertValidObjectId(req.params.id);
    const trip = await Trip.findById(req.params.id);
    const { vehicle, driver } = trip ? await loadTripAssets(trip) : { vehicle: null, driver: null };
    const updatedTrip = await completeTrip({ trip, vehicle, driver, userId: req.auth.userId });
    await updatedTrip.populate(tripPopulate);

    return successResponse(res, {
      message: "Trip completed",
      data: { trip: updatedTrip }
    });
  } catch (error) {
    return next(error);
  }
}

export async function cancelTripById(req, res, next) {
  try {
    assertValidObjectId(req.params.id);
    const trip = await Trip.findById(req.params.id);
    const { vehicle, driver } = trip ? await loadTripAssets(trip) : { vehicle: null, driver: null };
    const updatedTrip = await cancelTrip({ trip, vehicle, driver, userId: req.auth.userId });
    await updatedTrip.populate(tripPopulate);

    return successResponse(res, {
      message: "Trip cancelled",
      data: { trip: updatedTrip }
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteTripById(req, res, next) {
  try {
    assertValidObjectId(req.params.id);
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      const error = new Error("Trip not found");
      error.statusCode = 404;
      throw error;
    }

    if (!["Draft", "Cancelled"].includes(trip.status)) {
      const error = new Error("Only draft or cancelled trips can be deleted");
      error.statusCode = 400;
      throw error;
    }

    await trip.deleteOne();

    return successResponse(res, {
      message: "Trip deleted",
      data: {}
    });
  } catch (error) {
    return next(error);
  }
}

export async function getDispatchOptions(_req, res, next) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [vehicles, drivers] = await Promise.all([
      Vehicle.find({ status: "Available" }).sort({ registrationNumber: 1 }),
      Driver.find({ status: "Available", licenseExpiryDate: { $gte: today } }).sort({ name: 1 })
    ]);

    return successResponse(res, {
      message: "Dispatch options retrieved",
      data: { vehicles, drivers }
    });
  } catch (error) {
    return next(error);
  }
}
