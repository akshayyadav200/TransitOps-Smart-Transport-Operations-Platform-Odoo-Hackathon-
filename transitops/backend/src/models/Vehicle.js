import mongoose from "mongoose";
import { vehicleStatusValues, vehicleTypeValues, VEHICLE_STATUSES } from "../constants/enums.js";

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
      minlength: 3,
      maxlength: 30
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    model: {
      type: String,
      trim: true,
      default: null,
      maxlength: 100
    },
    type: {
      type: String,
      enum: vehicleTypeValues,
      required: true,
      index: true
    },
    maximumLoadCapacity: {
      type: Number,
      required: true,
      min: [0.01, "Maximum load capacity must be greater than zero"]
    },
    odometer: {
      type: Number,
      required: true,
      min: [0, "Odometer cannot be negative"],
      default: 0
    },
    acquisitionCost: {
      type: Number,
      min: [0, "Acquisition cost cannot be negative"],
      default: 0
    },
    region: {
      type: String,
      trim: true,
      default: null,
      index: true,
      maxlength: 80
    },
    status: {
      type: String,
      enum: vehicleStatusValues,
      default: VEHICLE_STATUSES.AVAILABLE,
      required: true,
      index: true
    },
    retiredAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

vehicleSchema.virtual("dispatchEligible").get(function dispatchEligible() {
  return this.status === VEHICLE_STATUSES.AVAILABLE;
});

vehicleSchema.index({ name: "text", model: "text", registrationNumber: "text", region: "text" });
vehicleSchema.index({ status: 1, type: 1, region: 1 });

export const Vehicle = mongoose.models.Vehicle ?? mongoose.model("Vehicle", vehicleSchema);
