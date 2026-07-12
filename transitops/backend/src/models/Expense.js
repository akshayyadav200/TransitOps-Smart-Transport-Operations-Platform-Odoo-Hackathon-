import mongoose from "mongoose";
import { expenseCategoryValues } from "../constants/enums.js";

const expenseSchema = new mongoose.Schema(
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
    category: {
      type: String,
      enum: expenseCategoryValues,
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be greater than zero"]
    },
    description: {
      type: String,
      trim: true,
      default: null,
      maxlength: 600
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    createdBy: {
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

expenseSchema.index({ date: -1, vehicleId: 1, category: 1 });
expenseSchema.index({ createdBy: "text", description: "text", category: "text" });

export const Expense = mongoose.models.Expense ?? mongoose.model("Expense", expenseSchema);
