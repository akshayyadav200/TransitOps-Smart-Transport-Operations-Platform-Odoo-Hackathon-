import mongoose from "mongoose";
import {
  DRIVER_STATUSES,
  driverStatusValues,
  licenseCategoryValues
} from "../constants/enums.js";

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
      minlength: 3,
      maxlength: 40
    },
    licenseCategory: {
      type: String,
      enum: licenseCategoryValues,
      required: true,
      index: true
    },
    licenseExpiryDate: {
      type: Date,
      required: true,
      index: true
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },
    safetyScore: {
      type: Number,
      required: true,
      min: [0, "Safety score cannot be less than zero"],
      max: [100, "Safety score cannot be greater than 100"],
      default: 100
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
      enum: driverStatusValues,
      default: DRIVER_STATUSES.AVAILABLE,
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

driverSchema.virtual("licenseExpired").get(function licenseExpired() {
  if (!this.licenseExpiryDate) {
    return true;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(this.licenseExpiryDate);
  expiry.setHours(0, 0, 0, 0);

  return expiry < today;
});

driverSchema.virtual("dispatchEligible").get(function dispatchEligible() {
  return this.status === DRIVER_STATUSES.AVAILABLE && !this.licenseExpired;
});

driverSchema.index({ licenseNumber: 1 }, { unique: true });
driverSchema.index({ name: "text", licenseNumber: "text", contactNumber: "text", region: "text" });
driverSchema.index({ status: 1, licenseCategory: 1, region: 1 });

export const Driver = mongoose.models.Driver ?? mongoose.model("Driver", driverSchema);

