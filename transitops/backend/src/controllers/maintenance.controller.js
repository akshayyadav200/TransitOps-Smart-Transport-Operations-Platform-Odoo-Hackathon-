import { Maintenance } from "../models/Maintenance.js";
import { Vehicle } from "../models/Vehicle.js";
import { assertValidObjectId, closeMaintenance, openMaintenance } from "../services/operationsService.js";
import { successResponse } from "../utils/apiResponse.js";

const maintenancePopulate = [{ path: "vehicle", select: "registrationNumber name status odometer" }];

function pickMaintenancePayload(body) {
  return {
    vehicle: body.vehicle,
    title: body.title,
    description: body.description,
    cost: body.cost
  };
}

export async function getMaintenanceRecords(req, res, next) {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const maintenanceRecords = await Maintenance.find(filter).populate(maintenancePopulate).sort({ createdAt: -1 });

    return successResponse(res, {
      message: "Maintenance records retrieved",
      data: { maintenanceRecords }
    });
  } catch (error) {
    return next(error);
  }
}

export async function getMaintenanceById(req, res, next) {
  try {
    assertValidObjectId(req.params.id);
    const maintenance = await Maintenance.findById(req.params.id).populate(maintenancePopulate);

    if (!maintenance) {
      const error = new Error("Maintenance record not found");
      error.statusCode = 404;
      throw error;
    }

    return successResponse(res, {
      message: "Maintenance record retrieved",
      data: { maintenance }
    });
  } catch (error) {
    return next(error);
  }
}

export async function createMaintenance(req, res, next) {
  try {
    assertValidObjectId(req.body.vehicle, "vehicle");
    const vehicle = await Vehicle.findById(req.body.vehicle);
    const maintenance = new Maintenance(pickMaintenancePayload(req.body));
    const savedMaintenance = await openMaintenance({ maintenance, vehicle, userId: req.auth.userId });
    await savedMaintenance.populate(maintenancePopulate);

    return successResponse(res, {
      statusCode: 201,
      message: "Maintenance opened",
      data: { maintenance: savedMaintenance }
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateMaintenance(req, res, next) {
  try {
    assertValidObjectId(req.params.id);
    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      const error = new Error("Maintenance record not found");
      error.statusCode = 404;
      throw error;
    }

    if (maintenance.status !== "Active") {
      const error = new Error("Only active maintenance can be edited");
      error.statusCode = 400;
      throw error;
    }

    Object.assign(maintenance, {
      title: req.body.title,
      description: req.body.description,
      cost: req.body.cost,
      updatedBy: req.auth.userId
    });
    await maintenance.save();
    await maintenance.populate(maintenancePopulate);

    return successResponse(res, {
      message: "Maintenance updated",
      data: { maintenance }
    });
  } catch (error) {
    return next(error);
  }
}

export async function closeMaintenanceById(req, res, next) {
  try {
    assertValidObjectId(req.params.id);
    const maintenance = await Maintenance.findById(req.params.id);
    const vehicle = maintenance ? await Vehicle.findById(maintenance.vehicle) : null;
    const updatedMaintenance = await closeMaintenance({ maintenance, vehicle, userId: req.auth.userId });
    await updatedMaintenance.populate(maintenancePopulate);

    return successResponse(res, {
      message: "Maintenance closed",
      data: { maintenance: updatedMaintenance }
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteMaintenanceById(req, res, next) {
  try {
    assertValidObjectId(req.params.id);
    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      const error = new Error("Maintenance record not found");
      error.statusCode = 404;
      throw error;
    }

    if (maintenance.status === "Active") {
      const error = new Error("Close active maintenance before deleting it");
      error.statusCode = 400;
      throw error;
    }

    await maintenance.deleteOne();

    return successResponse(res, {
      message: "Maintenance deleted",
      data: {}
    });
  } catch (error) {
    return next(error);
  }
}
