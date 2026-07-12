import mongoose from "mongoose";
import { tripStatusValues, TRIP_STATUSES } from "../constants/enums.js";

const timelineEntrySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: tripStatusValues,
      required: true
    },
    note: {
      type: String,
      trim: true,
      maxlength: 240,
      default: null
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    changedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    tripNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
      minlength: 3,
      maxlength: 40
    },
    source: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    destination: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      index: true
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
      index: true
    },
    cargoWeight: {
      type: Number,
      required: true,
      min: [0.01, "Cargo weight must be greater than zero"]
    },
    distance: {
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
    },
    fuel: {
      type: Number,
      required: true,
      min: [0, "Fuel cannot be negative"],
      default: 0
    },
    status: {
      type: String,
      enum: tripStatusValues,
      default: TRIP_STATUSES.DRAFT,
      required: true,
      index: true
    },
    timeline: {
      type: [timelineEntrySchema],
      default: []
    },
    dispatchedAt: {
      type: Date,
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    },
    cancelledAt: {
      type: Date,
      default: null
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

tripSchema.index({ status: 1, vehicle: 1, driver: 1 });
tripSchema.index({ tripNumber: "text", source: "text", destination: "text" });

export const Trip = mongoose.models.Trip ?? mongoose.model("Trip", tripSchema);
