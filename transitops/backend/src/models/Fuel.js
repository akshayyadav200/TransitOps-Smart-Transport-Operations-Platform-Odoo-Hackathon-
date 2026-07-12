import mongoose from "mongoose";
import { fuelTypeValues, FUEL_TYPES } from "../constants/enums.js";

const fuelSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      index: true
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      default: null,
      index: true
    },
    liters: {
      type: Number,
      required: true,
      min: [0.01, "Liters must be greater than zero"]
    },
    cost: {
      type: Number,
      required: true,
      min: [0.01, "Cost must be greater than zero"]
    },
    fuelType: {
      type: String,
      enum: fuelTypeValues,
      default: FUEL_TYPES.DIESEL,
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    odometer: {
      type: Number,
      required: true,
      min: [0, "Odometer cannot be negative"]
    },
    filledBy: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

fuelSchema.index({ date: -1, vehicleId: 1 });
fuelSchema.index({ filledBy: "text", fuelType: "text" });

export const Fuel = mongoose.models.Fuel ?? mongoose.model("Fuel", fuelSchema);
