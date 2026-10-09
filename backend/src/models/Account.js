import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    accountType: {
      type: String,
      enum: ["savings", "current"],
      default: "savings",
    },
    currency: {
      type: String,
      enum: ["INR"],
      default: "INR",
    },
    // ₹100.00 is stored as 10000 paise.
    balancePaise: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isSafeInteger,
        message: "Balance must be an integer number of paise.",
      },
    },
    status: {
      type: String,
      enum: ["active", "frozen", "closed"],
      default: "active",
    },
  },
  { timestamps: true }
);

// accountSchema.index({ accountNumber: 1 }, { unique: true });
// accountSchema.index({ owner: 1, status: 1 });

export default mongoose.model("Account", accountSchema);