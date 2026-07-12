import mongoose from "mongoose";
import { maintenanceStatusValues, MAINTENANCE_STATUSES } from "../constants/enums.js";

const maintenanceHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: maintenanceStatusValues,
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

const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 1000
    },
    cost: {
      type: Number,
      min: [0, "Maintenance cost cannot be negative"],
      default: 0
    },
    status: {
      type: String,
      enum: maintenanceStatusValues,
      default: MAINTENANCE_STATUSES.ACTIVE,
      required: true,
      index: true
    },
    openedAt: {
      type: Date,
      default: Date.now
    },
    closedAt: {
      type: Date,
      default: null
    },
    history: {
      type: [maintenanceHistorySchema],
      default: []
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

maintenanceSchema.index({ status: 1, vehicle: 1 });

export const Maintenance = mongoose.models.Maintenance ?? mongoose.model("Maintenance", maintenanceSchema);
