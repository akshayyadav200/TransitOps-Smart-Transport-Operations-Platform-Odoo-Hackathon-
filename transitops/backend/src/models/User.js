import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { ROLES, roleValues } from "../constants/enums.js";

const MIN_PASSWORD_LENGTH = 8;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: MIN_PASSWORD_LENGTH,
      select: false
    },
    role: {
      type: String,
      enum: roleValues,
      default: ROLES.DISPATCHER,
      required: true
    },
    region: {
      type: String,
      trim: true,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeUser = function toSafeUser() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    region: this.region,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export { MIN_PASSWORD_LENGTH };
export const User = mongoose.models.User ?? mongoose.model("User", userSchema);
