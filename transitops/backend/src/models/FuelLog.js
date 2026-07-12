import mongoose from "mongoose";

const fuelLogSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      index: true
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      default: null,
      index: true
    },
    liters: {
      type: Number,
      required: true,
      min: [0.01, "Fuel liters must be greater than zero"]
    },
    cost: {
      type: Number,
      required: true,
      min: [0, "Fuel cost cannot be negative"]
    },
    odometer: {
      type: Number,
      min: [0, "Odometer cannot be negative"],
      default: 0
    },
    filledAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },
    vendor: {
      type: String,
      trim: true,
      maxlength: 120,
      default: null
    },
    region: {
      type: String,
      trim: true,
      maxlength: 80,
      default: null,
      index: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true
  }
);

fuelLogSchema.index({ vehicle: 1, filledAt: -1 });
fuelLogSchema.index({ trip: 1, filledAt: -1 });

export const FuelLog = mongoose.models.FuelLog ?? mongoose.model("FuelLog", fuelLogSchema);
