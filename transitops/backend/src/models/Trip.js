import mongoose from "mongoose";
import { tripStatusValues, TRIP_STATUSES } from "../constants/enums.js";

const tripSchema = new mongoose.Schema(
  {
    tripCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
      minlength: 3,
      maxlength: 40
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      index: true
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
      index: true
    },
    origin: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    destination: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
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
      enum: tripStatusValues,
      default: TRIP_STATUSES.DRAFT,
      required: true,
      index: true
    },
    scheduledStart: {
      type: Date,
      required: true,
      index: true
    },
    scheduledEnd: {
      type: Date,
      default: null
    },
    distanceKm: {
      type: Number,
      required: true,
      min: [0, "Distance cannot be negative"],
      default: 0
    },
    revenue: {
      type: Number,
      required: true,
      min: [0, "Revenue cannot be negative"],
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tripSchema.index({ tripCode: "text", origin: "text", destination: "text", region: "text" });
tripSchema.index({ status: 1, region: 1, scheduledStart: -1 });

export const Trip = mongoose.models.Trip ?? mongoose.model("Trip", tripSchema);
