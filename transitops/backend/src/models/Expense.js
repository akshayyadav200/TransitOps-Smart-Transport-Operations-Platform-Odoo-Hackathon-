import mongoose from "mongoose";
import { expenseCategoryValues, EXPENSE_CATEGORIES } from "../constants/enums.js";

const expenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: expenseCategoryValues,
      default: EXPENSE_CATEGORIES.OTHER,
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0.01, "Expense amount must be greater than zero"]
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 240
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
      index: true
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      default: null,
      index: true
    },
    expenseDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
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

expenseSchema.index({ category: 1, expenseDate: -1 });
expenseSchema.index({ vehicle: 1, expenseDate: -1 });

export const Expense = mongoose.models.Expense ?? mongoose.model("Expense", expenseSchema);
