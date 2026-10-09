import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit", "transfer"],
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    relatedAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      default: null,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amountPaise: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isSafeInteger,
    },
    currency: {
      type: String,
      enum: ["INR"],
      default: "INR",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "Bank transfer",
    },
    status: {
      type: String,
      enum: ["completed"],
      default: "completed",
    },
  },
  { timestamps: true }
);

transactionSchema.index({ account: 1, createdAt: -1 });

export default mongoose.model("Transaction", transactionSchema);